"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ImagePlus, LoaderCircle, X, CircleAlert, Check } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import type { FormContent } from "@/content/types";
import {
  createPhotosSchema,
  createQuoteFieldsSchema,
  PHOTO_LIMITS,
  type QuoteFields,
  type QuoteFieldsInput,
  type QuoteResponse,
} from "@/lib/schemas";
import { compressImage, formatBytes } from "@/lib/compress-image";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { cn } from "@/lib/cn";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

interface Photo {
  id: string;
  file: File;
  url: string;
}

type Status = { type: "idle" } | { type: "submitting" } | { type: "success" } | { type: "error"; message: string };

const inputClass =
  "block w-full rounded-xl border border-line bg-cream/60 px-4 text-[0.95rem] text-ink placeholder:text-stone/70 transition-[border-color,background-color] duration-300 hover:border-stone/40 focus:border-clay focus:bg-white focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 aria-invalid:border-error";

export function QuoteForm({ content }: { content: FormContent }) {
  const { fields: t } = content;
  const schema = useMemo(() => createQuoteFieldsSchema(content.validation), [content.validation]);
  const photosSchema = useMemo(() => createPhotosSchema(content.validation), [content.validation]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFieldsInput, unknown, QuoteFields>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rooms: "",
      style: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const turnstileRef = useRef<TurnstileHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const totalBytes = photos.reduce((sum, p) => sum + p.file.size, 0);
  const overLimit = totalBytes > PHOTO_LIMITS.maxTotalBytes;

  // Libère les aperçus à la destruction du composant.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const addFiles = useCallback(
    async (list: FileList | File[]) => {
      setPhotoError(null);
      const incoming = Array.from(list);
      const accepted = incoming.filter((f) => (PHOTO_LIMITS.acceptedTypes as readonly string[]).includes(f.type));
      if (accepted.length < incoming.length) setPhotoError(content.validation.photosType);

      const slots = PHOTO_LIMITS.maxFiles - photosRef.current.length;
      if (accepted.length > slots) setPhotoError(content.validation.photosTooMany);
      const toProcess = accepted.slice(0, Math.max(0, slots));
      if (toProcess.length === 0) return;

      setProcessing(true);
      try {
        const compressed: Photo[] = [];
        // Traitement séquentiel : limite la mémoire utilisée sur mobile.
        for (const file of toProcess) {
          const output = await compressImage(file);
          compressed.push({ id: crypto.randomUUID(), file: output, url: URL.createObjectURL(output) });
        }
        setPhotos((prev) => [...prev, ...compressed]);
      } finally {
        setProcessing(false);
      }
    },
    [content.validation],
  );

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
    setPhotoError(null);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
  };

  const onSubmit = async (values: QuoteFields) => {
    const files = photos.map((p) => p.file);
    const photoCheck = photosSchema.safeParse(files);
    if (!photoCheck.success) {
      setPhotoError(photoCheck.error.issues[0]?.message ?? content.validation.photosTooLarge);
      return;
    }
    if (!token) {
      setStatus({ type: "error", message: content.errorTurnstile });
      turnstileRef.current?.reset();
      return;
    }

    setStatus({ type: "submitting" });
    const body = new FormData();
    body.append("name", values.name);
    body.append("email", values.email);
    body.append("phone", values.phone);
    body.append("profile", values.profile);
    body.append("rooms", values.rooms);
    body.append("style", values.style);
    body.append("message", values.message);
    body.append("consent", String(values.consent));
    body.append("website", values.website ?? "");
    body.append("cf-turnstile-response", token);
    files.forEach((file) => body.append("photos", file, file.name));

    try {
      const res = await fetch("/api/devis", { method: "POST", body });
      const data = (await res.json().catch(() => ({ ok: false, error: "server" }))) as QuoteResponse;
      if (data.ok) {
        setStatus({ type: "success" });
        reset();
        photos.forEach((p) => URL.revokeObjectURL(p.url));
        setPhotos([]);
        return;
      }
      const message =
        data.error === "turnstile"
          ? content.errorTurnstile
          : data.error === "rate_limit"
            ? content.errorRateLimit
            : data.error === "too_large"
              ? content.validation.photosTooLarge
              : content.errorGeneric;
      setStatus({ type: "error", message });
    } catch {
      setStatus({ type: "error", message: content.errorGeneric });
    }
    // Un jeton Turnstile n'est valable qu'une fois.
    turnstileRef.current?.reset();
  };

  // Ramène le message de succès dans la vue.
  useEffect(() => {
    if (status.type === "success") statusRef.current?.focus();
  }, [status.type]);

  const submitting = status.type === "submitting";
  const fieldId = (name: string) => `${uid}-${name}`;

  return (
    <div className="relative rounded-2xl border border-line bg-white p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status.type === "success" ? (
          <m.div
            key="success"
            ref={statusRef}
            tabIndex={-1}
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[28rem] flex-col items-start justify-center py-6 focus:outline-none"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-sand text-clay">
              <Check className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-8 font-serif text-4xl leading-[1.1] text-balance sm:text-5xl">
              <RichText text={content.successTitle} />
            </h3>
            <p className="mt-5 max-w-md leading-relaxed text-stone">{content.successMessage}</p>
            <Button variant="secondary" className="mt-10" onClick={() => setStatus({ type: "idle" })}>
              {content.successReset}
            </Button>
          </m.div>
        ) : (
          <m.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-busy={submitting}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id={fieldId("name")} label={t.name} error={errors.name?.message} className="sm:col-span-2">
                <input
                  id={fieldId("name")}
                  type="text"
                  autoComplete="name"
                  className={cn(inputClass, "h-12")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${fieldId("name")}-error` : undefined}
                  {...register("name")}
                />
              </Field>
              <Field id={fieldId("email")} label={t.email} error={errors.email?.message}>
                <input
                  id={fieldId("email")}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  className={cn(inputClass, "h-12")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${fieldId("email")}-error` : undefined}
                  {...register("email")}
                />
              </Field>
              <Field id={fieldId("phone")} label={t.phone} optional={t.optional} error={errors.phone?.message}>
                <input
                  id={fieldId("phone")}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className={cn(inputClass, "h-12")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? `${fieldId("phone")}-error` : undefined}
                  {...register("phone")}
                />
              </Field>
              <Field id={fieldId("profile")} label={t.profile} error={errors.profile?.message}>
                <SelectWrapper>
                  <select
                    id={fieldId("profile")}
                    defaultValue=""
                    className={cn(inputClass, "h-12 appearance-none pr-10")}
                    aria-invalid={!!errors.profile}
                    aria-describedby={errors.profile ? `${fieldId("profile")}-error` : undefined}
                    {...register("profile")}
                  >
                    <option value="" disabled>
                      {t.profilePlaceholder}
                    </option>
                    {content.profiles.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </Field>
              <Field id={fieldId("rooms")} label={t.rooms} error={errors.rooms?.message}>
                <input
                  id={fieldId("rooms")}
                  type="number"
                  min={1}
                  max={50}
                  inputMode="numeric"
                  className={cn(inputClass, "h-12")}
                  aria-invalid={!!errors.rooms}
                  aria-describedby={errors.rooms ? `${fieldId("rooms")}-error` : undefined}
                  {...register("rooms")}
                />
              </Field>
              <Field id={fieldId("style")} label={t.style} optional={t.optional} className="sm:col-span-2">
                <SelectWrapper>
                  <select id={fieldId("style")} className={cn(inputClass, "h-12 appearance-none pr-10")} {...register("style")}>
                    <option value="">{t.stylePlaceholder}</option>
                    {content.styles.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </Field>
              <Field id={fieldId("message")} label={t.message} error={errors.message?.message} className="sm:col-span-2">
                <textarea
                  id={fieldId("message")}
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  className={cn(inputClass, "min-h-28 resize-y py-3 leading-relaxed")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? `${fieldId("message")}-error` : undefined}
                  {...register("message")}
                />
              </Field>
            </div>

            {/* Photos */}
            <fieldset>
              <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-medium text-ink">
                <span>
                  {t.photos} <span className="font-normal text-stone">({t.optional})</span>
                </span>
                {photos.length > 0 && (
                  <span className={cn("text-xs font-normal", overLimit ? "text-error" : "text-stone")}>
                    {t.photosTotal} : {formatBytes(totalBytes)} / {formatBytes(PHOTO_LIMITS.maxTotalBytes)}
                  </span>
                )}
              </legend>
              <label
                htmlFor={fieldId("photos")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors duration-300 focus-within:border-clay focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-clay",
                  dragOver ? "border-clay bg-sand" : "border-stone/35 bg-cream/60 hover:border-clay hover:bg-sand/60",
                  photos.length >= PHOTO_LIMITS.maxFiles && "pointer-events-none opacity-50",
                )}
              >
                {processing ? (
                  <LoaderCircle className="size-6 animate-spin text-clay" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <ImagePlus className="size-6 text-clay" strokeWidth={1.25} aria-hidden="true" />
                )}
                <span className="text-sm font-medium text-ink">{processing ? t.photosProcessing : t.photosDrop}</span>
                <span className="text-sm text-stone">{t.photosBrowse}</span>
                <input
                  ref={fileInputRef}
                  id={fieldId("photos")}
                  type="file"
                  multiple
                  accept={PHOTO_LIMITS.acceptedTypes.join(",")}
                  className="sr-only"
                  disabled={processing || photos.length >= PHOTO_LIMITS.maxFiles}
                  aria-describedby={`${fieldId("photos")}-hint`}
                  onChange={(e) => {
                    if (e.target.files?.length) void addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              <p id={`${fieldId("photos")}-hint`} className="mt-2 text-xs text-stone">
                {t.photosHint}
              </p>

              {photos.length > 0 && (
                <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {photos.map((photo, i) => (
                    <li key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-sand">
                      {/* Aperçu local (blob:) : next/image n'est pas adapté ici. */}
                      <img src={photo.url} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        aria-label={`${t.photosRemove} ${i + 1}`}
                        className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-ink/70 text-cream backdrop-blur-sm transition-colors hover:bg-ink"
                      >
                        <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {(photoError || overLimit) && (
                <p className="mt-3 flex items-center gap-2 text-sm text-error" role="alert">
                  <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {overLimit ? content.validation.photosTooLarge : photoError}
                </p>
              )}
            </fieldset>

            {/* Honeypot : invisible pour les humains, rempli par les robots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={fieldId("website")}>Site web</label>
              <input id={fieldId("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            {/* Consentement RGPD */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  id={fieldId("consent")}
                  type="checkbox"
                  className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-clay-dark"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${fieldId("consent")}-error` : undefined}
                  {...register("consent")}
                />
                <label htmlFor={fieldId("consent")} className="cursor-pointer text-sm leading-relaxed text-stone">
                  {t.consent}{" "}
                  <Link href="/confidentialite" className="text-clay-deep underline underline-offset-4" target="_blank">
                    {t.consentLink}
                  </Link>
                  .
                </label>
              </div>
              {errors.consent?.message && <ErrorText id={`${fieldId("consent")}-error`}>{errors.consent.message}</ErrorText>}
            </div>

            <Turnstile ref={turnstileRef} siteKey={SITE_KEY} onToken={setToken} />

            <div aria-live="polite">
              {status.type === "error" && (
                <p className="flex items-start gap-2 rounded-xl bg-error/8 px-4 py-3 text-sm text-error" role="alert">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {status.message}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting || processing || overLimit}>
              {submitting && <LoaderCircle className="size-4 animate-spin" strokeWidth={1.75} aria-hidden="true" />}
              {submitting ? content.submitting : content.submit}
            </Button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label} {optional && <span className="font-normal text-stone">({optional})</span>}
      </label>
      {children}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm text-error">
      {children}
    </p>
  );
}

function SelectWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-stone"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}

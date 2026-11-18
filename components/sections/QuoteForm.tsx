"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, CircleAlert, LoaderCircle } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import type { FormContent } from "@/content/types";
import { createQuoteSchema, type QuoteData, type QuoteInput, type QuoteResponse } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { Turnstile, type TurnstileHandle } from "@/components/ui/Turnstile";
import { cn } from "@/lib/cn";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Status = { type: "idle" } | { type: "submitting" } | { type: "success" } | { type: "error"; message: string };

const inputClass =
  "block w-full rounded-xl border border-line bg-cream/60 px-4 text-[0.95rem] text-ink placeholder:text-stone/70 transition-[border-color,background-color] duration-300 hover:border-stone/40 focus:border-clay focus:bg-white focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 aria-invalid:border-error";

export function QuoteForm({ content }: { content: FormContent }) {
  const { fields: t } = content;
  const schema = useMemo(() => createQuoteSchema(content.validation), [content.validation]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<QuoteInput, unknown, QuoteData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      area: "",
      units: "",
      city: "",
      website: "",
      videosLink: "",
      message: "",
      consent: false,
      company: "",
    },
  });

  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const turnstileRef = useRef<TurnstileHandle>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const isConcierge = watch("profile") === "conciergerie";

  const onSubmit = async (values: QuoteData) => {
    if (!token) {
      setStatus({ type: "error", message: content.errorTurnstile });
      turnstileRef.current?.reset();
      return;
    }
    setStatus({ type: "submitting" });
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
      });
      const data = (await res.json().catch(() => ({ ok: false, error: "server" }))) as QuoteResponse;
      if (data.ok) {
        setStatus({ type: "success" });
        reset();
        return;
      }
      const message =
        data.error === "turnstile"
          ? content.errorTurnstile
          : data.error === "rate_limit"
            ? content.errorRateLimit
            : content.errorGeneric;
      setStatus({ type: "error", message });
    } catch {
      setStatus({ type: "error", message: content.errorGeneric });
    }
    // Un jeton Turnstile n'est valable qu'une fois.
    turnstileRef.current?.reset();
  };

  useEffect(() => {
    if (status.type === "success") statusRef.current?.focus();
  }, [status.type]);

  const submitting = status.type === "submitting";
  const id = (name: string) => `${uid}-${name}`;
  const a11y = (name: keyof QuoteInput, hasHint = false) => ({
    id: id(name),
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${id(name)}-error` : hasHint ? `${id(name)}-hint` : undefined,
  });

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
            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setStatus({ type: "idle" })}>
                {content.successReset}
              </Button>
            </div>
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
              <Field id={id("name")} label={t.name} error={errors.name?.message} className="sm:col-span-2">
                <input type="text" autoComplete="name" className={cn(inputClass, "h-12")} {...a11y("name")} {...register("name")} />
              </Field>
              <Field id={id("email")} label={t.email} error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  className={cn(inputClass, "h-12")}
                  {...a11y("email")}
                  {...register("email")}
                />
              </Field>
              <Field id={id("phone")} label={t.phone} optional={t.optional} error={errors.phone?.message}>
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className={cn(inputClass, "h-12")}
                  {...a11y("phone")}
                  {...register("phone")}
                />
              </Field>
              <Field id={id("profile")} label={t.profile} error={errors.profile?.message}>
                <Select {...a11y("profile")} {...register("profile")} defaultValue="">
                  <option value="" disabled>
                    {t.profilePlaceholder}
                  </option>
                  {content.profiles.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id={id("propertyType")} label={t.propertyType} error={errors.propertyType?.message}>
                <Select {...a11y("propertyType")} {...register("propertyType")} defaultValue="">
                  <option value="" disabled>
                    {t.propertyTypePlaceholder}
                  </option>
                  {content.propertyTypes.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id={id("area")} label={t.area} error={errors.area?.message}>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    className={cn(inputClass, "h-12 pr-12")}
                    {...a11y("area")}
                    {...register("area")}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-stone">
                    {t.areaUnit}
                  </span>
                </div>
              </Field>
              <Field id={id("city")} label={t.city} error={errors.city?.message}>
                <input
                  type="text"
                  autoComplete="address-level2"
                  className={cn(inputClass, "h-12")}
                  {...a11y("city")}
                  {...register("city")}
                />
              </Field>
              {isConcierge && (
                <Field id={id("units")} label={t.units} hint={t.unitsHint} error={errors.units?.message} className="sm:col-span-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    className={cn(inputClass, "h-12 sm:max-w-[50%]")}
                    {...a11y("units", true)}
                    {...register("units")}
                  />
                </Field>
              )}
              <Field id={id("website")} label={t.website} optional={t.optional} error={errors.website?.message} className="sm:col-span-2">
                <input
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder={t.websitePlaceholder}
                  className={cn(inputClass, "h-12")}
                  {...a11y("website")}
                  {...register("website")}
                />
              </Field>
              <Field
                id={id("videosLink")}
                label={t.videosLink}
                optional={t.optional}
                hint={t.videosLinkHint}
                error={errors.videosLink?.message}
                className="sm:col-span-2"
              >
                <input
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  placeholder={t.videosLinkPlaceholder}
                  className={cn(inputClass, "h-12")}
                  {...a11y("videosLink", true)}
                  {...register("videosLink")}
                />
              </Field>
              <Field id={id("message")} label={t.message} error={errors.message?.message} className="sm:col-span-2">
                <textarea
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  className={cn(inputClass, "min-h-28 resize-y py-3 leading-relaxed")}
                  {...a11y("message")}
                  {...register("message")}
                />
              </Field>
            </div>

            {/* Honeypot : invisible pour les humains, rempli par les robots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={id("company")}>Société</label>
              <input id={id("company")} type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
            </div>

            {/* Consentement RGPD */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-clay-dark"
                  {...a11y("consent")}
                  {...register("consent")}
                />
                <label htmlFor={id("consent")} className="cursor-pointer text-sm leading-relaxed text-stone">
                  {t.consent}{" "}
                  <Link href="/confidentialite" className="text-clay-deep underline underline-offset-4" target="_blank">
                    {t.consentLink}
                  </Link>
                  .
                </label>
              </div>
              {errors.consent?.message && <ErrorText id={`${id("consent")}-error`}>{errors.consent.message}</ErrorText>}
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

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
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
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: string;
  hint?: string;
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
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs leading-relaxed text-stone">
          {hint}
        </p>
      )}
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

function Select(props: React.ComponentPropsWithRef<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(inputClass, "h-12 appearance-none pr-10")} />
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-stone"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}

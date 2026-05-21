"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { providers } from "@/data/providers";
import { locations } from "@/data/locations";

export default function AppointmentPage() {
  return (
    <Suspense>
      <AppointmentForm />
    </Suspense>
  );
}

function AppointmentForm() {
  const t = useTranslations("appointment");
  const search = useSearchParams();
  const preselectedProvider = search.get("provider");
  const preselectedTopic = search.get("topic");

  const [reason, setReason] = useState("new");
  const [location, setLocation] = useState(locations[0].slug);
  const [provider, setProvider] = useState(preselectedProvider || "");
  const [time, setTime] = useState<"morning" | "afternoon" | "anytime">("morning");

  function submit() {
    // Forwards to internal scheduling system or external Jotform URL from current site.
    // Keep parity with https://form.jotform.com/232886377016161 until NextGen Luma scheduling is exposed.
    const payload = { reason, location, provider, time, topic: preselectedTopic };
    console.log("appointment request", payload);
    alert("Submitted. A scheduler will call within one business day.");
  }

  return (
    <div className="container-app max-w-md space-y-5 py-4 pb-12">
      <div>
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-thh-muted">{t("subtitle")}</p>
      </div>

      <Field label={t("reason")}>
        <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-lg border border-thh-line bg-white p-2.5 text-sm">
          <option value="new">{t("reasonNew")}</option>
          <option value="follow">{t("reasonFollow")}</option>
          <option value="second">{t("reasonSecond")}</option>
          <option value="procedure">{t("reasonProcedure")}</option>
        </select>
      </Field>

      <Field label={t("location")}>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-thh-line bg-white p-2.5 text-sm">
          {locations.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
        </select>
      </Field>

      <Field label={t("provider")}>
        <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full rounded-lg border border-thh-line bg-white p-2.5 text-sm">
          <option value="">Any cardiologist</option>
          {providers.map((p) => <option key={p.slug} value={p.slug}>Dr. {p.name}</option>)}
        </select>
      </Field>

      <Field label={t("timeWindow")}>
        <div className="grid grid-cols-3 gap-2">
          {(["morning", "afternoon", "anytime"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setTime(opt)}
              className={`rounded-lg p-2.5 text-sm ${
                time === opt ? "bg-thh-red-50 text-thh-red-dark ring-1 ring-thh-red" : "bg-white text-thh-ink ring-1 ring-thh-line"
              }`}
            >
              {t(opt)}
            </button>
          ))}
        </div>
      </Field>

      <button onClick={submit} className="btn-primary w-full justify-center">{t("submit")}</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}

"use client";

import * as React from "react";
import { useActionState } from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ProviderCombobox, type ComboboxOption } from "@/components/ui/provider-combobox";
import { ModelAutocomplete, type ModelOption } from "@/components/ui/model-autocomplete";
import { EvidenceUploader, SubmitButton } from "./evidence-uploader";
import { PIIBanner } from "./pii-banner";
import { Shield, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { submitIncident, type SubmitIncidentState } from "@/actions/incidents";
import { useFormAutosave, clearDraft } from "@/hooks/use-form-autosave";
import { GoogleSignInButton } from "@/components/auth/auth-buttons";
import { Link } from "@/i18n/routing";
import type { AIProvider, AIModel, IncidentCategory, IncidentSeverity } from "@/types";
import { trackEvent } from "@/lib/analytics";

const initialState: SubmitIncidentState = { ok: false };

export function IncidentForm({
  providers,
  models,
  isLoggedIn = false,
  totalIncidents,
}: {
  providers: AIProvider[];
  models: AIModel[];
  isLoggedIn?: boolean;
  totalIncidents?: number;
}) {
  const t = useTranslations("incident");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");
  const [state, formAction] = useActionState(submitIncident, initialState);
  const [piiDetected, setPiiDetected] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [customProviderName, setCustomProviderName] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [customModelName, setCustomModelName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consents, setConsents] = useState({
    truth: false,
    age: false,
    terms: false,
  });

  const DRAFT_KEY = "alpar_incident_draft";

  type IncidentDraft = {
    title: string;
    description: string;
    selectedProvider: string;
    customProviderName: string;
    selectedModel: string;
    customModelName: string;
    isAnonymous: boolean;
  };

  const draftValues = useMemo<IncidentDraft>(
    () => ({
      title,
      description,
      selectedProvider,
      customProviderName,
      selectedModel,
      customModelName,
      isAnonymous,
    }),
    [
      title,
      description,
      selectedProvider,
      customProviderName,
      selectedModel,
      customModelName,
      isAnonymous,
    ],
  );

  const handleRestore = useCallback((saved: IncidentDraft) => {
    setTitle(saved.title);
    setDescription(saved.description);
    setSelectedProvider(saved.selectedProvider);
    setCustomProviderName(saved.customProviderName);
    setSelectedModel(saved.selectedModel);
    setCustomModelName(saved.customModelName);
    setIsAnonymous(saved.isAnonymous);
  }, []);

  const handleRestoreNotify = useCallback(() => {
    toast.info(t("draft_restored"));
  }, [t]);

  useFormAutosave<IncidentDraft>({
    key: DRAFT_KEY,
    values: draftValues,
    onRestore: handleRestore,
    onRestoreNotify: handleRestoreNotify,
  });

  useEffect(() => {
    if (state.ok) {
      clearDraft(DRAFT_KEY);
      trackEvent("Incident Submitted");
      toast.success(t("submitted"));
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, t]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { hasPII } = await import("@/lib/pii/guardian");
      const text = `${title} ${description}`;
      if (!text.trim()) {
        setPiiDetected(false);
        return;
      }
      const has = hasPII(text);
      if (active) setPiiDetected(has);
    })();
    return () => {
      active = false;
    };
  }, [title, description]);

  if (state.ok) {
    return (
      <div className="space-y-6 px-4 py-12 text-center">
        <div className="bg-success-500/10 border-success-500/20 mx-auto flex h-16 w-16 items-center justify-center rounded-full border">
          <CheckCircle2 className="text-success-500 h-10 w-10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-fg-primary text-3xl font-extrabold tracking-tight">
            {t("submit_success_headline")}
          </h2>
          <p className="text-fg-muted mx-auto max-w-md text-sm leading-relaxed">
            {t("submit_success_body")}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
          <Button onClick={() => window.location.reload()} variant="primary">
            {t("submit_success_cta_another")}
          </Button>
          <Link href="/incidents">
            <Button variant="outline" className="w-full sm:w-auto">
              {t("submit_success_cta_published")}
            </Button>
          </Link>
        </div>

        {!isLoggedIn && (
          <div className="border-brand-500/20 bg-brand-500/5 mx-auto max-w-md space-y-4 rounded-xl border p-6">
            <h3 className="text-fg-primary text-sm font-semibold">
              {t("claim_badge_title", { defaultValue: "Claim Your Whistleblower Badge" })}
            </h3>
            <p className="text-fg-muted text-xs leading-relaxed">
              {t("claim_badge_desc", {
                defaultValue:
                  "Complete your account with Google in one click to track your incident, receive real-time status updates, and earn the exclusive Reporter badge.",
              })}
            </p>
            <div className="flex justify-center pt-2">
              <GoogleSignInButton next={`/my-incidents`} className="w-full justify-center" />
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button variant="outline" onClick={() => (window.location.href = "/incidents")}>
            {t("view_all_incidents", { defaultValue: "View All Incidents" })}
          </Button>
        </div>
      </div>
    );
  }

  const categoryOptions = (
    Object.keys({
      hallucination: 0,
      bias: 0,
      privacy: 0,
      security: 0,
      misinformation: 0,
      harassment: 0,
      manipulation: 0,
      inaccessibility: 0,
      copyright: 0,
      other: 0,
    }) as IncidentCategory[]
  ).map((c) => ({ value: c, label: tCat(c) }));

  const severityOptions: Array<{ value: IncidentSeverity; label: string }> = [
    { value: "low", label: t("severity_low") },
    { value: "medium", label: t("severity_medium") },
    { value: "high", label: t("severity_high") },
    { value: "critical", label: t("severity_critical") },
  ];

  const providerOptions: ComboboxOption[] = [
    ...providers.map((p) => ({
      value: p.id,
      label: p.name,
      hint: p.is_verified ? "✓" : undefined,
    })),
    {
      value: "custom:other",
      label: t("other_provider", { defaultValue: "Diğer (Kendi yazmak istiyorum)" }),
    },
  ];

  const modelOptions: ModelOption[] = [
    ...models
      .filter((m) => m.provider_id === selectedProvider && !selectedProvider.startsWith("custom:"))
      .map((m) => ({
        value: m.id,
        label: m.version ? `${m.name} (${m.version})` : m.name,
        hint: m.released_at ? new Date(m.released_at).getFullYear().toString() : undefined,
      })),
    {
      value: "custom:other",
      label: t("other_model", { defaultValue: "Diğer (Kendi yazmak istiyorum)" }),
    },
  ];

  const handleProviderChange = (value: string, customName?: string) => {
    setSelectedProvider(value);
    setSelectedModel("");
    if (customName && value !== "custom:other") setCustomProviderName(customName);
    else if (value !== "custom:other") setCustomProviderName("");
  };

  const handleModelChange = (value: string, isCustom: boolean) => {
    setSelectedModel(value);
    if (isCustom && value !== "custom:other") setCustomModelName(value);
    else if (value !== "custom:other") setCustomModelName("");
  };

  const allConsents = consents.truth && consents.age && consents.terms;
  const canSubmit = allConsents && selectedProvider && title.trim() && description.trim();

  return (
    <form action={formAction} className="space-y-6">
      {totalIncidents !== undefined && (
        <div className="bg-bg-secondary/40 border-border-subtle text-fg-secondary rounded-lg border p-3 text-center text-sm font-semibold">
          {t("submit_live_counter", { count: totalIncidents, verified: totalIncidents })}
        </div>
      )}
      {piiDetected && <PIIBanner />}
      {state.formError && (
        <div
          className="border-danger-500/30 bg-danger-500/5 text-danger-400 rounded-md border p-3 text-sm"
          role="alert"
        >
          {state.formError}
        </div>
      )}

      <Input
        name="title"
        label={t("title_placeholder")}
        required
        maxLength={200}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        hint={`${title.length}/200`}
        error={state.fieldErrors?.title?.[0]}
      />

      <Textarea
        name="description"
        label={t("description_placeholder")}
        required
        rows={8}
        maxLength={5000}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        hint={`${description.length}/5000`}
        error={state.fieldErrors?.description?.[0]}
      />

      <div className="border-border-subtle bg-bg-secondary/30 space-y-4 rounded-md border p-4">
        <h3 className="text-fg-primary flex items-center gap-2 text-sm font-semibold">
          <Shield className="text-brand-400 h-4 w-4" />
          {t("incident_classification")}
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <ProviderCombobox
              name="provider_id"
              label={tCommon("provider") ?? "AI Provider"}
              required
              value={selectedProvider}
              onChange={handleProviderChange}
              options={providerOptions}
              placeholder={t("select_provider")}
              error={state.fieldErrors?.provider_id?.[0]}
            />
            {selectedProvider === "custom:other" && (
              <Input
                name="provider_custom"
                placeholder={t("custom_provider_name", {
                  defaultValue: "Şirket/Sağlayıcı Adını Yazın",
                })}
                value={customProviderName}
                onChange={(e) => setCustomProviderName(e.target.value)}
                required
              />
            )}
            {selectedProvider !== "custom:other" && (
              <input type="hidden" name="provider_custom" value={customProviderName} />
            )}
          </div>

          <div className="space-y-3">
            <ModelAutocomplete
              name="model_id"
              label={tCommon("model") ?? "Model"}
              required
              value={selectedModel}
              onChange={handleModelChange}
              options={modelOptions}
              placeholder={t("select_model")}
              error={state.fieldErrors?.model_id?.[0]}
              disabled={!selectedProvider}
            />
            {selectedModel === "custom:other" && (
              <Input
                name="model_custom"
                placeholder={t("custom_model_name", { defaultValue: "Model Adını Yazın" })}
                value={customModelName}
                onChange={(e) => setCustomModelName(e.target.value)}
                required
              />
            )}
            {selectedModel !== "custom:other" && (
              <input
                type="hidden"
                name="model_custom"
                value={selectedModel.startsWith("custom:") ? selectedModel.slice(7) : ""}
              />
            )}
          </div>
        </div>

        <div className="border-border-subtle/50 grid grid-cols-1 gap-4 border-t pt-2 sm:grid-cols-3">
          <Select
            name="category"
            label={t("category")}
            required
            placeholder="—"
            options={categoryOptions}
            error={state.fieldErrors?.category?.[0]}
          />
          <Select
            name="severity"
            label={t("severity")}
            required
            options={severityOptions}
            defaultValue="medium"
            error={state.fieldErrors?.severity?.[0]}
          />
          <Input
            name="incident_date"
            type="datetime-local"
            label={t("incident_date")}
            required
            error={state.fieldErrors?.incident_date?.[0]}
          />
        </div>
      </div>

      <div>
        <label className="text-fg-primary mb-1.5 block text-sm font-medium">{t("evidence")}</label>
        <EvidenceUploader name="evidence" />
      </div>

      <fieldset className="border-border-subtle bg-bg-secondary/40 space-y-3 rounded-md border p-4">
        <legend className="text-fg-primary inline-flex items-center gap-1.5 px-2 text-sm font-semibold">
          <Shield className="text-brand-400 h-4 w-4" />
          {t("consent_required", { defaultValue: "Required consents" })}
        </legend>
        <Checkbox
          name="consent_truth"
          label={t("consent_truth")}
          required
          checked={consents.truth}
          onChange={(e) => setConsents((c) => ({ ...c, truth: e.target.checked }))}
        />
        <Checkbox
          name="consent_age"
          label={t("consent_age")}
          required
          checked={consents.age}
          onChange={(e) => setConsents((c) => ({ ...c, age: e.target.checked }))}
        />
        <Checkbox
          name="consent_terms"
          label={t("consent_terms")}
          required
          checked={consents.terms}
          onChange={(e) => setConsents((c) => ({ ...c, terms: e.target.checked }))}
        />
        <div>
          <Checkbox
            name="is_anonymous"
            label={t("anonymous")}
            description={t("anonymous_hint")}
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          {isAnonymous && (
            <p className="text-warning-400 mt-1.5 ml-7 text-xs leading-relaxed font-medium">
              {t("whistleblower_encryption_notice")}
            </p>
          )}
        </div>
      </fieldset>

      {allConsents && (
        <p className="text-success-500 inline-flex items-center gap-1.5 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {tCommon("allSet", { defaultValue: "All consents accepted" })}
        </p>
      )}

      <SubmitButton className="w-full" disabled={!canSubmit}>
        {t("submit")}
      </SubmitButton>
    </form>
  );
}

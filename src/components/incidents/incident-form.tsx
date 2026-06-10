"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProviderCombobox, type ComboboxOption } from "@/components/ui/provider-combobox";
import { ModelAutocomplete, type ModelOption } from "@/components/ui/model-autocomplete";
import { EvidenceUploader, SubmitButton } from "./evidence-uploader";
import { PIIBanner } from "./pii-banner";
import { Shield, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { submitIncident, type SubmitIncidentState } from "@/actions/incidents";
import type { AIProvider, AIModel, IncidentCategory, IncidentSeverity } from "@/types";

const initialState: SubmitIncidentState = { ok: false };

export function IncidentForm({
  providers,
  models,
}: {
  providers: AIProvider[];
  models: AIModel[];
}) {
  const t = useTranslations("incident");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");
  const [state, formAction] = useFormState(submitIncident, initialState);
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

  useEffect(() => {
    if (state.ok) {
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
    <form action={formAction} className="space-y-5">
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

      <div>
        <label className="text-fg-primary mb-2 block text-sm font-medium">
          {t("evidence_hint") ?? ""}
        </label>
      </div>

      {piiDetected && <PIIBanner />}

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
        <div className="pt-2">
          <Checkbox
            name="is_anonymous"
            label={t("anonymous")}
            description={t("anonymous_hint")}
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
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

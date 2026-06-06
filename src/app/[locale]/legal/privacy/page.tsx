import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalLayout } from "@/components/legal/legal-layout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: "Privacy Policy" };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="2026-06-01">
      <h2>1. Who we are</h2>
      <p>
        ALPAR AI ("we", "us", "our") operates the public-facing platform at
        alparai.online. We are an intermediary service: we host user-submitted
        content but we are not the publisher of that content. The legal entity
        operating the platform will be disclosed in our Imprint page.
      </p>

      <h2>2. What we collect</h2>
      <ul>
        <li><strong>Account data</strong>: email, name, avatar, and OAuth provider metadata when you sign in with Google.</li>
        <li><strong>Submissions</strong>: incidents, suggestions, evidence files, and consents you grant.</li>
        <li><strong>Technical data</strong>: IP address (hashed), user agent, locale, and access logs for security and rate limiting.</li>
        <li><strong>Cookies</strong>: essential session cookies (Supabase) and optional privacy-friendly analytics (Plausible, no cookies set).</li>
      </ul>

      <h2>3. What we do NOT do</h2>
      <ul>
        <li>We do not sell your data. Ever.</li>
        <li>We do not run third-party advertising or tracking.</li>
        <li>We do not fingerprint your device.</li>
      </ul>

      <h2>4. PII Guardian</h2>
      <p>
        All incident submissions are scanned by our PII Guardian before publication.
        Detected personal data (emails, phone numbers, ID numbers, access tokens,
        credit card numbers, IBANs) is automatically masked. You retain the right
        to submit a takedown request for any remaining personal data.
      </p>

      <h2>5. Your rights (GDPR / KVKK)</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Rectify inaccurate data.</li>
        <li>Request erasure ("right to be forgotten").</li>
        <li>Object to processing or request restriction.</li>
        <li>Data portability (machine-readable export).</li>
        <li>Lodge a complaint with your supervisory authority (KVKK Kurulu in Turkey, or your local DPA in the EU).</li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:privacy@alparai.online">privacy@alparai.online</a>.
        We respond within 30 days.
      </p>

      <h2>6. Legal basis (KVKK Art. 5–6)</h2>
      <p>
        We process your data on the basis of (a) explicit consent at submission,
        (b) legitimate interest in operating the platform and preventing abuse,
        and (c) legal obligation for record-keeping of moderation decisions.
      </p>

      <h2>7. Data retention</h2>
      <ul>
        <li>Account data: until you delete your account.</li>
        <li>Published incidents: kept indefinitely for transparency, with PII masked.</li>
        <li>Rejected incidents: deleted after 90 days.</li>
        <li>Audit log: 2 years (legal compliance).</li>
        <li>Backups: 30 days rolling.</li>
      </ul>

      <h2>8. Sub-processors</h2>
      <ul>
        <li>Supabase (Postgres + auth + storage) — Frankfurt region.</li>
        <li>Upstash Redis (rate limiting) — Frankfurt region.</li>
        <li>Plausible Analytics (privacy-friendly, no cookies) — EU.</li>
        <li>Sentry (error monitoring) — EU.</li>
      </ul>

      <h2>9. International transfers</h2>
      <p>
        Our infrastructure is EU-hosted. If you access the service from outside
        the EEA, your data may be processed in the EU; we rely on standard
        contractual clauses (SCCs) for any third-country transfer.
      </p>

      <h2>10. Children</h2>
      <p>The platform is not directed to users under 18. By signing up you confirm you are 18+.</p>

      <h2>11. Changes</h2>
      <p>
        Material changes will be announced at least 14 days in advance via
        email and a banner on the home page.
      </p>

      <h2>12. Contact</h2>
      <p>
        Data Protection Officer: <a href="mailto:dpo@alparai.online">dpo@alparai.online</a><br />
        Postal address: published in the Imprint page when the legal entity is registered.
      </p>
    </LegalLayout>
  );
}

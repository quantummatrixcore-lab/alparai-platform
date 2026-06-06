import { setRequestLocale } from "next-intl/server";
import { LegalLayout } from "@/components/legal/legal-layout";
import { TakedownForm } from "@/components/legal/takedown-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "Takedown Request" };
}

export default async function TakedownPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalLayout
      title="Takedown / Correction Request"
      lastUpdated="2026-06-01"
    >
      <p>
        If you believe content on this platform is unlawful, defamatory,
        infringes your copyright or other rights, or contains your personal
        data, you can submit a takedown request. We will review and respond
        within <strong>7 days</strong>.
      </p>
      <p>
        For GDPR / KVKK data subject requests (erasure, access, rectification),
        use the Privacy Policy contact instead.
      </p>
      <h2>How to file</h2>
      <ol>
        <li>Fill in the form below with as much detail as possible.</li>
        <li>Provide a public link to a document proving your identity or authority.</li>
        <li>Specify the URL of the content and explain the issue clearly.</li>
      </ol>
      <div className="not-prose mt-8">
        <TakedownForm />
      </div>
      <h2>What happens next</h2>
      <ul>
        <li>You receive a confirmation email within 24 hours.</li>
        <li>A moderator reviews your request within 7 days.</li>
        <li>If approved, the content is removed or corrected. You are notified.</li>
        <li>If rejected, you receive a written explanation and may appeal.</li>
      </ul>
      <h2>Abuse</h2>
      <p>
        Submitting fraudulent or vexatious takedown requests may result in
        account suspension and reporting to the relevant authorities.
      </p>
      <h2>Direct contact</h2>
      <p>
        For urgent matters:{" "}
        <a href="mailto:takedown@alparai.online">takedown@alparai.online</a>
      </p>
    </LegalLayout>
  );
}

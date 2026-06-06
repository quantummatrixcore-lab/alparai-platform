import { setRequestLocale } from "next-intl/server";
import { LegalLayout } from "@/components/legal/legal-layout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "Terms of Service" };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalLayout title="Terms of Service" lastUpdated="2026-06-01">
      <h2>1. Acceptance</h2>
      <p>
        By accessing or using alparai.online (the "Platform"), you agree to be
        bound by these Terms of Service. If you do not agree, do not use the
        Platform.
      </p>

      <h2>2. Our role — Intermediary, not publisher</h2>
      <p>
        ALPAR AI is an <strong>intermediary platform</strong> in the sense of
        Article 14 of the EU E-Commerce Directive (2000/31/EC) and the Turkish
        E-Commerce Law (6563 sayılı Kanun). We host content submitted by users.
        We are not the author, editor, or publisher of that content. The
        liability for the accuracy and legality of submissions rests with the
        user who submitted them.
      </p>
      <p>
        We do not pre-moderate submissions (except for automated PII masking
        and obvious illegal content detection). All published content is
        reviewed by volunteer moderators after submission.
      </p>

      <h2>3. Eligibility</h2>
      <p>You must be at least 18 years old to submit content or use interactive features.</p>

      <h2>4. Your submissions</h2>
      <p>By submitting content to the Platform, you confirm that:</p>
      <ol>
        <li>The information is accurate to the best of your knowledge.</li>
        <li>You have the right to share any evidence you upload (screenshots, files, transcripts).</li>
        <li>You understand the content may be published publicly and indexed by search engines.</li>
        <li>You waive any moral rights to the extent necessary for us to operate the Platform.</li>
        <li>You grant us a non-exclusive, worldwide, royalty-free license to host, display, and distribute your submission for the purpose of operating the Platform.</li>
      </ol>

      <h2>5. Prohibited content</h2>
      <p>You may not submit content that:</p>
      <ul>
        <li>Is unlawful, defamatory, or infringes third-party rights.</li>
        <li>Contains personal data of others without their consent.</li>
        <li>Is spam, advertising, or unsolicited promotion.</li>
        <li>Constitutes harassment, threats, or hate speech.</li>
        <li>Is misleading, fraudulent, or impersonating another person or entity.</li>
      </ul>

      <h2>6. Takedown</h2>
      <p>
        If you believe content hosted on the Platform is unlawful or infringes
        your rights, you may submit a takedown request at{" "}
        <a href="/legal/takedown">/legal/takedown</a>. We process takedown
        requests within 7 days, in line with Article 14 of the E-Commerce
        Directive and KVKK Article 11.
      </p>

      <h2>7. Account termination</h2>
      <p>
        We may suspend or terminate accounts that materially violate these
        Terms. We will give prior notice where reasonable.
      </p>

      <h2>8. AI providers' right to respond</h2>
      <p>
        AI providers that are the subject of a published incident have the
        right to post an official response. We verify their identity before
        publishing responses marked "official".
      </p>

      <h2>9. No warranty</h2>
      <p>
        The Platform is provided "as is" without warranties of any kind. We
        do not guarantee the accuracy, completeness, or usefulness of any
        user-submitted content. Always verify before acting on information
        posted here.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for
        user-submitted content, third-party links, or indirect, incidental,
        or consequential damages arising from use of the Platform.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Turkey. Any
        dispute shall be subject to the exclusive jurisdiction of Istanbul
        courts, without prejudice to your right as a consumer to bring
        proceedings in your country of residence.
      </p>

      <h2>12. Contact</h2>
      <p>
        <a href="mailto:legal@alparai.online">legal@alparai.online</a>
      </p>
    </LegalLayout>
  );
}

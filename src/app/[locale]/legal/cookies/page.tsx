import { setRequestLocale } from "next-intl/server";
import { LegalLayout } from "@/components/legal/legal-layout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return { title: "Cookie Policy" };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="2026-06-01">
      <h2>What is a cookie?</h2>
      <p>
        A cookie is a small text file that a website stores on your device
        to remember information between visits. We try to use as few as
        possible.
      </p>

      <h2>Cookies we use</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Type</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>sb-*-auth-token</code></td>
            <td>Authentication session</td>
            <td>Essential</td>
            <td>Session</td>
          </tr>
          <tr>
            <td><code>alpar_cookie_consent</code></td>
            <td>Stores your cookie preference</td>
            <td>Essential</td>
            <td>1 year</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do <strong>not</strong> use advertising, retargeting, or
        cross-site tracking cookies. If we ever decide to enable
        privacy-friendly analytics (e.g. Plausible), it is cookieless by
        design and we will update this page.
      </p>

      <h2>Your choices</h2>
      <p>
        You can withdraw or change your consent at any time by clearing your
        browser storage for this site. You can also configure your browser
        to block cookies — note that this may break sign-in.
      </p>

      <h2>Third-party cookies</h2>
      <p>
        When you sign in with Google, Google may set cookies on their
        authentication pages. We do not control those; see{" "}
        <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noreferrer noopener">
          Google's cookie policy
        </a>.
      </p>
    </LegalLayout>
  );
}

import { Resend } from "resend";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);
const OUTREACH_DIR = path.join(process.cwd(), "docs", "OUTREACH");
const TARGET_EMAIL = "quantum.matrix.core@gmail.com"; // Routing to founder as we don't have actual emails

async function sendOutreachEmails() {
  try {
    const files = fs.readdirSync(OUTREACH_DIR).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const content = fs.readFileSync(path.join(OUTREACH_DIR, file), "utf-8");

      // Parse subject
      const subjectMatch = content.match(/\*\*Subject:\*\*\s*(.+)/);
      const subject = subjectMatch ? subjectMatch[1].trim() : `Outreach: ${file}`;

      console.log(`Sending: ${subject}...`);

      const data = await resend.emails.send({
        from: "Ercüment Erden <ercument.erden@alparai.com>",
        to: TARGET_EMAIL,
        subject: subject,
        text: content,
      });

      console.log(`Successfully sent ${file}. Resend ID: ${data.data?.id}`);

      // Brief delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.log("All outreach emails sent successfully.");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

sendOutreachEmails();

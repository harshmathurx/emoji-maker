import { LegalLayout } from "@/components/legal-layout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <section className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Generated poster images and associated prompts</li>
            <li>Account information (email, username)</li>
            <li>Usage data and credit information</li>
            <li>Technical data (IP address, browser type)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">How We Use Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide poster generation services</li>
            <li>Process payments and credits</li>
            <li>Improve our AI generation models</li>
            <li>Share generated posters on social media (with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Data Sharing</h2>
          <p className="mb-2">We share your information with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Social media platforms (when you choose to share)</li>
            <li>Payment processors</li>
            <li>Cloud service providers</li>
            <li>Legal authorities when required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Data Security</h2>
          <p>We implement industry-standard security measures to protect your data and generated content.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access your data</li>
            <li>Delete your account</li>
            <li>Request data export</li>
            <li>Modify sharing preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Cookie Policy</h2>
          <p>We use essential cookies for site functionality and analytics cookies to improve our service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Changes</h2>
          <p>We may update this policy periodically. Check back for changes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <p>harshmathurx@gmail.com | aayush.mishra@gmail.com</p>
        </section>
      </section>
    </LegalLayout>
  );
} 
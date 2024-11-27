import { LegalLayout } from "@/components/legal-layout";

export default function TermsAndConditions() {
  return (
    <LegalLayout title="Terms and Conditions">
      <section className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Service Description</h2>
          <p>We provide AI-powered Pixar-style poster generation services through our platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">User Obligations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide appropriate prompts</li>
            <li>Not generate harmful or illegal content</li>
            <li>Not misuse the service or credits</li>
            <li>Maintain account security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Intellectual Property</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You retain rights to your prompts</li>
            <li>We retain rights to our AI model</li>
            <li>Generated posters are licensed for personal use</li>
            <li>Social media sharing permitted within platform guidelines</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Payment Terms</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Credits must be purchased for poster generation</li>
            <li>No refunds except for technical failures</li>
            <li>Unused credits expire after 12 months</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Limitations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Service provided &quot;as is&quot;</li>
            <li>No guarantee of availability</li>
            <li>We may modify features without notice</li>
            <li>Generated content may vary from expectations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Termination</h2>
          <p>We reserve the right to suspend or terminate accounts for violations.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Governing Law</h2>
          <p>Indian law governs these terms.</p>
        </section>
      </section>
    </LegalLayout>
  );
} 
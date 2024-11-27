import { LegalLayout } from "@/components/legal-layout";

export default function RefundPolicy() {
  return (
    <LegalLayout title="Refund Policy">
      <section className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Eligible Scenarios</h2>
          <p className="mb-2">We may provide refunds when:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Technical errors prevented poster generation</li>
            <li>Credits were charged but no poster was delivered</li>
            <li>Unauthorized account access led to credit usage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Request Process</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Email harshmathurx@gmail.com | aayush.mishra@gmail.com</li>
            <li>Include:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Account email</li>
                <li>Transaction ID</li>
                <li>Description of the issue</li>
                <li>Screenshots (if applicable)</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Processing Time</h2>
          <p>We&apos;ll review requests within 3 business days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Credit Return Method</h2>
          <p className="mb-2">Refunds provided as:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Account credits</li>
            <li>Original payment method (case-by-case)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Non-Refundable Cases</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Dissatisfaction with generated posters</li>
            <li>Expired unused credits</li>
            <li>Violated terms of service</li>
          </ul>
        </section>
      </section>
    </LegalLayout>
  );
} 
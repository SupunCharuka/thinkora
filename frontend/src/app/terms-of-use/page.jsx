
import Link from "next/link";

export const metadata = {
  title: "Terms of Use — thinkora",
  description: "Terms and conditions for using thinkora.",
};

export default function TermsOfUsePage() {
  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2.5L2 8v9a.5.5 0 00.5.5H7a.5.5 0 00.5-.5V13a1 1 0 011-1h2a1 1 0 011 1v4.5a.5.5 0 00.5.5h4.5a.5.5 0 00.5-.5V8l-8-5.5z" /></svg>
              <span>Home</span>
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="font-semibold text-gray-900">Terms of Use</li>
        </ol>
      </nav>
      <main className="min-h-[70vh] max-w-7xl mx-auto px-6 py-6">


        <header className="mb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <h1 className="text-3xl font-extrabold">Terms of Use</h1>
            <div className="mt-2 text-sm text-slate-600">Effective date: <time dateTime="2025-12-21">December 21, 2025</time></div>
            <p className="mt-4 text-sm text-slate-700">These Terms govern your use of thinkora ("we", "us", "our") websites and services. By using thinkora you agree to these Terms.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 prose max-w-none text-sm text-slate-700">
              <section id="acceptance">
                <h2 className="font-semibold">1. Acceptance of Terms</h2>
                <p>By accessing or using thinkora you agree to be bound by these Terms and any policies referenced herein. If you do not agree, do not use the site.</p>
              </section>

              <section id="use-of-site">
                <h2 className="font-semibold">2. Use of the Site</h2>
                <p>You must use the site in accordance with all applicable laws and these Terms. You are responsible for your account and any activity that occurs under it. Do not attempt to interfere with the site's security or functionality.</p>
              </section>

              <section id="accounts">
                <h2 className="font-semibold">3. Accounts</h2>
                <p>When you create an account you must provide accurate information and keep your credentials secure. You are responsible for activity under your account and must notify us of any unauthorized use.</p>
              </section>

              <section id="user-content">
                <h2 className="font-semibold">4. User Content</h2>
                <p>You retain ownership of content you submit, but by posting you grant thinkora a non-exclusive, worldwide, royalty-free license to host, use, modify, and display that content to provide the service.</p>
              </section>

              <section id="intellectual-property">
                <h2 className="font-semibold">5. Intellectual Property</h2>
                <p>All site content, design, graphics, and code are owned by or licensed to thinkora and are protected by copyright and other laws. You may not reuse content without permission.</p>
              </section>

              <section id="prohibited-conduct">
                <h2 className="font-semibold">6. Prohibited Conduct</h2>
                <p>You must not: impersonate others, upload illegal content, violate others' rights, attempt to harm the site, or use the service for unlawful purposes.</p>
              </section>

              <section id="disclaimer">
                <h2 className="font-semibold">7. Disclaimer</h2>
                <p>The site is provided "as is" and we disclaim all warranties to the fullest extent permitted by law. We do not guarantee the site will be error-free or uninterrupted.</p>
              </section>

              <section id="limitation-of-liability">
                <h2 className="font-semibold">8. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, thinkora and its affiliates will not be liable for indirect, incidental, special, or consequential damages arising from your use of the site.</p>
              </section>

              <section id="indemnification">
                <h2 className="font-semibold">9. Indemnification</h2>
                <p>You agree to indemnify and hold thinkora, its officers, agents, and partners harmless from any claims, losses, liabilities, and expenses arising from your violation of these Terms or your use of the site.</p>
              </section>

              <section id="termination">
                <h2 className="font-semibold">10. Termination</h2>
                <p>We may suspend or terminate your access for violations of these Terms or for any lawful reason. Termination does not waive any rights we may have under the law.</p>
              </section>

              <section id="governing-law">
                <h2 className="font-semibold">11. Governing Law</h2>
                <p>These Terms are governed by the laws of the jurisdiction in which thinkora operates, without regard to conflict of law rules.</p>
              </section>

              <section id="changes-to-terms">
                <h2 className="font-semibold">12. Changes to These Terms</h2>
                <p>We may revise these Terms at any time. We will post the updated Terms with a new effective date. Continued use after changes constitutes acceptance.</p>
              </section>

              <section id="contact">
                <h2 className="font-semibold">13. Contact</h2>
                <p>If you have questions about these Terms, contact us via <a href="/contact" className="text-indigo-600 hover:underline">the contact page</a> or email <a href="mailto:supuncharuka.dev@gmail.com" className="text-indigo-600 hover:underline">supuncharuka.dev@gmail.com</a>.</p>
              </section>
            </div>
          </article>

          <aside className="hidden md:block md:col-span-1">
            <nav className="sticky top-24">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold mb-3">On this page</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#acceptance" className="text-slate-700 hover:text-indigo-600">Acceptance</a></li>
                  <li><a href="#use-of-site" className="text-slate-700 hover:text-indigo-600">Use of the Site</a></li>
                  <li><a href="#accounts" className="text-slate-700 hover:text-indigo-600">Accounts</a></li>
                  <li><a href="#user-content" className="text-slate-700 hover:text-indigo-600">User Content</a></li>
                  <li><a href="#intellectual-property" className="text-slate-700 hover:text-indigo-600">Intellectual Property</a></li>
                  <li><a href="#prohibited-conduct" className="text-slate-700 hover:text-indigo-600">Prohibited Conduct</a></li>
                  <li><a href="#disclaimer" className="text-slate-700 hover:text-indigo-600">Disclaimer</a></li>
                  <li><a href="#contact" className="text-slate-700 hover:text-indigo-600">Contact</a></li>
                </ul>
              </div>
            </nav>
          </aside>
        </div>
      </main>
    </>
  );
}

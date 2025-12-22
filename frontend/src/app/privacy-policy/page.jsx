import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — thinkora",
  description: "thinkora privacy policy describing what data we collect and how we use it.",
};

export default function PrivacyPolicyPage() {
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
          <li className="font-semibold text-gray-900">Privacy Policy</li>
        </ol>
      </nav>
      <main className="min-h-[70vh] max-w-7xl mx-auto px-6 py-6">
        <header className="mb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
            <div className="mt-2 text-sm text-slate-600">Effective date: <time dateTime="2025-12-21">December 21, 2025</time></div>
            <p className="mt-4 text-sm text-slate-700">This Privacy Policy explains how <strong>thinkora</strong> ("we", "us", "our") collects, uses, discloses, and protects information when you use our website and services.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 prose max-w-none text-sm text-slate-700">
              <section id="information-we-collect">
                <h2 className="font-semibold">1. Information We Collect</h2>
                <p>We collect information you provide directly when you create an account, submit forms (for example contact or comment forms), or communicate with us. This may include name, email address, profile information, and any content you choose to submit.</p>
              </section>

              <section id="automatically-collected-information">
                <h2 className="font-semibold">2. Automatically Collected Information</h2>
                <p>When you visit thinkora, we automatically collect certain information about your device and usage, such as IP address, browser and device identifiers, pages visited, and referring URLs. We use cookies and similar technologies to collect this information.</p>
              </section>

              <section id="how-we-use-information">
                <h2 className="font-semibold">3. How We Use Information</h2>
                <p>We use information to provide and maintain our services, respond to inquiries, personalize your experience, analyze and improve our site, and detect and prevent fraud or abuse.</p>
              </section>

              <aside className="my-4 p-4 bg-indigo-50 border-l-4 border-indigo-200 rounded">
                <strong>Privacy tip:</strong> You can manage cookies and tracking in your browser settings. Some features may require cookies to work correctly.
              </aside>

              <section id="cookies-and-tracking">
                <h2 className="font-semibold">4. Cookies and Tracking Technologies</h2>
                <p>thinkora uses cookies and similar technologies to store preferences, enable site features, and collect analytics. You can control cookies through your browser settings, but disabling cookies may limit functionality.</p>
              </section>

              <section id="third-party-services">
                <h2 className="font-semibold">5. Third-Party Services</h2>
                <p>We may share information with service providers that help operate the site (e.g., hosting, analytics, email delivery). These providers are contractually required to protect your data. Third-party services may have their own privacy policies.</p>
              </section>

              <section id="data-retention">
                <h2 className="font-semibold">6. Data Retention</h2>
                <p>We retain personal information as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
              </section>

              <section id="security">
                <h2 className="font-semibold">7. Security</h2>
                <p>We implement reasonable administrative, technical, and physical safeguards to protect personal information. However, no method of transmission or storage is 100% secure; we cannot guarantee absolute security.</p>
              </section>

              <section id="your-rights">
                <h2 className="font-semibold">8. Your Rights</h2>
                <p>Depending on your jurisdiction, you may have the right to access, correct, or delete personal information we hold about you, or to object to or restrict certain processing. To exercise these rights, please contact us using the details below.</p>
              </section>

              <section id="children">
                <h2 className="font-semibold">9. Children</h2>
                <p>thinkora is not intended for children under 16. We do not knowingly collect personal information from children under 16. If you believe we have collected such information, contact us and we will take steps to delete it.</p>
              </section>

              <section id="changes-to-policy">
                <h2 className="font-semibold">10. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will post the updated policy with a new effective date. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
              </section>

              <section id="contact-us">
                <h2 className="font-semibold">11. Contact Us</h2>
                <p>If you have questions or requests regarding this Privacy Policy, please contact us at <a href="/contact" className="text-indigo-600 hover:underline">the contact page</a> or email us at <a href="mailto:supuncharuka.dev@gmail.com" className="text-indigo-600 hover:underline">supuncharuka.dev@gmail.com</a>.</p>
              </section>
            </div>
          </article>

          <aside className="hidden md:block md:col-span-1">
            <nav className="sticky top-24">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold mb-3">On this page</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#information-we-collect" className="text-slate-700 hover:text-indigo-600">Information We Collect</a></li>
                  <li><a href="#automatically-collected-information" className="text-slate-700 hover:text-indigo-600">Automatically Collected Information</a></li>
                  <li><a href="#how-we-use-information" className="text-slate-700 hover:text-indigo-600">How We Use Information</a></li>
                  <li><a href="#cookies-and-tracking" className="text-slate-700 hover:text-indigo-600">Cookies & Tracking</a></li>
                  <li><a href="#third-party-services" className="text-slate-700 hover:text-indigo-600">Third-Party Services</a></li>
                  <li><a href="#your-rights" className="text-slate-700 hover:text-indigo-600">Your Rights</a></li>
                  <li><a href="#contact-us" className="text-slate-700 hover:text-indigo-600">Contact</a></li>
                </ul>
              </div>
            </nav>
          </aside>
        </div>
      </main>
    </>
  );
}

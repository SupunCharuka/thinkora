export const metadata = {
  title: "Terms of Use — My Blog",
  description: "Terms and conditions for using My Blog.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-[70vh] max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
      <p className="text-sm text-slate-700 mb-4">This is a placeholder Terms of Use page. Replace with your actual terms and conditions covering permitted use, intellectual property, and disclaimers.</p>

      <section className="prose text-sm text-slate-700">
        <h2>Use of the Site</h2>
        <p>By using this site you agree to follow these terms and not misuse the services provided.</p>

        <h2>Intellectual Property</h2>
        <p>All content on this site is owned or licensed by the site and may not be reused without permission.</p>

        <h2>Disclaimer</h2>
        <p>The site is provided "as is" without warranties. We are not liable for damages arising from site use.</p>
      </section>
    </main>
  );
}

export const metadata = {
  title: "Privacy Policy — My Blog",
  description: "Read our privacy policy to learn how we collect and use data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[70vh] max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-slate-700 mb-4">This is a placeholder privacy policy. Replace with your actual policy text to describe how you collect, use, and protect user data.</p>

      <section className="prose text-sm text-slate-700">
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us when you use the site, such as name, email, and messages submitted through contact forms.</p>

        <h2>How We Use Information</h2>
        <p>We use collected information to operate and improve the site, reply to inquiries, and for analytics and security purposes.</p>

        <h2>Third-Party Services</h2>
        <p>We may use third-party services (analytics, hosting) that collect limited information subject to their own privacy policies.</p>
      </section>
    </main>
  );
}

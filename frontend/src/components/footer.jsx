export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto container px-4 py-6 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} My Blog — Built with Next.js and Tailwind CSS
      </div>
    </footer>
  );
}

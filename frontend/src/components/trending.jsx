import Link from 'next/link';

export default function Trending() {
  return (
    <section >
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFBF6] flex items-center justify-center text-[#E07A4D] shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Top Trending</h3>
                <p className="text-sm text-gray-500">Today's Most Popular Stories</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/trending" className="inline-flex items-center gap-3 text-sm text-gray-700 hover:text-black">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white shadow-md">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
              <span>View More</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

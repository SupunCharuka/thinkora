"use client"
import React, { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function blogPage({ params }) {
  // `params` is a Promise in client components; unwrap with React's `use`.
  const resolvedParams = use(params);
  const { slug } = resolvedParams || { slug: 'sample-blog' }

  // Temporary static data; later you can replace with a fetch by `slug`.
  const blog = {
    title:
      'The effect of livestock on the physiological condition of roe deer is modulated by habitat quality',
    author: {
      name: 'Barbara Cartland',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=60'
    },
    date: '15 April 2020',
    readTime: '8 mins read',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
    content: [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at felis sit amet
      odio gravida tincidunt. Sed id arcu vitae libero cursus pretium. Praesent
      vestibulum, nisl eget ultrices posuere, est arcu suscipit arcu, non
      pellentesque purus velit sed orci.`,
      `Nulla facilisi. Curabitur non lorem vel neque aliquet faucibus. Vivamus
      condimentum, nisl sit amet convallis tristique, ipsum urna fermentum lorem,
      vitae hendrerit velit nunc quis nisl.`
    ]
    ,
    comments: [
      {
        id: 1,
        name: 'Tromas H. Hendson',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=64&q=60',
        date: 'June 9, 2025',
        text:
          'Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language, where attention to materiality and detail is evident. All flats have two sides and are in close proximity to the outside world.',
        replies: []
      },
      {
        id: 2,
        name: 'Rosalina D.',
        avatar: 'https://images.unsplash.com/photo-1545996124-1b5a1f0f6d6d?auto=format&fit=crop&w=64&q=60',
        date: 'June 10, 2025',
        text:
          'Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language, where attention to materiality and detail is evident.',
        replies: []
      },
      {
        id: 3,
        name: 'Miranda H. Halim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=60',
        date: 'June 9, 2025',
        text:
          'Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language.',
        replies: [
          {
            id: 31,
            name: 'Reply Author',
            avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=64&q=60',
            date: 'June 11, 2025',
            text: 'Thanks for the detailed overview — I found the material choices very informative.'
          }
        ]
      }
    ]
  }

  // Render helper for comments (supports one level of replies)
  const renderComment = (c) => (
    <div key={c.id} className="py-6">
      <div className="flex items-start gap-4">
        <img src={c.avatar} alt={c.name} className="w-14 h-14 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-slate-800">{c.name}</div>
            <div className="text-sm text-slate-500">{c.date}</div>
          </div>
          <p className="mt-3 text-slate-600">{c.text}</p>
          <div className="mt-4">
            <button className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-sm transition-colors duration-150 ease-in-out hover:bg-slate-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 cursor-pointer">Reply</button>
          </div>

          {c.replies && c.replies.length > 0 && (
            <div className="mt-6 ml-6 sm:ml-20 border-l border-slate-100 pl-6">
              {c.replies.map((r) => (
                <div key={r.id} className="flex items-start gap-4 py-4">
                  <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-slate-800">{r.name}</div>
                      <div className="text-sm text-slate-500">{r.date}</div>
                    </div>
                    <p className="mt-2 text-slate-600">{r.text}</p>
                    <div className="mt-3">
                      <button className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-sm transition-colors duration-150 ease-in-out hover:bg-slate-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 cursor-pointer">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Sample recommended blogs (replace with real data later)
  const recommendedblogs = [
    {
      id: 'r1',
      title: 'How habitat quality affects wildlife behavior',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60',
      excerpt: 'An overview of the ways habitat differences lead to measurable changes in animal physiology and movement patterns.',
      author: 'By Anna Lee',
      readTime: '6 mins read',
      href: '/blogs/habitat-quality'
    },
    {
      id: 'r2',
      title: 'Sustainable livestock practices in modern agriculture',
      category: 'Agriculture',
      image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=800&q=60',
      excerpt: 'Practical strategies for balancing livestock productivity with landscape conservation.',
      author: 'By Marco Silva',
      readTime: '7 mins read',
      href: '/blogs/sustainable-livestock'
    },
    {
      id: 'r3',
      title: 'Measuring physiological stress in wild populations',
      category: 'Research',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
      excerpt: 'Methods and best practices for assessing stress biomarkers in field studies.',
      author: 'By Dr. K. Chen',
      readTime: '5 mins read',
      href: '/blogs/stress-biomarkers'
    }
  ]

  // Reveal animation for the main element using IntersectionObserver
  const mainRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!mainRef.current) return
    const el = mainRef.current
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <main
      ref={mainRef}
      className={`max-w-5xl mx-auto px-6 py-10 transform transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <blog>
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link href="/" className="hover:underline transition-colors duration-150 ease-in-out hover:text-slate-700">Home</Link>
                  </li>
                  <li className="text-slate-400">›</li>
                  <li className="text-slate-700">Travel &amp; Culture</li>
                </ol>
              </nav>

              <div className="mt-3 flex items-center gap-3">
                <Link href="#" className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm transition duration-150 ease-in-out hover:shadow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200">Lifestyle</Link>
                <Link href="#" className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-sm transition duration-150 ease-in-out hover:shadow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-200">Culture</Link>
                <Link href="#" className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm transition duration-150 ease-in-out hover:shadow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200">Food</Link>
              </div>
            </div>

            <div className="mt-3 sm:mt-0 text-sm text-slate-500">&nbsp;</div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm text-slate-600">
                <div className="font-semibold text-slate-800">By {blog.author.name}</div>
                <div className="text-xs mt-0.5">{blog.date} · {blog.readTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-500">Share this:</span>
              <div className="flex items-center gap-2">
                <button aria-label="Share to Facebook" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transition transform duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.444 2.89h-2.329v6.99C18.343 21.128 22 16.991 22 12z"/></svg>
                </button>
                <button aria-label="Share to Twitter" className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center transition transform duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22.162 5.656c-.63.28-1.305.47-2.016.556a3.518 3.518 0 0 0 1.547-1.942 7.01 7.01 0 0 1-2.228.85 3.502 3.502 0 0 0-5.966 3.195 9.939 9.939 0 0 1-7.22-3.66 3.5 3.5 0 0 0 1.083 4.674 3.48 3.48 0 0 1-1.587-.438v.044a3.503 3.503 0 0 0 2.807 3.434 3.488 3.488 0 0 1-.918.122 3.37 3.37 0 0 1-.66-.063 3.502 3.502 0 0 0 3.267 2.426A7.022 7.022 0 0 1 3 19.54a9.9 9.9 0 0 0 5.366 1.573c6.437 0 9.963-5.34 9.963-9.963v-.454A7.09 7.09 0 0 0 22.162 5.656z"/></svg>
                </button>
                <button aria-label="Share to Pinterest" className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center transition transform duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12.004 2C7.035 2 3 6.035 3 11.004c0 3.606 2.053 6.71 5.006 7.974-.07-.676-.133-1.715.028-2.45.147-.64.946-4.074.946-4.074s-.242-.486-.242-1.204c0-1.127.654-1.968 1.467-1.968.693 0 1.028.521 1.028 1.145 0 .699-.444 1.745-.674 2.716-.19.817.403 1.482 1.197 1.482 1.437 0 2.542-1.514 2.542-3.695 0-1.929-1.387-3.28-3.366-3.28-2.293 0-3.641 1.72-3.641 3.5 0 .693.266 1.436.6 1.842.066.08.075.151.056.231-.062.254-.201.817-.229.932-.036.146-.118.177-.274.107-1.02-.447-1.659-1.967-1.659-3.166 0-2.576 1.873-4.938 5.397-4.938 2.834 0 4.873 2.025 4.873 4.73 0 2.823-1.778 5.101-4.246 5.101-0.83 0-1.61-.431-1.876-.936l-.51 1.946c-.184.7-.68 1.577-1.016 2.109C9.9 21.657 10.94 22 12.004 22 16.973 22 21 17.965 21 13c0-4.966-4.027-11-8.996-11z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <figure className="mb-8">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full rounded-xl shadow-lg object-cover max-h-[520px] mx-auto"
          />
        </figure>

        <div className="prose prose-lg max-w-none text-slate-800">
          {blog.content.map((p, idx) => (
            <p className='text-dark m-0' key={idx}>{p}</p>
          ))}

          <h2>Subheading example</h2>
          <p>
            Suspendisse potenti. Fusce in risus sit amet justo fermentum dapibus.
            Etiam sit amet nibh sed tortor luctus feugiat.
          </p>

          <figure className="mt-8">
            <blockquote className="bg-slate-100 rounded-lg p-6 sm:p-8 flex gap-6 items-start">
              <div className="text-slate-800 text-4xl sm:text-5xl font-extrabold leading-none select-none">“</div>
              <div className="flex-1">
                <p className="text-lg sm:text-2xl font-medium text-slate-900">
                  There’s more to life than simply increasing its speed. In quiet pauses, we reconnect with who we are, what we love, and why it all matters.
                </p>
                <cite className="block mt-4 text-sm text-slate-600">By Jimmy Dave</cite>
              </div>
            </blockquote>
          </figure>
        </div>
        
        {/* Recommended for you */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Recommended for you</h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedblogs.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transform transition duration-200 ease-in-out hover:scale-105"
              >
                <div className="w-full h-40 bg-gray-200 overflow-hidden">
                  <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-800">{r.category}</span>
                  <h4 className="mt-3 text-lg font-semibold text-slate-900">{r.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{r.excerpt}</p>
                  <div className="mt-3 text-xs text-slate-500">{r.author} · {r.readTime}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Comments section */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Comments</h3>

          <div className="space-y-3">
            {blog.comments.map((c) => renderComment(c))}
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6">Leave a comment</h3>

            <div className="p-4 md:p-6 bg-slate-50 rounded-lg">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name *"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white placeholder-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="info@webmail.com"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white placeholder-slate-400"
                  />

                  <input
                    type="url"
                    name="website"
                    placeholder="Website"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    rows={8}
                    placeholder="Your message...."
                    className="w-full px-4 py-4 rounded-lg border border-slate-200 bg-white placeholder-slate-400 resize-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-lg shadow-md transition transform duration-150 ease-in-out hover:opacity-95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800"
                  >
                    <span className="font-medium">Submit comment</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </blog>
    </main>
  )
}

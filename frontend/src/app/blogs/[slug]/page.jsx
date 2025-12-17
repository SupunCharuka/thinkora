"use client"
import React, { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import DOMPurify from 'dompurify'

export default function blogPage({ params }) {
  // `params` is a Promise in client components; unwrap with React's `use`.
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  // State for blog and recommendations — fetched from backend
  const [blog, setBlog] = useState(null)
  const [recommendedblogs, setRecommendedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Render helper for comments (supports one level of replies)
  const renderComment = (c) => (
    <div key={c.id} className="py-6">
      <div className="flex items-start gap-4">

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
                  <Image src={r.avatar} alt={r.name} width={48} height={48} className="rounded-full object-cover" />
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
  // We'll fetch recommended blogs after loading the main blog

  // Reveal animation for the main element using IntersectionObserver
  const mainRef = useRef(null)
  const [visible, setVisible] = useState(false)
  // computed UI helpers
  const calcReadingTime = (content) => {
    if (!content) return ''
    const text = Array.isArray(content) ? content.join(' ') : String(content)
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / 200))
    return `${minutes} min read`
  }

  const formatDate = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    if (Number.isNaN(dt.getTime())) return String(d)
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).format(dt)
  }

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

  // Fetch blog by slug and recommended blogs
  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Use explicit backend base when available to call the backend directly
        const base = process.env.NEXT_PUBLIC_API_URL || ''

        // Fetch blog by slug using backend URL (avoid missing Next.js dynamic proxy)
        const res = await fetch(`${base}/api/v1/blogs/${encodeURIComponent(slug)}`)
        if (!res.ok) throw new Error(`Failed to load blog (${res.status})`)
        const data = await res.json()
        if (!mounted) return
        // Normalize image URL: keep relative paths so Next.js rewrite will proxy `/uploads/*` to the API host
        if (data && data.image && data.image.startsWith('/')) {
          // keep as-is (e.g. `/uploads/...`) so the rewrite in next.config.mjs proxies it to the backend
          data.image = data.image
        } else if (data && data.image && base && data.image.startsWith('http') && data.image.startsWith(base)) {
          // if backend returned absolute URL matching the API base, convert to relative to allow rewrite
          try {
            const u = new URL(data.image)
            data.image = u.pathname + (u.search || '')
          } catch (e) {
            // leave as-is on parse error
          }
        }
        setBlog(data)

        // increment view count (avoid duplicate counts from same browser)
        try {
          const idForView = data && (data._id || data.slug)
          const VIEW_TTL = 24 * 60 * 60 * 1000 // 24 hours
          if (idForView && typeof window !== 'undefined' && window.localStorage) {
            const key = `viewed:${idForView}`
            const prev = localStorage.getItem(key)
            if (!prev || (Date.now() - parseInt(prev, 10) > VIEW_TTL)) {
              fetch(`${base}/api/v1/blogs/${encodeURIComponent(idForView)}/view`, { method: 'POST' })
                .then((r) => r.json())
                .then((json) => {
                  if (json && json.counted) {
                    try { localStorage.setItem(key, String(Date.now())) } catch (e) {}
                  }
                  if (json && typeof json.views !== 'undefined') {
                    setBlog((b) => (b ? { ...b, views: json.views } : b))
                  }
                })
                .catch(() => {})
            }
          }
        } catch (e) {
          // ignore
        }

        // Fetch a few recommended blogs
        try {
          const rec = await fetch(`${base}/api/v1/blogs?limit=3`)
          if (rec.ok) {
            const recData = await rec.json()
            // Map to expected frontend shape
            const mapped = (recData || []).map((b) => ({
              id: b._id || b.id || b.slug,
              title: b.title,
              category: (b.category && b.category.name) || 'General',
              // prefer relative `/uploads/...` so rewrites work; if absolute and matches API base, convert to relative
              image: b.image && b.image.startsWith('/') ? b.image : (b.image && base && b.image.startsWith(base) ? new URL(b.image).pathname : b.image),
              excerpt: b.excerpt || '',
              author: b.author && b.author.name ? `By ${b.author.name}` : 'By team',
              readTime: b.readTime || '',
              href: `/blogs/${b.slug || b._id}`
            }))
            setRecommendedBlogs(mapped)
          }
        } catch (e) {
          // ignore recommended fetch failure
          console.warn('Failed to load recommended', e)
        }
      } catch (err) {
        console.error(err)
        if (mounted) setError(String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [slug])

  return (
    <section
      ref={mainRef}
      className={`max-w-5xl mx-auto px-6 mb-6 transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
    >

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
          <li>
            <Link href="/blogs" className="text-gray-500 hover:text-gray-900">Blogs</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="font-semibold text-gray-900 truncate max-w-[260px]">
            {loading ? (
              <span className="inline-block w-36 h-4 bg-slate-200 rounded" />
            ) : (
              blog ? blog.title : 'Blog'
            )}
          </li>
        </ol>
      </nav>
      {loading ? (
        <div className="py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto" />
            <div className="h-64 bg-slate-200 rounded mx-auto" />
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-600">{error}</div>
      ) : (
        <article>
          <Head>
            <title>{blog.title}</title>
            <meta name="description" content={blog.excerpt || ''} />
            <meta property="og:title" content={blog.title} />
            <meta property="og:description" content={blog.excerpt || ''} />
            {blog.image && <meta property="og:image" content={blog.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${blog.image}` : blog.image} />}
            <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.href : ''}`} />
          </Head>

          <header className="mb-10 relative">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>


                <div className="mt-3 flex items-center gap-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm transition duration-150 ease-in-out hover:shadow-sm hover:scale-105">Lifestyle</span>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 text-sm text-slate-500">&nbsp;</div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">

                <div className="text-sm text-slate-600">
                  <div className="font-semibold text-slate-800">By {blog.author && blog.author.name ? blog.author.name : 'Author'}</div>
                  <div className="text-xs mt-0.5">{formatDate(blog.createdAt)} · {calcReadingTime(blog.content)}{blog && typeof blog.views !== 'undefined' ? ` · ${blog.views} views` : ''}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500">Share this:</span>
                <div className="flex items-center gap-2">
                  <button aria-label="Share to Facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank', 'noopener')} className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transition transform duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.444 2.89h-2.329v6.99C18.343 21.128 22 16.991 22 12z" /></svg>
                  </button>
                  <button aria-label="Share to Twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank', 'noopener')} className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center transition transform duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22.162 5.656c-.63.28-1.305.47-2.016.556a3.518 3.518 0 0 0 1.547-1.942 7.01 7.01 0 0 1-2.228.85 3.502 3.502 0 0 0-5.966 3.195 9.939 9.939 0 0 1-7.22-3.66 3.5 3.5 0 0 0 1.083 4.674 3.48 3.48 0 0 1-1.587-.438v.044a3.503 3.503 0 0 0 2.807 3.434 3.488 3.488 0 0 1-.918.122 3.37 3.37 0 0 1-.66-.063 3.502 3.502 0 0 0 3.267 2.426A7.022 7.022 0 0 1 3 19.54a9.9 9.9 0 0 0 5.366 1.573c6.437 0 9.963-5.34 9.963-9.963v-.454A7.09 7.09 0 0 0 22.162 5.656z" /></svg>
                  </button>
                  <button aria-label="Share to Pinterest" onClick={() => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&media=${encodeURIComponent(blog.image || '')}&description=${encodeURIComponent(blog.excerpt || blog.title || '')}`, '_blank', 'noopener')} className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center transition transform duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12.004 2C7.035 2 3 6.035 3 11.004c0 3.606 2.053 6.71 5.006 7.974-.07-.676-.133-1.715.028-2.45.147-.64.946-4.074.946-4.074s-.242-.486-.242-1.204c0-1.127.654-1.968 1.467-1.968.693 0 1.028.521 1.028 1.145 0 .699-.444 1.745-.674 2.716-.19.817.403 1.482 1.197 1.482 1.437 0 2.542-1.514 2.542-3.695 0-1.929-1.387-3.28-3.366-3.28-2.293 0-3.641 1.72-3.641 3.5 0 .693.266 1.436.6 1.842.066.08.075.151.056.231-.062.254-.201.817-.229.932-.036.146-.118.177-.274.107-1.02-.447-1.659-1.967-1.659-3.166 0-2.576 1.873-4.938 5.397-4.938 2.834 0 4.873 2.025 4.873 4.73 0 2.823-1.778 5.101-4.246 5.101-0.83 0-1.61-.431-1.876-.936l-.51 1.946c-.184.7-.68 1.577-1.016 2.109C9.9 21.657 10.94 22 12.004 22 16.973 22 21 17.965 21 13c0-4.966-4.027-11-8.996-11z" /></svg>
                  </button>
                </div>
              </div>
            </div>

          </header>

          <figure className="mb-8">
            <div className="relative w-full h-[520px] rounded-xl shadow-lg overflow-hidden mx-auto">
              <Image src={blog.image} alt={blog.title || 'Blog hero image'} fill className="object-cover" sizes="(min-width: 1024px) 1000px, 100vw" />
            </div>
          </figure>

          <div className="prose prose-lg max-w-none text-slate-800">
            {Array.isArray(blog.content)
              ? blog.content.map((p, idx) => {
                const isHtml = /<[^>]+>/.test(p)
                if (isHtml) {
                  const clean = DOMPurify.sanitize(p)
                  return <div key={idx} className="text-dark m-0" dangerouslySetInnerHTML={{ __html: clean }} />
                }
                return (
                  <p className="text-dark m-0" key={idx}>
                    {p}
                  </p>
                )
              })
              : typeof blog.content === 'string'
                ? (/<[^>]+>/.test(blog.content)
                  ? <div className="text-dark m-0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                  : blog.content.split(/\n\n+/).map((p, idx) => (
                    <p className='text-dark m-0' key={idx}>{p}</p>
                  )))
                : null}
          </div>

          {/* Recommended for you */}
          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Recommended for you</h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedblogs.map((r) => (
                <Link
                  key={r.id}
                  href={r.href}
                  className="group relative block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transform transition duration-200 ease-in-out hover:scale-105"
                >
                  <div className="w-full h-40 bg-gray-200 overflow-hidden relative">
                    <Image src={r.image} alt={r.title} fill className="object-cover transform transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-800">{r.category}</span>
                    <h4 className="mt-3 text-lg font-semibold text-slate-900">{r.title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{r.excerpt}</p>
                    <div className="mt-3 text-xs text-slate-500">{r.author} · {formatDate(blog.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Comments section */}
          {/* <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Comments</h3>

            <div className="space-y-3">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((c) => renderComment(c))
              ) : (
                <p className="text-slate-600">No comments yet.</p>
              )}
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-6">Leave a comment</h3>

              <div className="p-4 md:p-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm">
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section> */}
        </article>
      )}
    </section>
  )
}

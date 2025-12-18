"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!name || !email || !message) {
            setError('Please fill all fields.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.message || `Request failed: ${res.status}`);
            }

            setSuccess('Message sent — we will get back to you soon.');
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            setError(err?.message || 'Unable to send message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[70vh]">
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
                    <li className="font-semibold text-gray-900">Contact</li>
                </ol>
            </nav>
            <section className="container mx-auto px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 text-sm font-medium">Contact</div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold">Let’s create something great together</h1>
                        <p className="text-slate-600 max-w-xl">Have a question, partnership idea, or feedback? Drop us a message and our team will get back to you within 48 hours.</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="p-4 bg-white rounded-2xl shadow flex items-start gap-4">
                                <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 12C2 7.58172 5.58172 4 10 4H14C18.4183 4 22 7.58172 22 12V13C22 17.4183 18.4183 21 14 21H10C5.58172 21 2 17.4183 2 13V12Z" fill="currentColor" opacity="0.08" />
                                    <path d="M8 9H16M8 13H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <div className="font-semibold">General inquiries</div>
                                    <div className="text-sm text-slate-500">hello@yourblog.com</div>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-2xl shadow flex items-start gap-4">
                                <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 10V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <div className="font-semibold">Support</div>
                                    <div className="text-sm text-slate-500">support@yourblog.com</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div>
                        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700">Full name</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-500" placeholder="Your name" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-slate-700">Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-500" placeholder="you@company.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Message</label>
                                <textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-500" placeholder="Tell us about your project..." />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500">{error ? <span className="text-red-600">{error}</span> : success ? <span className="text-green-600">{success}</span> : <span>We reply within 48 hours</span>}</div>
                                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-black hover:bg-gray-900 text-white px-5 py-2 font-medium disabled:opacity-60">
                                    {loading ? 'Sending…' : 'Send message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Check, Copy, ArrowUpRight, Youtube, Instagram, Linkedin, Send, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'Collaboration Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const myEmail = 'yakinm100@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(myEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert('Tolong lengkapi nama, email, dan pesan Anda.');
      return;
    }

    setSubmitting(true);
    // Simulate API database route/action submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: 'Collaboration Inquiry', message: '' });
    }, 1200);
  };

  const socialLinks = [
    { name: 'Instagram', handle: '@yakinmaulana', url: 'https://instagram.com/', icon: Instagram },
    { name: 'LinkedIn', handle: 'Yakin Maulana', url: 'https://linkedin.com/', icon: Linkedin },
    { name: 'YouTube', handle: 'Yakin Studio', url: 'https://youtube.com/', icon: Youtube },
    { name: 'Vimeo', handle: 'Yakin Creative', url: 'https://vimeo.com/', icon: Mail }, // Standard placeholder icon
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 animate-fade-in" id="contact-workspace">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 items-start">
        
        {/* Left Column: Get in Touch & Socials */}
        <div className="md:col-span-5 flex flex-col gap-8 md:sticky md:top-24">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-onyx-500 uppercase mb-1.5">
              Available Worldwide
            </p>
            <h1 className="font-display text-4xl font-light text-white uppercase tracking-tight leading-none mb-4">
              LAUNCH A <br/><span className="font-bold">COLLABORATION</span>
            </h1>
            <p className="text-sm text-onyx-400 font-sans leading-relaxed">
              Have a cinema film edit context, 3D motion design project, or custom visual concept you want to develop? Drop me a message or connect directly.
            </p>
          </div>

          {/* Copyable Quick Email Block */}
          <div className="bg-onyx-900 border border-white/[0.04] p-5 rounded-2xl flex flex-col gap-3">
            <span className="text-[9px] font-mono text-onyx-500 uppercase tracking-widest">
              Direct Mail
            </span>
            <div className="flex justify-between items-center bg-black/60 border border-white/[0.05] p-3 rounded-xl">
              <span className="font-mono text-xs text-white truncate max-w-[200px]" id="display-direct-email">
                {myEmail}
              </span>
              <button
                onClick={handleCopyEmail}
                className="p-2 hover:bg-white/10 rounded-lg text-onyx-300 hover:text-white transition-all cursor-pointer"
                title="Copy email to clipboard"
                data-cursor="COPY"
                id="btn-copy-email"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-[9px] font-mono text-green-400 self-end">✓ Copied to clipboard successfully!</p>
            )}
          </div>

          {/* Socials Link Cards */}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-mono text-onyx-500 uppercase tracking-widest">
              Online Presences
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center p-3.5 bg-onyx-900/60 hover:bg-onyx-900 border border-white/[0.03] hover:border-white/[0.08] rounded-xl group transition-all"
                    data-cursor={social.name.toUpperCase()}
                    id={`social-link-${social.name.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-white/[0.04] rounded-lg flex items-center justify-center text-onyx-300 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-display font-medium text-white">{social.name}</p>
                        <p className="font-mono text-[9px] text-onyx-500">{social.handle}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-onyx-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Premium Form */}
        <div className="md:col-span-7 bg-onyx-900 border border-white/[0.04] p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          {submitted ? (
            /* Thank you notice */
            <div className="py-16 text-center flex flex-col items-center gap-4 animate-fade-in" id="contact-success-panel">
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-2 shadow-2xl">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-white">Message Transmitted</h3>
              <p className="text-xs sm:text-sm text-onyx-300 font-sans tracking-wide max-w-sm">
                Terima kasih, Yakin! Pesan Anda telah berhasil disubmit. Saya akan meninjau proposal Anda dan menghubungi Anda kembali kurang dari 24 jam.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer"
                id="btn-return-form"
              >
                Send Another message
              </button>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" id="consultation-form">
              <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-3 mb-2">
                <Send className="w-4 h-4 text-neutral-400" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-onyx-300">
                  Transmit Digital Dispatch
                </span>
              </div>

              {/* Name Field */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-widest">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name or agency"
                  required
                  className="bg-transparent border-b border-white/10 hover:border-white/20 focus:border-white outline-none py-2 text-sm text-white font-sans transition-colors placeholder-onyx-500"
                  id="input-name"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-widest">
                  YOUR EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  required
                  className="bg-transparent border-b border-white/10 hover:border-white/20 focus:border-white outline-none py-2 text-sm text-white font-sans transition-colors placeholder-onyx-500"
                  id="input-email"
                />
              </div>

              {/* Project Category Selection */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-widest">
                  SUBJECT TOPIC
                </label>
                <select
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  className="bg-onyx-950 border border-white/10 text-onyx-300 hover:border-white/20 focus:border-white outline-none px-3 py-2 rounded-xl text-xs font-mono transition-colors"
                  id="select-subject"
                >
                  <option value="Collaboration Inquiry">COLLABORATION INQUIRY</option>
                  <option value="Video Editing Commission">VIDEO EDITING COMMISSION</option>
                  <option value="Motion & 3D Project">MOTION & 3D ART DIRECTION</option>
                  <option value="Brand Photography Campaign">BRAND PHOTOGRAPHY CAMPAIGN</option>
                  <option value="Saying Hello">SAYING HELLO ✲</option>
                </select>
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] text-onyx-400 uppercase tracking-widest">
                  THE BRIEF / PROPOSAL BRIEF *
                </label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your timeline, visual tone/mood, and key deliverables..."
                  required
                  className="bg-transparent border-b border-white/10 hover:border-white/20 focus:border-white outline-none py-2 text-sm text-white font-sans transition-colors placeholder-onyx-500 resize-none"
                  id="textarea-message"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 px-8 py-4 bg-white hover:bg-onyx-200 text-black font-semibold rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:bg-onyx-800 disabled:text-onyx-500 disabled:cursor-not-allowed"
                data-cursor="TRANSMIT"
                id="btn-submit-contact"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>TRANSMITTING MESSAGE...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 fill-current" />
                    <span>TRANSMIT BRIEF</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

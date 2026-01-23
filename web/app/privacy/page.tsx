"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Server, Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 font-sans selection:bg-orange-500/30">
      
      {/* Navbar / Header */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Search</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-white/10 pb-8"
        >
          <div className="flex items-center gap-3 text-orange-500 mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-400">
            Transparent, open-source, and minimal. Just like the code.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: January 2026</p>
        </motion.div>

        {/* Content Blocks */}
        <div className="space-y-12">
          
          <PolicySection title="1. The Gist (TL;DR)" icon={<Lock size={20} />}>
            <p>
              <strong>RedditMCP</strong> is an open-source project designed to search Reddit without the clutter. 
              We do not track you. We do not use cookies for ads. We do not store your search history on any server.
            </p>
            <p className="mt-2">
              Your search query is sent to our server solely to fetch data from Reddit, and then it is immediately forgotten.
            </p>
          </PolicySection>

          <PolicySection title="2. Data Collection" icon={<Server size={20} />}>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">Personal Information:</strong> We do not collect names, emails, IP addresses, or phone numbers.
              </li>
              <li>
                <strong className="text-gray-200">Search Data:</strong> Search queries are processed in-memory to retrieve results and are not persisted in any database.
              </li>
              <li>
                <strong className="text-gray-200">Analytics:</strong> We do not use Google Analytics, Facebook Pixels, or any tracking scripts.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Third-Party Services" icon={<ExternalLinkIcon size={20} />}>
            <p>
              This application relies on the <strong>Reddit API</strong> to fetch content. When you make a search, 
              Reddit Inc. receives that request. Their data handling is governed by their own policy.
            </p>
            <div className="mt-4">
              <a 
                href="https://www.reddit.com/policies/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline underline-offset-4"
              >
                Read Reddit's Privacy Policy
              </a>
            </div>
          </PolicySection>

          <PolicySection title="4. Cookies & Local Storage" icon={<Lock size={20} />}>
            <p>
              We use <strong>Local Storage</strong> (on your device) only to remember your UI preferences (like sort order). 
              This data never leaves your browser.
            </p>
          </PolicySection>

          <PolicySection title="5. Contact the Developer" icon={<Mail size={20} />}>
            <p>
              This is an open-source project created by <strong>Raj Tejaswee</strong>. 
              If you have questions about the code or this policy, you can reach out via GitHub or LinkedIn.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://github.com/rajtejaswee" className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                GitHub Profile
              </a>
              <a href="https://www.linkedin.com/in/raj-tejaswee-147603247/" className="px-4 py-2 bg-[#0077b5]/20 text-[#0077b5] rounded-lg hover:bg-[#0077b5]/30 transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </PolicySection>

        </div>

      </main>
    </div>
  );
}

//  Helper Component 
function PolicySection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-l-2 border-white/10 pl-6 hover:border-orange-500/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3 text-white">
        <span className="text-orange-500">{icon}</span>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="text-gray-400 leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}

// Icon Helper 
function ExternalLinkIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
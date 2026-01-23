"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Github, Linkedin, ExternalLink, MessageSquare, ArrowUp, Flame, X as CloseIcon, Zap, Trophy, MessageCircle, Loader2, AlertCircle, FileText, Server } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RedditPost {
  title: string;
  url: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
}

type SortOption = "relevance" | "top" | "comments";

export default function Home() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [results, setResults] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === "") {
      setHasSearched(false);
      setResults([]);
      setError(""); 
      setSort("relevance");
    }
  };

  const clearSearch = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
    setError(""); 
    setSort("relevance");
    inputRef.current?.focus();
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const executeSearch = async (searchQuery: string, searchSort: SortOption) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]);
    setError(""); 

    try {
      const res = await fetch(`${API_BASE}/api/search?q=${searchQuery}&sort=${searchSort}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch results");
      }

      setResults(json.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, sort);
  };

  const handleSortChange = (newSort: SortOption) => {
    if (sort === newSort) return;
    setSort(newSort);
    if (query.trim()) {
      executeSearch(query, newSort);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-gray-200 font-sans selection:bg-orange-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-orange-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Flame size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">Reddit<span className="text-orange-500">MCP</span></span>
          </div>

          {/* 🛠️ FIX: Socials - Icons Only, Updated Order */}
          <div className="flex items-center gap-5">
            <SocialLink 
              href="https://www.linkedin.com/in/raj-tejaswee-147603247/" 
              icon={<Linkedin size={20} />} 
              label="" 
            />
            <SocialLink 
              href="https://x.com/raj_tejaswee" 
              icon={
                // Custom SVG for the authentic X logo
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              } 
              label="" 
            />
            <SocialLink 
              href="https://github.com/rajtejaswee" 
              icon={<Github size={20} />} 
              label="" 
            />
          </div>

        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center w-full">
        
        {/* Hero Section */}
        <div 
          className={cn(
            "flex flex-col items-center text-center w-full max-w-4xl relative z-10 transition-all duration-300", 
            hasSearched ? "mb-10" : "mt-24 mb-8"
          )}
        >
          {/* Title & Subtitle */}
          <div className="mb-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {!hasSearched && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
                    I read Reddit, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                      so you don't have to!
                    </span>
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Built by a dev who searched for ideas, saw the feed and said “nahhhhh”....
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Controls */}
          <div className="w-full max-w-2xl flex flex-col gap-6 items-center">
            
            <form onSubmit={handleFormSubmit} className="relative flex gap-2 w-full">
              <div className="relative flex-grow group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search topics (e.g., 'React Framework')..."
                  value={query}
                  onChange={handleInput}
                  className="w-full h-14 bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-12 text-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all shadow-2xl"
                />
                {query && (
                  <button 
                    type="button" 
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
                  >
                    <CloseIcon size={18} />
                  </button>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="h-14 w-32 px-8 rounded-xl font-bold text-black bg-white hover:bg-orange-600 hover:text-white transition-all duration-300 disabled:opacity-50 shadow-lg flex items-center justify-center"
              >
                {loading ? (
                   <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Search"
                )}
              </button>
            </form>

            {/* Sort Options */}
            <AnimatePresence>
              {hasSearched && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap justify-center gap-3 w-full overflow-hidden"
                >
                  <SortButton 
                    active={sort === 'relevance'} 
                    onClick={() => handleSortChange('relevance')}
                    icon={<Zap size={14} />}
                    label="Most Relevant"
                  />
                  <SortButton 
                    active={sort === 'top'} 
                    onClick={() => handleSortChange('top')}
                    icon={<Trophy size={14} />}
                    label="Most Liked"
                  />
                  <SortButton 
                    active={sort === 'comments'} 
                    onClick={() => handleSortChange('comments')}
                    icon={<MessageCircle size={14} />}
                    label="Most Discussed"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ERROR BANNER */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-2xl mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-200"
            >
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              results.map((post, i) => (
                <ResultCard key={i} post={post} index={i} />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="text-center text-gray-500 mt-20">
            No meaningful results found.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-auto bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 opacity-80">
            <span>Built by <span className="text-gray-300 font-medium">Raj Tejaswee</span></span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 font-medium">
            <a 
              href="https://modelcontextprotocol.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-2 group"
            >
              <Server size={13} className="text-green-500 group-hover:text-green-400" />
              Powered by MCP
            </a>

            <div className="h-4 w-px bg-white/10 hidden md:block"></div>

            <a href="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
              <FileText size={13} />
              Privacy Policy
            </a>

            <div className="h-4 w-px bg-white/10 hidden md:block"></div>

            <a 
              href="https://github.com/rajtejaswee/reddit-mcp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <Github size={13} />
              Open Source
            </a>
          </div>
        </div>
      </footer>
      
    </div>
  );
}


function SortButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border duration-300",
          active 
            ? "bg-orange-500/10 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
            : "bg-[#111] border-white/5 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5"
        )}
      >
        {icon}
        {label}
      </button>
    );
  }
  
  function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
      >
        {icon}
        {label && <span className="hidden sm:inline">{label}</span>}
      </a>
    );
  }
  
  function ResultCard({ post, index }: { post: RedditPost; index: number }) {
    return (
      <motion.a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group block p-5 bg-[#111] border border-white/5 rounded-xl hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-900/10 transition-all relative overflow-hidden h-full"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-lg font-semibold text-gray-200 group-hover:text-orange-400 leading-snug line-clamp-2 transition-colors">
              {post.title}
            </h2>
            <ExternalLink size={16} className="text-gray-600 group-hover:text-orange-500 flex-shrink-0 mt-1" />
          </div>
  
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-auto pt-4">
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
              <ArrowUp size={14} className={post.score > 100 ? "text-orange-500" : "text-gray-500"} />
              <span>{(post.score || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} />
              <span>{(post.num_comments || 0).toLocaleString()}</span>
            </div>
            <span className="ml-auto text-gray-600 truncate max-w-[100px]">
              u/{post.author}
            </span>
          </div>
        </div>
      </motion.a>
    );
  }
  
  function SkeletonCard() {
    return (
      <div className="p-5 bg-[#111] border border-white/5 rounded-xl space-y-4 animate-pulse h-[160px]">
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
        <div className="flex gap-2 mt-auto pt-4">
          <div className="h-6 w-16 bg-white/5 rounded"></div>
          <div className="h-6 w-16 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }
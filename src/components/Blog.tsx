/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Tag, 
  ArrowUpRight, 
  Sparkles, 
  Search,
  Bookmark,
  Share2
} from 'lucide-react';
import { articlesList } from '../data';
import { Article } from '../types';

const CATEGORIES = [
  'All',
  'Machine Learning',
  'Cloud Architecture',
  'Software Engineering',
  'Algorithms & DSA'
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = articlesList.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="writing"
      className="py-24 sm:py-28 bg-[#FFFFFF] dark:bg-[#050505] text-[#050505] dark:text-[#FFFFFF] relative z-20 border-t border-black/10 dark:border-white/12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-[#FFD000]" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#050505] dark:text-[#FFD000] uppercase">
                08 / Publications & Writing
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#050505] dark:text-[#FFFFFF] tracking-tight uppercase">
              Technical Insights &{' '}
              <span className="font-editorial italic font-normal text-[#FFD000] lowercase">
                writing.
              </span>
            </h2>
            <p className="text-[#525252] dark:text-[#A1A1A1] text-sm max-w-2xl mt-3 font-sans">
              Documenting ML optimization, cloud architecture setups, competitive algorithm breakdowns, and software engineering practices.
            </p>
          </div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative w-full md:w-72"
          >
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525252] dark:text-[#A1A1A1]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & tags..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 rounded-xl text-xs text-[#050505] dark:text-[#FFFFFF] placeholder-[#525252] dark:placeholder-[#A1A1A1]/60 focus:outline-none focus:border-[#FFD000] transition-colors"
            />
          </motion.div>
        </div>

        {/* Category Filters Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFD000] text-[#050505] border border-[#FFD000] shadow-sm'
                    : 'bg-[#FAFAFA] dark:bg-[#101010] text-[#525252] dark:text-[#A1A1A1] hover:text-[#050505] dark:hover:text-[#FFFFFF] border border-black/10 dark:border-white/12 hover:border-[#FFD000]/50'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Sparkles className="h-3 w-3 text-[#050505]" />}
              </button>
            );
          })}
        </motion.div>

        {/* Article Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center bg-[#FAFAFA] dark:bg-[#101010] rounded-2xl border border-black/10 dark:border-white/12"
            >
              <BookOpen className="h-10 w-10 text-[#525252] dark:text-[#A1A1A1] mx-auto mb-3" />
              <p className="text-[#525252] dark:text-[#A1A1A1] text-sm font-medium">
                No articles found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#FFD000] text-[#050505] rounded-xl text-xs font-mono font-bold hover:brightness-105 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {filteredArticles.map((art, index) => (
                <motion.article
                  key={art.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group rounded-2xl bg-[#FAFAFA] dark:bg-[#101010] border border-black/10 dark:border-white/12 p-6 sm:p-7 flex flex-col justify-between hover:border-[#FFD000]/60 transition-all relative overflow-hidden"
                >
                  {/* Top Header Row: Category Badge & Platform */}
                  <div>
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-[#FFD000]/15 text-[#050505] dark:text-[#FFD000] border border-[#FFD000]/40 rounded-md">
                          {art.category}
                        </span>
                        {art.featured && (
                          <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#050505] dark:bg-[#FFFFFF] text-[#FFD000] dark:text-[#050505] font-bold rounded-md">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] font-mono text-[#525252] dark:text-[#A1A1A1]">
                        <span className="px-2 py-0.5 bg-black/5 dark:bg-[#171717] rounded border border-black/10 dark:border-white/12 text-[#050505] dark:text-[#FFFFFF]">
                          {art.platform}
                        </span>
                      </div>
                    </div>

                    {/* Article Title */}
                    <a
                      href={art.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-colors"
                    >
                      <h3 className="text-lg sm:text-xl font-display font-bold text-[#050505] dark:text-[#FFFFFF] group-hover:text-[#050505] dark:group-hover:text-[#FFD000] tracking-tight leading-snug mb-3 flex items-start justify-between">
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {art.title}
                        </span>
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#525252] dark:text-[#A1A1A1] group-hover:text-[#FFD000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-2" />
                      </h3>
                    </a>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A1A1A1] leading-relaxed mb-6 line-clamp-3">
                      {art.description}
                    </p>
                  </div>

                  {/* Bottom Footer: Tags & Metadata & Read Link */}
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {art.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono text-[#525252] dark:text-[#A1A1A1] bg-white dark:bg-[#171717] border border-black/10 dark:border-white/12 px-2.5 py-1 rounded-lg flex items-center"
                        >
                          <Tag className="h-2.5 w-2.5 mr-1 text-[#FFD000]" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info & Read Button */}
                    <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-[#525252] dark:text-[#A1A1A1] font-mono">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {art.publishDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {art.readTime}
                        </span>
                      </div>

                      <a
                        href={art.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#050505] dark:text-[#FFD000] hover:underline transition-colors group/link"
                      >
                        <span>Read Article</span>
                        <ExternalLink className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

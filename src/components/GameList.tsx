'use client';

import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { Gamepad2, Smartphone, Monitor, Ticket, Layers, Search } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  slug: string;
  publisher: string;
  category: string;
  thumbnail: string;
  isPopular: boolean;
  _count?: {
    products: number;
  };
}

const CATEGORIES = [
  { label: 'Semua', icon: Layers },
  { label: 'Mobile Game', icon: Smartphone },
  { label: 'PC Game', icon: Monitor },
  { label: 'Voucher', icon: Ticket },
];

export default function GameList({ initialSearch = '' }: { initialSearch?: string }) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    fetchGames();
  }, [activeCategory, search]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'Semua') params.set('category', activeCategory);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/games?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="katalog" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Gamepad2 className="w-4 h-4" />
            KATALOG PRODUK RESMI
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Pilih Game & Voucher
          </h2>
        </div>

        {/* Search Bar & Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          {/* Quick filter input directly in catalog */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/70" />
            <input
              type="text"
              placeholder="Cari game di sini..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-900/90 border border-sky-500/20 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  window.history.replaceState(null, '', '/');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-sky-500/15'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Search Filter Badge */}
      {search.trim() && (
        <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-400/30 text-xs text-sky-300 w-fit">
          <span>Menampilkan hasil pencarian untuk: <strong className="text-white">&quot;{search}&quot;</strong></span>
          <button
            onClick={() => {
              setSearch('');
              window.history.replaceState(null, '', '/');
            }}
            className="ml-2 px-2 py-0.5 rounded bg-sky-500/20 hover:bg-rose-500/30 hover:text-rose-200 transition-colors"
          >
            ✕ Reset Filter
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-900/40 border border-slate-800 h-64 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="bg-slate-800/80 h-36 rounded-xl" />
              <div className="space-y-2">
                <div className="bg-slate-800/80 h-3 w-1/3 rounded" />
                <div className="bg-slate-800/80 h-4 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-sky-500/10 p-8">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Game tidak ditemukan</h3>
          <p className="text-sm text-slate-400 mt-1">
            Coba kata kunci lain atau pilih kategori &quot;Semua&quot;
          </p>
        </div>
      )}
    </section>
  );
}

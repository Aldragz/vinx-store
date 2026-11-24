import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface GameProps {
  id: string;
  name: string;
  slug: string;
  publisher: string;
  category: string;
  thumbnail: string;
  isPopular?: boolean;
  _count?: {
    products: number;
  };
}

export default function GameCard({ game }: { game: GameProps }) {
  return (
    <Link
      href={`/order/${game.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 border border-sky-500/20 hover:border-sky-400 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(14,165,233,0.3)] backdrop-blur-md"
    >
      {/* Popular Badge */}
      {game.isPopular && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-lg">
          <Sparkles className="w-3 h-3 fill-slate-950" />
          POPULAR
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Sky blue gradient vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-[#080D1A]/30 to-transparent" />

        {/* Hover Arrow Icon */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-sky-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[11px] font-semibold tracking-wide uppercase text-sky-400">
            {game.publisher}
          </span>
          <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1 mt-0.5">
            {game.name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-sky-500/10 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {game._count?.products ? `${game._count.products} Item` : 'Stok Tersedia'}
          </span>
          <span className="font-semibold text-sky-400 flex items-center gap-1">
            Top Up
            <span className="text-slate-500">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle } from 'lucide-react';

interface GridItemProps {
  id: string;
  title: string;
  emoji: string;
  subtitle?: string;
  imageUrl?: string;
  likes?: number;
  comments?: number;
  onClick: () => void;
  layoutId: string;
}

export const GridItem = ({ title, emoji, imageUrl, likes = 0, comments = 0, onClick, layoutId }: GridItemProps) => (
  <motion.div
    layoutId={layoutId}
    onClick={onClick}
    className="relative aspect-square bg-white dark:bg-[#1c1c1c] border border-[#dbdbdb] dark:border-[#333] rounded-lg cursor-pointer group overflow-hidden"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    {imageUrl ? (
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-200">{emoji}</span>
        <span className="text-xs font-semibold text-[#8e8e8e] px-2 text-center leading-tight">{title}</span>
      </div>
    )}
    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
      <div className="flex items-center gap-1"><Heart size={18} fill="white" /><span className="text-sm">{likes}</span></div>
      <div className="flex items-center gap-1"><MessageCircle size={18} fill="white" /><span className="text-sm">{comments}</span></div>
    </div>
  </motion.div>
);

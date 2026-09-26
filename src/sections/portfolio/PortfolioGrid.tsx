import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, ArrowUpRight, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useSiteContent } from '../../content.context';
import { t } from '../../content';
import { PortfolioProject } from '../../types';

type Project = {
  title: string;
  client: string;
  date: string;
  location: string;
  category: string;
  videoUrl?: string;
  poster?: string;
  image?: string;
};

function ReelsCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (i: number) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && project.videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group space-y-8 cursor-pointer"
      onClick={() => onOpen(index)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-[85%] mx-auto">
        <div className="relative aspect-[9/16] rounded-[40px] overflow-hidden shadow-2xl group-hover:shadow-black/10 transition-all duration-700 border-8 border-gray-50">
          {project.videoUrl ? (
            <video
              ref={videoRef}
              src={project.videoUrl}
              poster={project.poster || undefined}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(227,6,19,0.15)', border: '1px solid rgba(227,6,19,0.3)' }}>
                <Play className="w-7 h-7 text-white/40 ml-1" />
              </div>
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest text-center px-4">
                {project.category}
              </span>
            </div>
          )}

          {/* Play indicator (hover'da gizlenir) */}
          {project.videoUrl && !isHovered && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                <Play className="w-7 h-7 fill-white text-white ml-1" />
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-10 left-10 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/20 uppercase tracking-widest">
            {project.category}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8 pointer-events-none">
            <div className="space-y-2 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-xl font-black text-white tracking-tight leading-tight drop-shadow-lg">{project.title}</h3>
              <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                {project.client} <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt bilgiler */}
      <div className="flex flex-wrap gap-6 text-xs text-white/60 font-bold uppercase tracking-widest px-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {project.date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {project.location}
        </div>
      </div>
    </motion.div>
  );
}

function ReelsViewer({ projects, activeIndex, onClose, onNavigate }: {
  projects: Project[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const project = projects[activeIndex];
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          className="absolute top-8 right-8 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10 z-20"
          onClick={onClose}
        >
          <X className="w-7 h-7" />
        </button>

        {/* Navigation buttons */}
        {activeIndex > 0 && (
          <button
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 z-20"
            onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1); }}
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}
        {activeIndex < projects.length - 1 && (
          <button
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 z-20"
            onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1); }}
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Reels video */}
        <motion.div
          key={activeIndex}
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[9/16] h-[85vh] max-w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              poster={project.poster || undefined}
              autoPlay
              controls
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4"
              style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(227,6,19,0.15)', border: '1px solid rgba(227,6,19,0.3)' }}>
                <Play className="w-9 h-9 text-white/50 ml-1" />
              </div>
              <div className="text-center px-6">
                <div className="text-white/60 text-sm font-bold uppercase tracking-widest mb-1">{project.category}</div>
                <div className="text-white/30 text-xs">Video tezliklə əlavə olunacaq</div>
              </div>
            </div>
          )}

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
            <div className="space-y-3">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/20 uppercase tracking-widest">
                {project.category}
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">{project.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-xs font-bold uppercase tracking-widest">
                <span>{project.client}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {project.date}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {project.location}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PortfolioGrid() {
  const [activeReel, setActiveReel] = useState<number | null>(null);
  const { content, locale } = useSiteContent();

  const PROJECTS: Project[] = (content?.portfolio?.projects || []).map((p: PortfolioProject) => ({
    title:    t(locale, p.title),
    client:   p.client,
    date:     t(locale, p.date),
    location: t(locale, p.location),
    category: t(locale, p.category),
    videoUrl: p.videoUrl || undefined,
    poster:   p.poster   || undefined,
    image:    p.image    || undefined,
  }));

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {PROJECTS.map((project, i) => (
          <ReelsCard
            key={i}
            project={project}
            index={i}
            onOpen={setActiveReel}
          />
        ))}
      </section>

      <AnimatePresence>
        {activeReel !== null && (
          <ReelsViewer
            projects={PROJECTS}
            activeIndex={activeReel}
            onClose={() => setActiveReel(null)}
            onNavigate={setActiveReel}
          />
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, ArrowUpRight, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

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

const PROJECTS: Project[] = [
  {
    title: 'Beynəlxalq Enerji Forumu',
    client: 'Energetika Nazirliyi',
    date: 'İyun 2023',
    location: 'Bakı Konqres Mərkəzi',
    videoUrl: '/videos/service1.mp4',
    poster: 'https://images.unsplash.com/photo-1505373877841-8d2547d4e3e4?q=80&w=800&auto=format&fit=crop',
    category: 'Konfrans',
  },
  {
    title: 'Yeni İl Korporativ Gecəsi',
    client: 'PASHA Bank',
    date: 'Dekabr 2023',
    location: 'Four Seasons Hotel',
    videoUrl: '/videos/service2.mp4',
    poster: 'https://images.unsplash.com/photo-1547828407-657878541226?q=80&w=800&auto=format&fit=crop',
    category: 'Korporativ',
  },
  {
    title: 'Məhsul Təqdimatı',
    client: 'Samsung Azerbaijan',
    date: 'Mart 2024',
    location: 'JW Marriott Absheron',
    videoUrl: '/videos/service3.mp4',
    poster: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
    category: 'Təqdimat',
  },
  {
    title: 'Yay Festivalı',
    client: 'Mədəniyyət Nazirliyi',
    date: 'Avqust 2023',
    location: 'Dənizkənarı Bulvar',
    videoUrl: '/videos/services-bg.mp4',
    poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    category: 'Festival',
  },
  {
    title: 'Teambuilding Günü',
    client: 'SOCAR',
    date: 'Sentyabr 2023',
    location: 'Quba Palace',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    category: 'Teambuilding',
  },
  {
    title: 'Musiqi Mükafatları',
    client: 'İTV',
    date: 'Yanvar 2024',
    location: 'Heydər Əliyev Sarayı',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    category: 'Konsert',
  },
];

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
              poster={project.poster}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
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
              poster={project.poster}
              autoPlay
              controls
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
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

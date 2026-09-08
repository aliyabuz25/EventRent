import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1464366409647-53c3f6b2a0a0?q=80&w=800&auto=format&fit=crop', category: 'Bağça' },
  { url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop', category: 'Açıq Hava' },
  { url: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800&auto=format&fit=crop', category: 'Terras' },
  { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop', category: 'Dekor' },
  { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop', category: 'İşıq' },
  { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop', category: 'Səhnə' },
];

export default function EventgardenGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.eg-gallery-item',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-5 h-px bg-premium-orange" />
        <span className="text-[9px] tracking-[0.35em] uppercase font-inter text-white/60">
          Qalereya
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {IMAGES.map((img, i) => (
          <motion.div
            key={i}
            className="eg-gallery-item opacity-0 group relative aspect-square rounded-[40px] overflow-hidden cursor-pointer shadow-2xl hover:shadow-black/10 transition-all duration-700 border-8 border-gray-50"
            onClick={() => setSelectedImage(img.url)}
          >
            <img
              src={img.url}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              alt={img.category}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-12">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black scale-0 group-hover:scale-100 transition-transform duration-700 delay-100">
                <Maximize2 className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute top-10 left-10 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/20 uppercase tracking-widest">
              {img.category}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-12 right-12 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              src={selectedImage}
              className="max-w-full max-h-full rounded-[40px] shadow-2xl border border-white/5"
              alt="Full size"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

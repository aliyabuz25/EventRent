import React from 'react';
import GalleryHero from '../sections/gallery/GalleryHero';
import GalleryGrid from '../sections/gallery/GalleryGrid';

export default function Gallery() {
  return (
    <div className="space-y-32 pb-20">
      <GalleryHero />
      <GalleryGrid />
    </div>
  );
}

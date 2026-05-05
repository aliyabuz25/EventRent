import React from 'react';

export default function ContactMap() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-[600px] rounded-[60px] bg-gray-50 overflow-hidden relative shadow-inner group">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-1000 z-10 pointer-events-none" />
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.428490102005!2d49.8712345!3d40.4012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI0JzA0LjQiTiA0OcKwNTInMTYuNCJF!5e0!3m2!1sen!2saz!4v1620000000000!5m2!1sen!2saz" 
          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
        />
        <div className="absolute top-12 left-12 z-20">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl border border-white/20 shadow-2xl text-black">
            <h4 className="text-xl font-bold tracking-tight mb-2">Bizim Ofis</h4>
            <p className="text-gray-500 text-sm font-light">Gəlin qonağımız olun, <br /> tədbirinizi birlikdə planlaşdıraq.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

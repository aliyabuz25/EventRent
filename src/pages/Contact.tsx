import React from 'react';
import ContactHero from '../sections/contact/ContactHero';
import ContactForm from '../sections/contact/ContactForm';
import ContactMap from '../sections/contact/ContactMap';

export default function Contact() {
  return (
    <div className="space-y-32 pb-20">
      <ContactHero />
      <ContactForm />
      <ContactMap />
    </div>
  );
}

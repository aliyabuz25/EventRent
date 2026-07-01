import React from 'react';
import ContactHero from '../sections/contact/ContactHero';
import ContactForm from '../sections/contact/ContactForm';
import ContactMap from '../sections/contact/ContactMap';
import ContactCTA from '../sections/contact/ContactCTA';

export default function Contact() {
  return (
    <div className="space-y-32 pb-20">
      <ContactHero />
      <ContactForm />
      <ContactCTA />
      <ContactMap />
    </div>
  );
}

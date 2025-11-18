import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '../../utils/cn';
// NOTE: This is an experimental, standalone footer variant.
// The production layout (AppLayout) always renders components/Footer.tsx.
// Keep this file opt-in only (design experiments, prototypes) to avoid
// multiple competing footer designs and duplicate BackToTop buttons.


// Footer data structure
interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
  columns?: number;
}

interface SocialLink {
  id: string;
  platform: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}

interface FooterProps {
  sections: FooterSection[];
  socialLinks: SocialLink[];
  companyInfo: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
  };
  legal: {
    imprint: string;
    privacy: string;
    terms: string;
    cookiePolicy: string;
  };
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  className?: string;
}

const EnhancedFooter: React.FC<FooterProps> = ({
  sections,
  socialLinks,
  companyInfo,
  legal,
  newsletter,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          className="grid gap-12 lg:grid-cols-12"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info Section */}
          <motion.div
            className="lg:col-span-4 space-y-6"
            variants={sectionVariants}
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                ZOE <span className="text-primary-600">Solar</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {companyInfo.description}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 mb-3">Kontakt</h4>
              <div className="space-y-2">
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {companyInfo.phone}
                </a>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {companyInfo.email}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 mb-3">Folgen Sie uns</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.id}
                    href={social.href}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation Sections */}
          <motion.div
            className="lg:col-span-5 grid gap-8 md:grid-cols-2"
            variants={sectionVariants}
          >
            {sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h4 className="font-semibold text-slate-900 text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors duration-200 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                        {link.badge && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                            {link.badge}
                          </span>
                        )}
                        {link.external && (
                          <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Newsletter Section */}
          {newsletter && (
            <motion.div
              className="lg:col-span-3"
              variants={sectionVariants}
            >
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-200">
                <h4 className="font-bold text-slate-900 text-lg mb-2">
                  {newsletter.title}
                </h4>
                <p className="text-slate-600 text-sm mb-4">
                  {newsletter.description}
                </p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletter.placeholder}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubscribed ? 'Erfolgreich abonniert!' : newsletter.buttonText}
                  </motion.button>
                </form>

                <AnimatePresence>
                  {isSubscribed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mt-3 p-3 bg-primary-100 border border-primary-200 rounded-lg"
                    >
                      <p className="text-primary-700 text-sm font-medium">
                        Vielen Dank für Ihre Anmeldung!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Trust Badges Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-slate-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Trust badges would go here */}
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Zertifiziert nach</div>
              <div className="text-sm font-semibold text-slate-700">ISO 9001</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Mitglied im</div>
              <div className="text-sm font-semibold text-slate-700">BSW</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Top Auszeichnung</div>
              <div className="text-sm font-semibold text-slate-700">PhotovoltaikTest</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">5★ Service</div>
              <div className="text-sm font-semibold text-slate-700">Kundenbewertung</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <p className="font-semibold text-white mb-2">{companyInfo.name}</p>
              <p className="text-sm text-slate-400 mb-1">{companyInfo.address}</p>
              <p className="text-xs text-slate-500">
                USt-IdNr: {companyInfo.taxId}
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a
                href={legal.imprint}
                className="hover:text-white transition-colors"
              >
                Impressum
              </a>
              <a
                href={legal.privacy}
                className="hover:text-white transition-colors"
              >
                Datenschutzerklärung
              </a>
              <a
                href={legal.terms}
                className="hover:text-white transition-colors"
              >
                AGB
              </a>
              <a
                href={legal.cookiePolicy}
                className="hover:text-white transition-colors"
              >
                Cookie-Richtlinie
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              © {currentYear} {companyInfo.name}. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button (disabled here to avoid duplicate with AppLayout BackToTopButton) */}
      {/**
      <BackToTopButton />
      */}
    </footer>
  );
};

// Back to Top Button Component
const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Nach oben scrollen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default EnhancedFooter;
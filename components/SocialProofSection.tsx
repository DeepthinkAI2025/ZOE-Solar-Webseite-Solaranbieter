import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company?: string;
  location: string;
  quote: string;
  savings: string;
  rating: number;
  imageAlt: string;
  systemSize: string;
  installationDate: string;
}

interface Project {
  id: string;
  title: string;
  location: string;
  systemSize: string;
  completionDate: string;
  imageAlt: string;
  description: string;
  category: 'agriculture' | 'residential' | 'business';
  specialFeatures: string[];
}

interface Certification {
  id: string;
  name: string;
  description: string;
  year: string;
  imageAlt: string;
}

interface SocialProofSectionProps {
  testimonials: Testimonial[];
  projects: Project[];
  certifications: Certification[];
  companyStats: {
    installations: string;
    experience: string;
    satisfaction: string;
    revenue: string;
  };
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ 
  testimonials, 
  projects, 
  certifications, 
  companyStats 
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeProjectCategory, setActiveProjectCategory] = useState<'all' | 'agriculture' | 'residential' | 'business'>('all');

  const filteredProjects = activeProjectCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeProjectCategory);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Company Stats Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Vertrauen Sie dem Marktführer</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Über 15.000 zufriedene Kunden sprechen für sich
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            ZOE Solar ist der führende Anbieter für Photovoltaik-Lösungen in Deutschland. 
            Unsere Erfolgsgeschichte basiert auf Vertrauen, Qualität und nachhaltigen Ergebnissen.
          </p>
        </div>

        {/* Company Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
              {companyStats.installations}
            </div>
            <div className="text-slate-600 font-medium">Installierte Anlagen</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
              {companyStats.experience}
            </div>
            <div className="text-slate-600 font-medium">Jahre Erfahrung</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl">
            <div className="text-4xl lg:text-5xl font-bold text-yellow-600 mb-2">
              {companyStats.satisfaction}
            </div>
            <div className="text-slate-600 font-medium">Kundenzufriedenheit</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
            <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
              {companyStats.revenue}
            </div>
            <div className="text-slate-600 font-medium">Millionen Euro Umsatz</div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Das sagen unsere Kunden
            </h3>
            <p className="text-lg text-slate-600">
              Echte Erfahrungen von echten Kunden - sehen Sie selbst, warum wir der vertrauensvolle Partner 
              für Ihre Solarenergie-Lösung sind.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Testimonial Content */}
              <div>
                <div className="mb-6">
                  <StarRating rating={testimonials[activeTestimonial].rating} />
                </div>
                
                <blockquote className="text-xl lg:text-2xl text-slate-700 font-medium leading-relaxed mb-8">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-lg">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-slate-600">
                      {testimonials[activeTestimonial].title}
                      {testimonials[activeTestimonial].company && ` • ${testimonials[activeTestimonial].company}`}
                    </div>
                    <div className="text-green-600 font-semibold">
                      💰 {testimonials[activeTestimonial].savings} pro Jahr gespart
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-semibold text-slate-900">Systemgröße</div>
                    <div className="text-slate-600">{testimonials[activeTestimonial].systemSize}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-semibold text-slate-900">Installation</div>
                    <div className="text-slate-600">{testimonials[activeTestimonial].installationDate}</div>
                  </div>
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      activeTestimonial === index
                        ? 'bg-white shadow-lg border-2 border-green-200'
                        : 'bg-white/50 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">{testimonial.location}</div>
                        <div className="text-green-600 font-medium text-sm">
                          {testimonial.savings} gespart
                        </div>
                      </div>
                      <StarRating rating={testimonial.rating} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Gallery */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Unsere Referenzprojekte
            </h3>
            <p className="text-lg text-slate-600 mb-8">
              Entdecken Sie eine Auswahl unserer erfolgreich realisierten Solarprojekte.
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { key: 'all', label: 'Alle Projekte' },
                { key: 'agriculture', label: 'Landwirtschaft' },
                { key: 'residential', label: 'Privat' },
                { key: 'business', label: 'Gewerbe' }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveProjectCategory(category.key as any)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeProjectCategory === category.key
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.category === 'agriculture' ? 'bg-green-100 text-green-800' :
                      project.category === 'business' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.category === 'agriculture' ? 'Landwirtschaft' :
                       project.category === 'business' ? 'Gewerbe' : 'Privat'}
                    </span>
                    <span className="text-sm text-slate-500">{project.completionDate}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h4>
                  <p className="text-slate-600 mb-3">{project.location}</p>
                  <p className="text-sm text-slate-700 mb-4">{project.description}</p>
                  
                  <div className="space-y-2">
                    {project.specialFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="text-lg font-bold text-green-600">{project.systemSize}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="text-center mb-12">
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Zertifizierungen & Auszeichnungen
          </h3>
          <p className="text-lg text-slate-600 mb-8">
            Unsere Qualität ist durch führende Institutionen bestätigt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert) => (
            <div key={cert.id} className="text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{cert.name}</h4>
              <p className="text-sm text-slate-600 mb-2">{cert.description}</p>
              <div className="text-sm font-medium text-blue-600">{cert.year}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Werden Sie Teil unserer Erfolgsgeschichte
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Über 15.000 Kunden vertrauen bereits auf unsere Expertise. 
            Lassen Sie uns gemeinsam Ihre nachhaltige Energiezukunft gestalten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontakt"
              className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Kostenlose Beratung vereinbaren
            </Link>
            <Link
              to="/projekte"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Weitere Referenzen ansehen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
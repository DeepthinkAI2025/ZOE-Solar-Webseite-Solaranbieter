import React from 'react'
import { useCaseStudies } from '../../hooks/useCaseStudies'
import { NotionHeroImage } from '../NotionContent'

export function NotionProjectGallery() {
  const { loading, error, getFeaturedCaseStudies } = useCaseStudies()
  const featuredStudies = getFeaturedCaseStudies(6)

  if (loading) {
    return (
      <section className="project-gallery py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Projekte</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="project-gallery py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Projektanzeige nicht verfügbar
              </h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="project-gallery py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Projekte</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Erfahren Sie mehr über unsere erfolgreichsten Solarprojekte und wie wir Unternehmen bei der Energiewende unterstützen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStudies.map((study) => (
            <div key={study.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <NotionHeroImage
                  src={study.imageUrl}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${study.category === 'commercial' ? 'bg-blue-100 text-blue-800' : ''}
                    ${study.category === 'residential' ? 'bg-green-100 text-green-800' : ''}
                    ${study.category === 'agricultural' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {study.category === 'commercial' ? 'Gewerbe' :
                     study.category === 'residential' ? 'Privat' : 'Landwirtschaft'}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {study.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {study.excerpt}
                </p>

                {/* Project Highlights */}
                <div className="space-y-3 mb-4">
                  {study.highlights.slice(0, 2).map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-2xl">{highlight.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{highlight.value}</div>
                        <div className="text-sm text-gray-600">{highlight.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Project Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>📍 {study.location}</span>
                  <span>📅 {new Date(study.date).toLocaleDateString('de-DE')}</span>
                </div>

                {/* Call to Action */}
                <a
                  href={`/fallstudien/${study.slug}`}
                  className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Projekt ansehen
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects */}
        <div className="text-center mt-12">
          <a
            href="/fallstudien"
            className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-medium"
          >
            Alle Fallstudien ansehen
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
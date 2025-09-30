export async function suggestForManufacturer() {
  throw new Error('Die Gemini-Integration wurde entfernt. Verwende Firecrawl MCP für Datenextraktion.');
}

export async function optimizeKeywords(content, targetKeywords, language = 'de') {
  const { GoogleGenerativeAI } = await import('@google/genai');
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Analysiere den folgenden Content und optimiere ihn für die gegebenen Keywords.
Content: ${content}
Target Keywords: ${targetKeywords.join(', ')}
Sprache: ${language}

Bitte gib eine optimierte Version des Contents zurück, die:
1. Die Keywords natürlich integriert
2. Die Lesbarkeit behält
3. SEO-freundlich ist
4. Semantische Relevanz berücksichtigt

Optimiere Titel, Überschriften, Meta-Beschreibungen und Textinhalt.
Gib das Ergebnis als JSON zurück mit den Feldern: optimizedTitle, optimizedMetaDescription, optimizedContent, keywordDensity, suggestions.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if no JSON found
    return {
      optimizedTitle: content.split('\n')[0] || 'Optimiert Titel',
      optimizedMetaDescription: content.substring(0, 160),
      optimizedContent: content,
      keywordDensity: {},
      suggestions: ['Content wurde analysiert']
    };
  } catch (error) {
    console.error('Keyword optimization error:', error);
    return {
      optimizedTitle: content.split('\n')[0] || 'Optimiert Titel',
      optimizedMetaDescription: content.substring(0, 160),
      optimizedContent: content,
      keywordDensity: {},
      suggestions: ['Fehler bei der Optimierung']
    };
  }
}

export default { suggestForManufacturer, optimizeKeywords };
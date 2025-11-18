// Mock for OpenRouter API (Mistral) used in tests
export const mockOpenRouterResponse = {
  content: 'Mock OpenRouter response for testing',
  usage: {
    promptTokens: 10,
    completionTokens: 20,
    totalTokens: 30,
    cost: 0.00003
  }
};

export const mockGenerateContent = jest.fn().mockResolvedValue(mockOpenRouterResponse);
export const mockGenerateContentStream = jest.fn().mockImplementation(async function* () {
  yield { text: 'Streaming chunk 1' };
  yield { text: 'Streaming chunk 2' };
  return { text: 'Streaming done' };
});

export const createMockOpenRouter = () => ({
  // Keep compatibility with both patterns used in codebase
  models: {
    generateContent: mockGenerateContent,
    generateContentStream: mockGenerateContentStream,
  },
  getGenerativeModel: jest.fn(() => ({
    generateContent: mockGenerateContent,
    generateContentStream: mockGenerateContentStream,
  })),
  generateContent: mockGenerateContent,
});

export const mockAIResponses = {
  initial: 'Hallo! Ich bin der ZOE Solar Assistent. Wie kann ich Ihnen helfen?',
  solar: 'Photovoltaik ist eine ausgezeichnete Wahl für saubere Energie...',
  financing: 'Wir bieten verschiedene Finanzierungsoptionen an...',
  error: 'Entschuldigung, ich habe Ihre Anfrage nicht verstanden.'
};

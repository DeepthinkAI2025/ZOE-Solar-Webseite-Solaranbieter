import { renderHook, act } from '@testing-library/react';
import { useAIChatState } from '@hooks/useAIChatState';

// Mock dependencies
jest.mock('@services/AICacheService', () => ({
  AICacheService: {
    getInstance: jest.fn(() => ({
      getCachedResponse: jest.fn(),
      cacheResponse: jest.fn(),
    }))
  }
}));

describe('useAIChatState', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAIChatState());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.step).toBe('start');
    expect(result.current.userInput).toBe('');
    expect(result.current.currentLang).toBe('de-DE');
  });

  it('should handle user input changes', () => {
    const { result } = renderHook(() => useAIChatState());

    act(() => {
      result.current.setUserInput('Test message');
    });

    expect(result.current.userInput).toBe('Test message');
  });

  it('should add user message using addMessage function', () => {
    const { result } = renderHook(() => useAIChatState());

    act(() => {
      result.current.addMessage('user', 'Test message');
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toMatchObject({
      sender: 'user',
      text: 'Test message'
    });
  });

  it('should handle conversation reset using goToStep', () => {
    const { result } = renderHook(() => useAIChatState());

    // Add some state
    act(() => {
      result.current.setUserInput('Test');
      result.current.addMessage('user', 'Test message');
      result.current.goToStep('configuring_service');
    });

    // Reset conversation
    act(() => {
      result.current.goToStep('start');
      result.current.resetFormData();
    });

    expect(result.current.step).toBe('start');
    expect(result.current.userInput).toBe('Test'); // userInput is not reset by resetFormData
  });

  it('should handle language switching', () => {
    const { result } = renderHook(() => useAIChatState());

    expect(result.current.currentLang).toBe('de-DE');

    act(() => {
      result.current.setCurrentLang('en-US');
    });

    expect(result.current.currentLang).toBe('en-US');
  });

  it('should handle loading state correctly', () => {
    const { result } = renderHook(() => useAIChatState());

    act(() => {
      result.current.setIsLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setIsLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle step transitions', () => {
    const { result } = renderHook(() => useAIChatState());

    act(() => {
      result.current.goToStep('configuring_service');
    });

    expect(result.current.step).toBe('configuring_service');
    expect(result.current.stepHistory).toContain('configuring_service');
  });

  it('should handle form data correctly', () => {
    const { result } = renderHook(() => useAIChatState());

    act(() => {
      result.current.setFormData({ name: 'John Doe', email: 'john@example.com' });
    });

    expect(result.current.formData).toEqual({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('should handle multiple messages', () => {
    const { result } = renderHook(() => useAIChatState());

    act(() => {
      result.current.addMessage('user', 'User message');
      result.current.addMessage('ai', 'AI response');
      result.current.addMessage('system', 'System message');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[0].sender).toBe('user');
    expect(result.current.messages[1].sender).toBe('ai');
    expect(result.current.messages[2].sender).toBe('system');
  });

  it('should handle thinking message', () => {
    const { result } = renderHook(() => useAIChatState());

    act(() => {
      result.current.setThinkingMessage('AI is thinking...');
    });

    expect(result.current.thinkingMessage).toBe('AI is thinking...');

    act(() => {
      result.current.setThinkingMessage(null);
    });

    expect(result.current.thinkingMessage).toBe(null);
  });

  it('should handle contextual prompts', () => {
    const { result } = renderHook(() => useAIChatState());

    const prompts = ['Prompt 1', 'Prompt 2', 'Prompt 3'];

    act(() => {
      result.current.setContextualPrompts(prompts);
    });

    expect(result.current.contextualPrompts).toEqual(prompts);
  });
});
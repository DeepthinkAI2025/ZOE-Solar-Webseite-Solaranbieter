import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';

interface CommandHubProps {
  isOpen: boolean;
  onClose: () => void;
  setPage: (page: Page) => void;
}

type Command = {
  type: 'page' | 'action';
  title: string;
  category: string;
  action: () => void;
  icon: React.ReactNode;
};

const CommandHub: React.FC<CommandHubProps> = ({ isOpen, onClose, setPage }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
  };

  const commands: Command[] = [
    { type: 'page', title: 'Startseite', category: 'Seiten', action: () => setPage('home'), icon: <PageIcon /> },
    // FIX: Changed invalid page 'leistungen' to 'photovoltaik'.
    { type: 'page', title: 'Leistungen', category: 'Seiten', action: () => setPage('photovoltaik'), icon: <PageIcon /> },
    { type: 'page', title: 'Produkte', category: 'Seiten', action: () => setPage('produkte'), icon: <PageIcon /> },
    { type: 'page', title: 'Über Uns', category: 'Seiten', action: () => setPage('ueber-uns'), icon: <PageIcon /> },
    { type: 'page', title: 'Karriere', category: 'Seiten', action: () => setPage('karriere'), icon: <PageIcon /> },
    { type: 'page', title: 'Kontakt', category: 'Seiten', action: () => setPage('kontakt'), icon: <PageIcon /> },
    { type: 'action', title: 'Kostenlose Analyse starten', category: 'Aktionen', action: openChat, icon: <ActionIcon /> },
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Enter') {
      if (filteredCommands[activeIndex]) {
        filteredCommands[activeIndex].action();
      }
    }
  };
  
  const handleSelect = (command: Command) => {
    command.action();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div 
        className="relative z-10 w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200 form-on-light"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            placeholder="Suchen oder Befehl eingeben..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-3 text-lg bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
            aria-label="Suchen"
          />
        </div>
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {filteredCommands.length > 0 ? (
            <ul role="listbox">
              {filteredCommands.map((command, index) => (
                <li
                  key={command.title}
                  onClick={() => handleSelect(command)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                    index === activeIndex ? 'bg-green-100 text-green-800' : 'text-slate-700'
                  }`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <div className="flex items-center gap-3">
                    {command.icon}
                    <span>{command.title}</span>
                  </div>
                  <span className="text-xs text-slate-400">{command.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-slate-500">Keine Ergebnisse gefunden.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const ActionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

export default CommandHub;
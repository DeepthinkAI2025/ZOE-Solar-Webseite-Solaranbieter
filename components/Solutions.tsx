import React from 'react';

const solutions = [
  {
    number: '01',
    icon: 'independent',
    title: 'Die beste Lösung für Ihren Betrieb',
    description: 'Wir sind an keine Marke gebunden. Sie erhalten eine maßgeschneiderte Anlage mit den effizientesten Komponenten, die der Weltmarkt bietet. Das Fundament für Ihre maximale Rendite.',
  },
  {
    number: '02',
    icon: 'team',
    title: 'Ein Team, dem Sie vertrauen können',
    description: 'Keine Subunternehmer. Nur festangestellte, IHK-zertifizierte Experten arbeiten an Ihrem Projekt. Das garantiert höchste Qualität, direkte Kommunikation und volle Verantwortung.',
  },
  {
    number: '03',
    icon: 'all_in_one',
    title: 'Ein Ansprechpartner für alles',
    description: 'Von der Analyse über die Planung und den Netzanschluss bis zur Installation und Wartung – wir sind Ihr einziger Ansprechpartner. Effizient, zuverlässig und stressfrei.',
  },
  {
    number: '04',
    icon: 'partner',
    title: 'Wir sind für Sie da – ein Leben lang',
    description: 'Als regionaler Partner sind wir auch nach der Inbetriebnahme für Sie da. Mit 24/7-Monitoring und schnellem Service sichern wir Ihre Erträge über Jahrzehnte.',
  },
];

const SolutionIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
    const iconClass = "h-8 w-8 text-green-600";
    const strokeWidth = 1.5;
    switch (iconName) {
        case 'independent': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
        case 'team': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75v-.75a3.375 3.375 0 013.375-3.375s-1.543.425-2.25 1.5c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75M6.375 12v.75a3.375 3.375 0 01-3.375 3.375c-1.386 0-2.595-.57-3.375-1.5m15.75-3.375c.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75M9 12.75h6" /></svg>;
        case 'all_in_one': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
        case 'partner': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v4.286a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7v-4.286zM12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
        default: return null;
    }
}

const Solutions: React.FC = () => {
  return (
    <section id="system" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <p className="font-bold text-green-600 uppercase tracking-wider">Unser System</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Das ZOE Solar Prinzip: Partnerschaft für Generationen.</h2>
          <p className="text-lg text-slate-600 mt-4">
            Ein erfolgreiches Projekt braucht Vertrauen und einen verlässlichen Partner. Unser Prinzip basiert auf gemeinsamen Werten und sichert Ihr Investment für die Zukunft Ihrer Familie ab.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution) => (
            <div key={solution.number} className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-green-200">
                <div className="absolute -top-4 -right-4 text-8xl font-bold text-slate-200/50 select-none">
                    {solution.number}
                </div>
                <div className="relative z-10">
                    <div className="mb-4">
                        <SolutionIcon iconName={solution.icon} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{solution.title}</h3>
                    <p className="text-slate-600 flex-grow">{solution.description}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
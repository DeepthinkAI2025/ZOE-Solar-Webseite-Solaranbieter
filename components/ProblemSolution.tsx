import React from 'react';

interface ProblemSolutionProps {
    icon: React.ReactNode;
    problemTitle: string;
    problemDescription: string;
    solutionTitle: string;
    solutionDescription: string;
}

const ProblemSolution: React.FC<ProblemSolutionProps> = ({ icon, problemTitle, problemDescription, solutionTitle, solutionDescription }) => {
    return (
        <section className="overflow-hidden bg-white py-12">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Problem Side */}
                    <div className="bg-red-50/50 p-8 rounded-xl border-2 border-dashed border-red-200">
                        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">Das typische Marktproblem</h3>
                        <h4 className="text-2xl font-bold text-slate-900 mb-3">{problemTitle}</h4>
                        <p className="text-slate-600 leading-relaxed">{problemDescription}</p>
                    </div>
                    {/* Solution Side */}
                    <div className="bg-green-50/50 p-8 rounded-xl border-l-4 border-green-500">
                        <div className="mb-4">
                            {icon}
                        </div>
                        <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3">Der ZOE Solar Standard</h3>
                        <h4 className="text-2xl font-bold text-slate-900 mb-3">{solutionTitle}</h4>
                        <p className="text-slate-600 leading-relaxed">{solutionDescription}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
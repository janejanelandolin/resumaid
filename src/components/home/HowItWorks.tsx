import React from 'react';
import { Search, Upload, Download } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Find a job',
    description: 'Paste a job posting URL, copy-paste the description, or just type the job title.',
    color: 'bg-indigo-100 text-indigo-600',
    border: 'border-indigo-100',
  },
  {
    icon: Upload,
    number: '02',
    title: 'Upload your resume',
    description: 'Drop in a PDF, DOCX, or TXT file — or paste the text directly.',
    color: 'bg-purple-100 text-purple-600',
    border: 'border-purple-100',
  },
  {
    icon: Download,
    number: '03',
    title: 'Download, tailored',
    description: 'Get a rewritten resume with your score, a cover letter, and a change log — in under 2 minutes.',
    color: 'bg-emerald-100 text-emerald-600',
    border: 'border-emerald-100',
  },
];

const HowItWorks: React.FC = () => (
  <section className="py-10 space-y-6">
    <h2 className="text-center text-lg font-bold text-gray-700 tracking-tight">
      How it works
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`relative rounded-2xl border ${step.border} bg-white/70 backdrop-blur-sm p-5 space-y-3 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2 ${step.color}`}>
              <step.icon size={16} />
            </div>
            <span className="text-xs font-bold text-gray-300">{step.number}</span>
          </div>
          <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;

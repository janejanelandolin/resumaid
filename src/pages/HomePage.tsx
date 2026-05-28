import { useEffect } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import NavBar from '@/components/layout/NavBar';
import JobSearchForm from '@/components/home/JobSearchForm';
import HowItWorks from '@/components/home/HowItWorks';
import PricingSection from '@/components/home/PricingSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const HomePage = () => {
  const { resetAllState } = useResumeContext();

  useEffect(() => {
    if (sessionStorage.getItem('resumeWorkflowComplete') === 'true') {
      resetAllState();
      sessionStorage.removeItem('resumeWorkflowComplete');
    }
  }, [resetAllState]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/40 to-white">
      <NavBar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="pt-14 pb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
            ✨ AI-powered resume optimisation
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Land more{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              interviews.
            </span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            ResumAID rewrites your resume to match any job posting — with a compatibility score, cover letter, and full change log — in under 2 minutes.
          </p>
        </section>

        {/* ── Job search form ───────────────────────────────────────── */}
        <JobSearchForm />

        {/* ── Social proof strip ────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-center">
          {[
            { stat: '14K+', label: 'Resumes optimised' },
            { stat: '97%', label: 'Improved scores' },
            { stat: '2 min', label: 'Average turnaround' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── How it works ──────────────────────────────────────────── */}
        <HowItWorks />

        {/* ── Pricing ───────────────────────────────────────────────── */}
        <PricingSection />

        {/* ── Testimonials ──────────────────────────────────────────── */}
        <TestimonialsSection />
      </main>
    </div>
  );
};

export default HomePage;

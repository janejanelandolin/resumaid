import React from 'react';
import { Check, Sparkles, Infinity } from 'lucide-react';

const oneTime = [
  'Download as Word (.docx)',
  'AI-tailored to the job posting',
  'Before/after compatibility score',
  'Change log explaining every edit',
  'No account required',
];

const subscription = [
  'Everything in the $1.99 plan',
  'Unlimited resumes',
  'Cover letter generation',
  'Career Journey tracker',
  'Priority support',
];

const PricingSection: React.FC = () => (
  <section className="py-10 space-y-6">
    <h2 className="text-center text-lg font-bold text-gray-700 tracking-tight">
      Simple, honest pricing
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* $1 card */}
      <div className="rounded-2xl border border-indigo-100 bg-white/70 backdrop-blur-sm p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900">$1.99</span>
            <span className="text-sm text-gray-400 mb-1">per resume</span>
          </div>
          <p className="text-xs text-gray-500">One resume, one download. No strings attached.</p>
        </div>
        <ul className="space-y-2">
          {oneTime.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <Check size={13} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium">
          <Sparkles size={12} />
          No account required
        </div>
      </div>

      {/* $14.99 card */}
      <div className="rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 space-y-4 shadow-md relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Most popular
        </div>
        <div className="space-y-1">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900">$14.99</span>
            <span className="text-sm text-gray-400 mb-1">/month</span>
          </div>
          <p className="text-xs text-gray-500">For serious job seekers applying to multiple roles.</p>
        </div>
        <ul className="space-y-2">
          {subscription.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <Check size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5 text-xs text-purple-600 font-medium">
          <Infinity size={12} />
          Cancel anytime
        </div>
      </div>

    </div>
  </section>
);

export default PricingSection;

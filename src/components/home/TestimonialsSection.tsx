
import { Star } from 'lucide-react';

const testimonials = [
  { name: "Sarah J.", role: "Marketing Specialist", text: "ResumAID helped me land my dream job after 3 months of searching!" },
  { name: "Michael T.", role: "Software Engineer", text: "My interview callbacks increased by 300% after using ResumAID." },
  { name: "Jessica L.", role: "Project Manager", text: "The optimization suggestions were spot-on! Highly recommend!" },
];

const TestimonialsSection = () => {
  return (
    <div className="mt-12 pt-8 border-t border-purple-100">
      <div className="text-center space-y-6">
        <div className="relative h-24 overflow-hidden bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-inner">
          <div className="absolute w-full animate-rotate-testimonials">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="py-2">
                <p className="text-sm italic text-gray-600">"{testimonial.text}"</p>
                <p className="text-xs font-medium mt-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  {testimonial.name}, {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-primary">
            Join 10,000+ professionals who optimized their resumes with ResumAID
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <StatCard number="97%" label="Improved Scores" gradient="from-purple-600 to-primary" />
            <StatCard number="75%" label="More Interviews" gradient="from-blue-600 to-primary" />
            <StatCard number="14K+" label="Resumes Optimized" gradient="from-indigo-600 to-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ number, label, gradient }: { number: string; label: string; gradient: string }) => (
  <div className="text-center p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all border border-purple-100">
    <p className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${gradient}`}>{number}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

export default TestimonialsSection;

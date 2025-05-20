
import { Star, User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  { name: "Sarah J.", role: "Marketing Specialist", text: "ResumAID helped me land my dream job after 3 months of searching!" },
  { name: "Michael T.", role: "Software Engineer", text: "My interview callbacks increased by 300% after using ResumAID." },
  { name: "Jessica L.", role: "Project Manager", text: "The optimization suggestions were spot-on! Highly recommend!" },
];

const TestimonialsSection = () => {
  const [api, setApi] = useState<any>(null);
  const intervalRef = useRef<number | null>(null);

  // Set up automatic rotation
  useEffect(() => {
    if (!api) return;

    // Clear any existing interval when api changes
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    // Create new interval that advances the carousel every 5 seconds
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [api]);

  return (
    <div className="mt-12 pt-8 border-t border-purple-100">
      <div className="text-center space-y-6">
        <div className="relative rounded-lg">
          <Carousel className="w-full max-w-lg mx-auto" setApi={setApi}>
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-white/70 backdrop-blur-sm border border-purple-100">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="mb-4">
                          <User className="h-10 w-10 rounded-full bg-purple-100 p-2 text-purple-600" />
                        </div>
                        <p className="text-sm italic text-gray-600 mb-4">"{testimonial.text}"</p>
                        <p className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                          {testimonial.name}, {testimonial.role}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
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

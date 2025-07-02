import React from 'react';
import { TestimonialsSection } from './ui/testimonials-with-marquee';

export default function Testimonials() {
  // FoodBridge-specific testimonials
  const testimonials = [
    {
      author: {
        name: "Sarah Johnson",
        handle: "@sarahj",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      text: "FoodBridge helped me reduce food waste in my restaurant by 40%. The community connections we've made are invaluable!",
      href: "#"
    },
    {
      author: {
        name: "Michael Chen",
        handle: "@chefmike",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      text: "As a local chef, I've found incredible ingredients through FoodBridge that would have otherwise gone to waste. Sustainable and inspiring!",
      href: "#"
    },
    {
      author: {
        name: "Priya Patel",
        handle: "@priyacooks",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "FoodBridge has transformed how our community thinks about food sharing. We've built connections while fighting waste!"
    },
    {
      author: {
        name: "David Wilson",
        handle: "@davefood",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "The platform is so easy to use! I've shared excess produce from my garden and met amazing people in my neighborhood.",
      href: "#"
    },
    {
      author: {
        name: "Olivia Martinez",
        handle: "@oliviam",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      text: "As a student, FoodBridge has helped me access quality food while on a budget. The community is so supportive!"
    }
  ];

  return (
    <div className="relative">
      <TestimonialsSection
        title="See what our users are saying about FoodBridge! !"
       
        testimonials={testimonials}
      />
    </div>
  );
}

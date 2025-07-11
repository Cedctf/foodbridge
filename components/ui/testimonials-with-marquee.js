"use client";
import { cn } from "../../lib/utils";
import { TestimonialCard } from "./testimonial-card";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typewriter } from "./typewriter";

/**
 * @typedef {Object} TestimonialsSectionProps
 * @property {string} title
 * @property {string} description
 * @property {Array<import("./testimonial-card").TestimonialCardProps>} testimonials
 * @property {string} [className]
 */

/**
 * @param {TestimonialsSectionProps} props
 */
export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}) {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Animate only once
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const marqueeStyle = useMemo(() => ({
    "--duration": "40s",
    "--gap": "1rem",
  }), []);

  return (
    <section ref={sectionRef} className={cn(
      "py-12 sm:py-24 md:py-32 px-0",
      className
    )}>
      <MarqueeKeyframes />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight h-24 sm:h-32 flex items-center justify-center">
            {isInView && <Typewriter text={title} loop={false} />}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-gray-600 sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2" style={marqueeStyle}>
            <div
              className="flex flex-row group-hover:[animation-play-state:paused]"
              style={{ animation: "scroll-x var(--duration) linear infinite", gap: "var(--gap)" }}
            >
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <TestimonialCard key={i} {...testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeKeyframes() {
  return (
    <style jsx>
      {`
          @keyframes scroll-x {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-50% - var(--gap) / 2));
            }
          }
      `}
    </style>
  );
}

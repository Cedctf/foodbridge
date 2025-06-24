import Image from 'next/image';
import Link from 'next/link';
import { BentoGrid } from './ui/bento-grid';
import { BentoCard } from './ui/bento-grid';
import { DonationIcon, FindIcon, ReduceIcon } from './icons';
export default function Features() {
  const features = [
    {
      Icon: DonationIcon,
      name: "Donate Surplus Food",  
      description: "",
      href: "/donate",
      cta: "Donate Now",
      background: (
        <div className="absolute inset-0 bg-white bg-opacity-20">
          <Image 
            src="/images/feature-card1.png" 
            alt="Donate food"  
            fill 
            style={{objectFit: 'cover', opacity: 0.8}} 
            priority
          />
        </div>
      ),
      className: "col-span-1 lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2 h-[300px]",
    },
    {
      Icon: FindIcon,
      name: "Find Available Food",
      description: "",
      href: "/find",
      cta: "Find Food",
      background: (
        <div className="absolute inset-0 bg-white bg-opacity-20">
          <Image 
            src="/images/feature-card2.png" 
            alt="Find food" 
            fill 
            style={{objectFit: 'cover', opacity: 0.8}} 
            priority
          />
        </div>
      ),
      className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3 h-[300px]",
    },
    {
      Icon: ReduceIcon,
      name: "Reduce Food Waste",
      description: "",
      href: "/impact",
      cta: "Learn More",
      background: (
        <div className="absolute inset-0 bg-white bg-opacity-20">
          <Image 
            src="/images/feature-card3.png" 
            alt="Reduce waste" 
            fill 
            style={{objectFit: 'cover', opacity: 0.8}} 
            priority
          />
        </div>
      ),
      className: "col-span-1 lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3 h-[300px]",
    },
    {
      Icon: DonationIcon,
      name: "Track Your Impact",
      description: "",
      href: "/impact",
      cta: "View Impact",
      background: (
        <div className="absolute inset-0 bg-white bg-opacity-20">
          <Image 
            src="/images/plate_of_food.png" 
            alt="Plate of food" 
            fill 
            style={{objectFit: 'cover', opacity: 0.8}} 
            priority
          />
        </div>
      ),
      className: "col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3 h-[600px]",
    },
  ];

  return (
    <div className="relative bg-white text-black mt-20 py-4 px-0 w-screen max-w-none overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-1 mr-200">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent inline-block">Features</h3>
      </div>
      <div className="relative z-10 w-full">
        <BentoGrid className="lg:grid-rows-2 w-full max-w-none">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}

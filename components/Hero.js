import Image from 'next/image';
import Link from 'next/link';
import { BentoGrid } from './ui/bento-grid';
import { BentoCard } from './ui/bento-grid';
import { DonationIcon, FindIcon, ReduceIcon } from './icons';
export default function Hero() {
  const features = [
    {
      Icon: DonationIcon,
      name: "Donate Surplus Food",
      description: "",
      href: "/donate",
      cta: "Donate Now",
      background: <div className="absolute inset-0 bg-gray-100 bg-opacity-90"></div>,
      className: "col-span-1 lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2 h-[200px]",
    },
    {
      Icon: FindIcon,
      name: "Find Available Food",
      description: "",
      href: "/find",
      cta: "Find Food",
      background: <div className="absolute inset-0 bg-gray-100 bg-opacity-90"></div>,
      className: "col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3 h-[200px]",
    },
    {
      Icon: ReduceIcon,
      name: "Reduce Food Waste",
      description: "",
      href: "/impact",
      cta: "Learn More",
      background: <div className="absolute inset-0 bg-gray-100 bg-opacity-90"></div>,
      className: "col-span-1 lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3 h-[200px]",
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
      className: "col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3 h-[420px]",
    },
  ];

  return (
    <div className="relative bg-white text-black py-4 px-0 w-screen max-w-none overflow-hidden">
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

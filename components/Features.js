import Image from 'next/image';

export default function Features() {
  const features = [
    {
      icon: '/icons/donate.svg',
      title: 'Donate Surplus Food',
      description: 'Businesses and individuals can easily list surplus food items for donation.'
    },
    {
      icon: '/icons/find.svg',
      title: 'Find Food Near You',
      description: 'Recipients can quickly locate and request available food donations in their area.'
    },
    {
      icon: '/icons/reduce.svg',
      title: 'Reduce Environmental Impact',
      description: 'By reducing food waste, we contribute to a healthier planet and sustainable communities.'
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">How FoodBridge Works</h2>
        <p className="text-gray-600 text-center mb-12">
          Our platform simplifies the process of donating and receiving surplus food, ensuring it reaches those who need it most.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <Image 
                  src={feature.icon} 
                  alt={feature.title} 
                  width={24} 
                  height={24} 
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

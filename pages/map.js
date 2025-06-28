import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

// Import the map component with dynamic loading to avoid SSR issues
const GoogleMapComponent = dynamic(
  () => import('../components/GoogleMap'),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F7FCFA' }}>
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Map</h1>
            <p className="text-gray-600">Discover food donations and restaurants near you</p>
          </div>
          
          {/* Map Container with integrated search */}
          <div style={{ backgroundColor: 'none' }}>
            <GoogleMapComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
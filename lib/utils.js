import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Geocoding function to convert address to coordinates
export async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: data.results[0].formatted_address
      };
    } else {
      console.error('Geocoding failed:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Batch geocoding for multiple addresses
export async function geocodeAddresses(addresses) {
  const results = [];
  
  for (const address of addresses) {
    const result = await geocodeAddress(address);
    results.push({
      address,
      coordinates: result
    });
  }
  
  return results;
}

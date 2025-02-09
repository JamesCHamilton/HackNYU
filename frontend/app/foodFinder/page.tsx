"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../componenets/input';
import { Card, CardContent } from '../componenets/card';
import { Loader2, MapPin, Star, Clock } from 'lucide-react';
import { Button } from '../componenets/button';
import Place from '../interfaces/Place';
import { useRouter } from 'next/navigation'; // Import useRouter

declare global {
  interface Window {
    google: any;
  }
}

export default function FoodFinder() {
  const [food, setFood] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false); // State for tracking if map is loaded
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);

  const router = useRouter(); // Initialize the router

  // Load Google Maps API dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsMapLoaded(true); // Set map as loaded when the script finishes loading
      document.head.appendChild(script);
    } else {
      setIsMapLoaded(true); // If already loaded, set the state
    }
  }, []);

  const initializeMap = (latitude: number, longitude: number) => {
    if (isMapLoaded && mapRef.current && window.google) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
      });
      setMap(googleMap);
    } else {
      console.error('Google Maps API has not loaded yet');
    }
  };

  const handleSearch = async () => {
    if (!food.trim()) {
      setError('Please enter a food name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
        });
      });

      const { latitude, longitude } = position.coords;

      if (isMapLoaded) {
        initializeMap(latitude, longitude); // Initialize the map only when the API is loaded

        const response = await fetch(`http://localhost:3001/api/search?food=${encodeURIComponent(food)}&lat=${latitude}&lng=${longitude}`);
        
        if (!response.ok) throw new Error('Failed to fetch results');

        const data = await response.json();
        setResults(data.results);

        // Add markers to the map for each place
        data.results.forEach((place: any) => {
          new window.google.maps.Marker({
            position: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
            map: map,
            title: place.name,
          });
        });
      } else {
        console.error('Google Maps API not loaded yet');
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Failed to search locations');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/'); // Navigate to the home page
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Find Food Near You</h1>

      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Search for pizza, sushi, burgers..."
          value={food}
          onChange={(e) => {
            setFood(e.target.value);
            setError('');
          }}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : 'Search'}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {results.map((place, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {place.name}
              </h3>

              <div className="mt-2 text-sm text-gray-600">
                <p className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {place.rating || 'No rating'}
                </p>
                <p className="mt-1">{place.vicinity}</p>
                {place.open_now !== undefined && (
                  <p className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4" />
                    {place.open_now ? 'Open Now' : 'Closed'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {results.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            No results found. Try another search.
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        style={{ height: '400px', width: '100%', marginTop: '2rem' }}
      ></div>

      {/* Back to Home Button */}
      <div className="mt-4 text-center">
        <Button onClick={handleBackToHome} className="bg-blue-500 text-white px-4 py-2 rounded">
          Back to Home
        </Button>
      </div>
    </div>
  );
}

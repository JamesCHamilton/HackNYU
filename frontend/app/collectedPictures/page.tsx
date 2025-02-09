"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../componenets/button";
import { Card, CardHeader, CardTitle, CardContent } from "../componenets/card";
import Link from "next/link";

export default function CollectedPictures() {
  const router = useRouter();
  const [collectedPhotos, setCollectedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER}/clients`, { 
      withCredentials: true 
    })
    .then((res) => {
      const photoData = res.data.client.collectedPhotos || [];
      
      const photoUrls = photoData.map((photo: string) => {
        // Case 1: Direct URL (starts with http)
        if (photo.startsWith("http")) {
          return photo;
        }
  
        // Case 2: Base64-encoded JSON metadata
        if (photo.startsWith("data:image/jpeg;base64,")) {
          try {
            const base64String = photo.replace(/^data:image\/jpeg;base64,/, "");
            const decoded = JSON.parse(atob(base64String));
            
            // Check if 'url' exists in the decoded data
            return decoded.url || null;
          } catch (err) {
            console.error("Failed to decode photo data:", err);
            return null;
          }
        }
  
        return null;  // Return null if it doesn't match any case
      }).filter(Boolean);  // Remove any null entries
  
      setCollectedPhotos(photoUrls);
      setError("");
    })
    .catch((error) => {
      console.error("Error fetching collected photos:", error);
      setError("Failed to load collected photos");
    })
    .finally(() => setLoading(false));
  }, []);
   

  return (
    <div className="min-h-screen bg-[#E1E5F2] text-[#022B3A]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#1F7A8C]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#FFFFFF]">Collected Pictures</h1>
        </div>
        <Button className="bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
          <Link href="/cdashboard">Back to Dashboard</Link>
        </Button>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <Card className="bg-[#FFFFFF] shadow-lg">
          <CardHeader>
            <CardTitle>Your Collected Pictures</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7A8C]"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : collectedPhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collectedPhotos.map((photoUrl, index) => {
                  console.log("Photo URL:", photoUrl); // Check this in the console
                  return (
                    <img
                      key={index}
                      src={photoUrl}
                      alt={`Collected Picture ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">No pictures collected yet.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
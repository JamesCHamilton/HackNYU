"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Calendar, Stethoscope, Pill, Activity, MessageCircle, Plus, ClipboardList, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../componenets/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../componenets/card";
import FoodRecommendation from "../interfaces/FoodRecommendation";
import HealthLog from "../interfaces/HealthLog";


export default function ClientDashboard() {
  const router = useRouter();
  const [currentLog, setCurrentLog] = useState<HealthLog>({
    bloodGlucose: "",
    bloodPressure: "",
    weight: "",
    timestamp: "",
  });
  const [foodRecommendations, setFoodRecommendations] = useState<FoodRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collectedPhotos, setCollectedPhotos] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);

  const fetchDashboard = () => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER}/clients`, { 
      withCredentials: true 
    })
    .then((res) => {
      // Ensure latestMetrics is correctly fetched
      console.log("Backend response:", res.data);
      setCurrentLog(res.data.client.latestMetrics || {
        bloodGlucose: "N/A",
        bloodPressure: "N/A",
        weight: "N/A",
        timestamp: ""
      });
      setCollectedPhotos(res.data.client.collectedPhotos || []);
      setFoodRecommendations(res.data.client.foodRecommendations || []);
      console.log(res.data.client.points + "something");
      setPoints(res.data.client.points || 0);
      console.log("Points set to:", res.data.client.points); // Log the points value
      setError("");
    })
    .catch((error) => {
      console.error(error);
      setError("Failed to load health data");
  
      setCurrentLog({
        bloodGlucose: "N/A",
        bloodPressure: "N/A",
        weight: "N/A",
        timestamp: ""
      });
    })
    .finally(() => setLoading(false));
  };
  

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sending the log data to the server
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/logs`,
        {
          ...currentLog,
          timestamp: new Date().toISOString(),
        },
        {
          withCredentials: true,
        }
      );
  
      // Clear the form
      setCurrentLog({
        bloodGlucose: "",
        bloodPressure: "",
        weight: "",
        timestamp: "",
      });
  
      // Refetch dashboard data to update health metrics
      fetchDashboard();
    } catch (error) {
      console.error("Error submitting log:", error);
  
      // You can also display a more specific error message if available
      setError("There was an issue submitting your log. Please try again.");
    }
  };  

  const fetchRandomPicture = async () => {
    try {
        const animal = ['cat', 'dog'][Math.floor(Math.random() * 2)]; // Randomly choose "cat" or "dog"
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER}/clients/collectRandomPhoto`, // Use clientId in the URL
            { animal }, // Send the animal type in the request body
            { withCredentials: true }
        );
        setCollectedPhotos([...collectedPhotos, response.data.photoUrl]);
        setPoints(points - 100); // Deduct 100 points
        alert("Picture collected successfully!");
    } catch (error) {
        console.error("Error fetching random picture:", error);
        alert("Failed to collect picture. Please try again.");
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentLog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#E1E5F2] text-[#022B3A]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#1F7A8C]">
        <div className="flex items-center gap-4">
          <Image src="/companyLogo.png" alt="Company Logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-[#FFFFFF]">Client Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
            <Link href="/cdashboard">Profile</Link>
          </Button>
          <Button className="bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Workout Plan Card (Original preserved) */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-[#1F7A8C]" />
                Workout Plan
              </CardTitle>
              <CardDescription>Your workout for the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600">Current workout plan details...</p>
                <Button className="w-full mt-4 bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  View Full Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Food Recommendations Card (Original preserved with fixes) */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="text-[#1F7A8C]" />
                Food Recommendations
              </CardTitle>
              <CardDescription>Recommended foods from your trainer</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7A8C]"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <div className="space-y-4">
                  {foodRecommendations.length > 0 ? (
                    foodRecommendations.map((food) => (
                      <div key={food.name} className="flex items-center justify-between p-2 bg-[#F5F5F5] rounded">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-gray-600">{food.description}</p>
                        </div>
                        <Button className="bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                          <Link href={`/food-map?food=${encodeURIComponent(food.name)}`}>
                            Find Nearby
                          </Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No food recommendations available</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collect Random Picture Card */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image src="/picture-icon.png" alt="Picture Icon" width={24} height={24} />
                Collect Random Picture
              </CardTitle>
              <CardDescription>Spend 100 points to collect a random cat or dog picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Your Points:</span>
                  <span className="text-[#022B3A] font-semibold">{points}</span>
                </div>
                <Button
                  onClick={() => fetchRandomPicture()}
                  className="w-full bg-[#1F7A8C] text-white hover:bg-[#165A6B]"
                  disabled={points < 100}
                >
                  Get a Random Cat/Dog Picture
                </Button>
                <Button
                  onClick={() => router.push("/collectedPictures")}
                  className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]"
                >
                  View All Pictures
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Health Metrics Card (Fixed with icons) */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-[#1F7A8C]" />
                Health Metrics
              </CardTitle>
              <CardDescription>Last recorded vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7A8C]"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <div className="space-y-4">
                  <MetricItem 
                    label="Weight" 
                    value={currentLog.weight ? `${currentLog.weight} kg` : "N/A"} 
                    icon={<ClipboardList className="h-4 w-4" />}
                  />
                  <MetricItem
                    label="Blood Pressure"
                    value={currentLog.bloodPressure || "N/A"}
                    icon={<Activity className="h-4 w-4" />}
                  />
                  <MetricItem
                    label="Blood Glucose"
                    value={currentLog.bloodGlucose ? `${currentLog.bloodGlucose} mg/dL` : "N/A"}
                    icon={<Stethoscope className="h-4 w-4" />}
                  />
                  {currentLog.timestamp && (
                    <div className="text-sm text-gray-500 mt-2">
                      Last recorded: {new Date(currentLog.timestamp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Log Entry (Fixed with weight field and proper form handling) */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="text-[#1F7A8C]" />
                Daily Health Log
              </CardTitle>
              <CardDescription>Record your daily health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    name="bloodGlucose"
                    value={currentLog.bloodGlucose}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={currentLog.bloodPressure}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="120/80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={currentLog.weight}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-[#1F7A8C] text-white hover:bg-[#165A6B]"
                >
                  Submit Daily Log
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Chat with Trainer (Original preserved) */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="text-[#1F7A8C]" />
                Chat with Trainer
              </CardTitle>
              <CardDescription>Communicate with your trainer</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                <Link href="/trainer-chat">Start Chat</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Appointment Schedule (Original preserved) */}
          <Card className="bg-[#FFFFFF] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-[#1F7A8C]" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-[#F5F5F5] rounded">
                  <div>
                    <p className="font-medium">Next Session</p>
                    <p className="text-sm text-gray-600">March 15, 2024 at 2:00 PM</p>
                  </div>
                  <Button variant="outline" className="border-[#1F7A8C] text-[#1F7A8C]">
                    Details
                  </Button>
                </div>
                <Button className="w-full mt-2 bg-[#BFDBF7] text-[#022B3A] hover:bg-[#A0C4E2]">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule New Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer (Original preserved) */}
      <footer className="p-4 bg-[#1F7A8C] text-[#FFFFFF] text-center">
        <p>© {new Date().getFullYear()} HealthTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Updated MetricItem with icon support
const MetricItem = ({ label, value, icon }: { 
  label: string; 
  value: string; 
  icon?: React.ReactNode 
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      {icon && <span className="text-[#1F7A8C]">{icon}</span>}
      <span className="font-medium">{label}:</span>
    </div>
    <span className="text-[#022B3A] font-semibold">{value}</span>
  </div>
);
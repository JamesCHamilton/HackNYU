"use client";

import { useState } from "react";
import { Button } from "../componenets/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../componenets/card";
import { Calculator } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../componenets/dropdowns";

export default function CalorieCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [maintenanceCalories, setMaintenanceCalories] = useState<number | null>(null);
  const [error, setError] = useState("");

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      setError("Please enter valid numbers for all fields.");
      setMaintenanceCalories(null);
      return;
    }

    setError("");

    let bmr;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    let activityMultiplier;
    switch (activityLevel) {
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "very_active":
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }

    const maintenance = bmr * activityMultiplier;
    setMaintenanceCalories(maintenance);
  };

  return (
    <div className="min-h-screen bg-[#E1E5F2] text-[#022B3A]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#1F7A9C]">
        <Image
          src="/companyLogo.png" // Replace with your company logo
          alt="Company Logo"
          width={50}
          height={50}
        />
        <ul className="flex gap-8 text-lg font-semibold text-[#FFFFFF]">
          <li className="hover:underline">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:underline">
            <Link href="/mission">Mission</Link>
          </li>
          <li className="hover:underline">
            <Link href="/testimony">Testimony</Link>
          </li>
          <li className="hover:underline">
            <Link href="/about">About</Link>
          </li>
          <li className="hover:underline">
            <Link href="/foodFinder">Let's Find Some Food</Link>
          </li>
          <li className="hover:underline">
            <Link href="/calorieCalculator">Calorie Calculator</Link>
          </li>
        </ul>
         <div className="flex gap-4 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#1F7A9C] text-[#1D1D1D] px-4 py-2 rounded">
                        Login
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#FDE8E7]">
                      <DropdownMenuItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-[#1D1D1D]">
                              Client
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#FFFFFF]">
                            <DropdownMenuItem>
                              <Link href="/clogin">Login</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href="/csignup">Signup</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-[#1D1D1D]">
                              Trainer
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#FFFFFF]">
                            <DropdownMenuItem>
                              <Link href="/tlogin">Login</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href="/tsignup">Signup</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </nav>

      {/* Main Content */}
      <main className="p-8 flex justify-center items-center">
        <Card className="bg-[#FFFFFF] shadow-lg w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="text-[#1F7A8C]" />
              Calculate Your Daily Calories
            </CardTitle>
            <CardDescription>Enter your details to calculate your daily caloric needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age (years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                  <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                  <option value="active">Active (hard exercise/sports 6-7 days a week)</option>
                  <option value="very_active">Very active (very hard exercise/sports & physical job)</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                onClick={calculateCalories}
                className="w-full bg-[#1F7A8C] text-white hover:bg-[#165A6B]"
              >
                Calculate
              </Button>
              {maintenanceCalories !== null && (
                <div className="mt-4 p-4 bg-[#BFDBF7] text-[#022B3A] rounded-lg text-center">
                  <p>To maintain your weight:</p>
                  <p className="text-2xl font-bold">{maintenanceCalories.toFixed(2)} kcal/day</p>
                  <p className="mt-2">To lose weight:</p>
                  <p className="text-xl font-bold">{(maintenanceCalories - 500).toFixed(2)} kcal/day</p>
                  <p className="mt-2">To gain weight:</p>
                  <p className="text-xl font-bold">{(maintenanceCalories + 500).toFixed(2)} kcal/day</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-[#1F7A8C] text-[#FFFFFF] text-center">
        <p>© {new Date().getFullYear()} Equilibrium Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}

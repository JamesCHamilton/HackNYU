"use client"; // Mark this component as a Client Component

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    });

  // State for dynamic data (e.g., theme or other variables)
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState(""); // State to handle login errors

  useEffect(() => {
    // Ensure this runs only on the client side
    setHydrated(true);
  }, []);

  const handleInputChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    console.log(value)
    setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
    });
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data using FormData API
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    console.log(formData)

    try {
      // Send login request to the backend
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER}/clients`,
        { username, password },
        { withCredentials: true }
      );

      // If login is successful, redirect to the client dashboard
      if (response.status === 200) {
        router.push("/cdashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error messages
      if (error.response) {
        setError(error.response.data.error || "Invalid username or password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Prevent rendering on the server
  if (!hydrated) {
    return null; // Render nothing on the server
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#022834]">
      <div className="bg-[#1F7A9C] p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/companyLogo.png" // Replace with your company logo
            alt="Company Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold text-[#FFFFFF]">Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#FFFFFF]"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#FFFFFF]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#022834] bg-[#BF0F7] hover:bg-[#A30E6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BF0F7]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
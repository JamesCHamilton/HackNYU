"use client"; // Mark this component as a Client Component

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TrainerDataTypes from "@/app/interfaces/Trainer";

const TrainerSignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TrainerDataTypes>({
    firstName: "",
    lastName: "",
    dateofbirth: "",
    email: "",
    phoneNumber: "",
    gender: "",
    idNumber: "",
    username: "",
    password: "",
    yearsOfExpierence:"",
    tosAccepted: false,
    certificateImage: null,
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: any) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    (Object.keys(formData) as Array<keyof TrainerDataTypes>).forEach((key) => {
      const value = formData[key];
      if (value !== null && value !== undefined) {
        if (key === 'certificateImage') {
          // Handle File | null type
          if (value instanceof File) {
            data.append(key, value);
          }
        } else {
          data.append(key, value.toString());
        }
      }
    });
  
    axios.post(`${process.env.NEXT_PUBLIC_SERVER}/trainers`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      router.push("/tdashboard");
    })
    .catch((error: any) => {
      console.error(error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#022834]">
      <div className="bg-[#1F7A9C] p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-[#FFFFFF] text-center mb-6">
          Trainer Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#FFFFFF]">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[#FFFFFF]">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Date Of Birth */}
          <div>
            <label htmlFor="dateofbirth" className="block text-sm font-medium text-[#FFFFFF]">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateofbirth"
              name="dateofbirth"
              value={formData.dateofbirth}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-[#FFFFFF]">
              What is your sex?
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#FFFFFF]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#FFFFFF]">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Certificate Upload */}
          <div>
            <label htmlFor="certificateImage" className="block text-sm font-medium text-[#FFFFFF]">
              Upload Your Certificate
            </label>
            <input
              type="file"
              id="certificateImage"
              name="certificateImage"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#BF0F7] file:text-white hover:file:bg-[#A30E6]"
              required
            />
          </div>

          <div>
            <label htmlFor="yearsOfExpierence" className="block text-sm font-medium text-[#FFFFFF]">
              Years Of Expierence
            </label>
            <input
              type="text"
              id="yearsOfExpierence"
              name="yearsOfExpierence"
              value={formData.yearsOfExpierence}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#FFFFFF]">
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#FFFFFF]">
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
        

          {/* Terms of Service */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tosAccepted"
              name="tosAccepted"
              checked={formData.tosAccepted}
              onChange={handleInputChange}
              className="mr-2"
              required
            />
            <label htmlFor="tosAccepted" className="text-sm text-[#FFFFFF]">
              I accept the Terms and Conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#022834] bg-[#BF0F7] hover:bg-[#A30E6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BF0F7]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainerSignUp;

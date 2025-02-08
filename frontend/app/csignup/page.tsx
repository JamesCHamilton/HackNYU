"use client"; // Mark this component as a Client Component

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ClientSignUp = () => {
const router = useRouter()
const [formData, setFormData] = useState({
firstName: "",
lastName: "",
dateofbirth: "",
email: "",
phoneNumber: "",
gender: "",
idNumber: "",
username: "",
password: "",
tosAccepted: false,
reasonForJoining: ""
});

const handleInputChange = (e:any) => {
const { name, value, type, checked } = e.target;
console.log(value)
setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
});
};

const handleFileChange = (e:any) => {
const { name, files } = e.target;

setFormData({
    ...formData,
    [name]: files[0],
});
};

const handleSubmit = (e:any) => {
e.preventDefault();
console.log("Form Data:", formData);
axios.post(`${process.env.NEXT_PUBLIC_SERVER}/clients`,formData,{withCredentials:true}).then((res)=>{
    router.push("/cdashboard");
}).catch((error:any)=>{
    console.error(error)
})
// Add your submission logic here
};

return (
<div className="min-h-screen flex items-center justify-center bg-[#022834]">
    <div className="bg-[#1F7A9C] p-8 rounded-lg shadow-lg w-full max-w-lg">
    <h1 className="text-3xl font-bold text-[#FFFFFF] text-center mb-6">Client Sign Up</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
    <div>
        {/* First Name */}
            <label htmlFor="fullName" className="block text-sm font-medium text-[#FFFFFF]">
                First Name
            </label>
            <input
                type="text"
                id="fullName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
                required
            />
            </div>
            {/* Last Name */}
            <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#FFFFFF]">
                Last Name
            </label>
            <input
                type="text"
                id="fullName"
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

        {/* Phone  */}
        <div>
        <label htmlFor="phonenumber" className="block text-sm font-medium text-[#FFFFFF]">
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

        {/* Reason For Joining */}
        <div>
        <label htmlFor="reasonForJoining" className="block text-sm font-medium text-[#FFFFFF]">
            What is your reason for joining?
        </label>
        <select
            id="reasonForJoining"
            name="reasonForJoining"
            value={formData.reasonForJoining}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
            required
        >
            <option value="General Health">General Health</option>
            <option value="weightGain">Weight Gain</option>
            <option value="weightLoss">Weight Loss</option>
            <option value="HobbyOrForFun"> For a Hobby or for Fun</option>
        </select>
        </div>
        
        {/* IdNumber */}
        <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-[#FFFFFF]">
            Please enter a State or Drivers Liscense Number
        </label>
        <input
            type="text"
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
            required
        />
        </div>
        <div></div>

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
        <div>
        <label className="block text-sm font-medium text-[#FFFFFF]">
            Terms of Service
        </label>
        
        </div>
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
        <label htmlFor="termsAccepted" className="text-sm text-[#FFFFFF]">
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

export default ClientSignUp;

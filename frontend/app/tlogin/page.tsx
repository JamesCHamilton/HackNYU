"use client"; 

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const LoginPage = () => {
const router = useRouter();

// State for dynamic data (e.g., theme or other variables)
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
// Ensure this runs only on the client side
setHydrated(true);
}, []);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();

// Get form data using FormData API
const formData = new FormData(e.currentTarget);
const username = formData.get("username") as string;
const password = formData.get("password") as string;

// Log the form data (replace this with your login logic)
console.log("Username:", username);
console.log("Password:", password);
axios.put(`${process.env.NEXT_PUBLIC_SERVER}/trainers`,{username,password},{withCredentials:true}).then((res)=>{
    router.push("/tdashboard");
}).catch((error:any)=>{
    console.error(error)
})
// Example: Redirect to dashboard after login

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
            className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
            required
        />
        </div>
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
            className="mt-1 block w-full px-3 py-2 bg-[#FFFFFF] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BF0F7] focus:border-[#BF0F7]"
            required
        />
        </div>
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

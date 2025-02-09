import { Button } from "../componenets/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../componenets/dropdowns";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-[#022B3A] text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#1F7A8C]">
        <Image
          src="/companyLogo.png" // Replace with your company logo
          alt="Equilibrium Academy Logo"
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
          
        </ul>

        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#BFDBF7] text-[#022B3A] px-4 py-2 rounded">
                Login
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#E1E5F2]">
              <DropdownMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-[#022B3A]">
                      Member
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#FFFFFF]">
                    <DropdownMenuItem>Login</DropdownMenuItem>
                    <DropdownMenuItem>Signup</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-[#022B3A]">
                      Trainer
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#FFFFFF]">
                    <DropdownMenuItem>Login</DropdownMenuItem>
                    <DropdownMenuItem>Signup</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* About Section */}
      <div
        id="about"
        className="relative min-h-screen text-secondary flex justify-center items-center"
      >
        <div className="justify-center items-center flex flex-col gap-12 p-12">
          <h1 className="text-5xl font-bold max-md:text-4xl text-[#BFDBF7]">
            About Us
          </h1>

          {/* Who We Are Section */}
          <div className="max-w-3xl text-center">
            <h2 className="text-3xl font-semibold mb-6 text-[#BFDBF7]">
              Who We Are
            </h2>
            <p className="text-xl font-medium text-[#E1E5F2]">
              At <span className="font-bold text-[#BFDBF7]">Equilibrium Academy</span>, we are a team of dedicated fitness and wellness professionals committed to helping individuals achieve balance in both body and mind. Our programs are designed to promote physical fitness while fostering mental relaxation, ensuring our clients reach their fullest potential in a holistic way.
            </p>
          </div>

          {/* Our Team Section */}
          <div className="max-w-3xl text-center mt-12">
            <h2 className="text-3xl font-semibold mb-6 text-[#BFDBF7]">
              Our Team
            </h2>
            <p className="text-xl font-medium text-[#E1E5F2]">
              Our team consists of certified fitness trainers, yoga instructors, nutritionists, and wellness coaches who bring their expertise together to create personalized programs for every individual. We believe in a comprehensive approach that nurtures both physical strength and inner peace.
            </p>
          </div>

          {/* Our Values Section */}
          <div className="max-w-3xl text-center mt-12">
            <h2 className="text-3xl font-semibold mb-6 text-[#BFDBF7]">
              Our Values
            </h2>
            <ul className="text-lg text-[#E1E5F2] list-disc list-inside">
              <li className="mb-3">
                <span className="font-semibold text-[#BFDBF7]">Balance:</span> We believe true wellness comes from harmonizing physical fitness with mental relaxation.
              </li>
              <li className="mb-3">
                <span className="font-semibold text-[#BFDBF7]">Commitment:</span> We are dedicated to supporting our clients on their wellness journey every step of the way.
              </li>
              <li className="mb-3">
                <span className="font-semibold text-[#BFDBF7]">Community:</span> We foster a supportive environment where individuals can grow, connect, and thrive together.
              </li>
              <li className="mb-3">
                <span className="font-semibold text-[#BFDBF7]">Holistic Wellness:</span> Our approach integrates fitness, nutrition, mindfulness, and recovery for overall well-being.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

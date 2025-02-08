import Image from "next/image";
import Link from "next/link";
import { Button } from "./componenets/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./componenets/dropdowns";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1D1D1D] text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#B91C1C]">
        <Image
          src="/company-logo.png" // Replace with your company logo
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
        </ul>

        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#E11D48] text-[#1D1D1D] px-4 py-2 rounded">
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

      {/* Hero Section */}
      <header id="home" className="flex flex-col items-center justify-center text-center py-20">
        <Image
          src="/company-logo.png" // Replace with your company logo
          alt="Company Logo"
          width={150}
          height={150}
          className="mb-6"
        />
        <h1 className="text-5xl font-bold mb-4 text-[#E11D48]">
          Equilibrium Academy
        </h1>
        <p className="text-xl font-medium text-[#FDE8E7]">
          Adapt into a better self {/* Replace with your slogan */}
        </p>
      </header>

      {/* Call to Action */}
      <main className="flex justify-center mt-10">
        <Button className="px-8 py-4 text-lg font-semibold" style={{ backgroundColor: "#E11D48", color: "#1D1D1D" }}>
          Get Started
        </Button>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-[#FDE8E7]">
        <p>
          © {new Date().getFullYear()} Equilibrium Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

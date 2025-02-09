import { Button } from "../componenets/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../componenets/dropdowns";
import Image from "next/image";
import Link from "next/link";

interface TestimonialProps {
  brand: string;
  comment: string;
}

function Testimonial({ brand, comment }: TestimonialProps) {
  return (
    <div className="flex flex-col gap-8 justify-center items-center text-center">
      <h1 className="text-2xl font-semibold max-md:text-xl text-[#BFDBF7]">{brand}</h1>
      <h3 className="text-lg max-md:text-sm text-[#E1E5F2]">{comment}</h3>
      <div className="flex justify-center items-center gap-2 text-[#FFD700]">
        {[...Array(5)].map((_, index) => (
          <span key={index}>&#9733;</span>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-[#022B3A] text-gray-900">
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

      {/* Testimonials Section */}
      <div
        id="testimonials"
        className="relative min-h-screen text-secondary flex justify-center items-center"
      >
        <div className="justify-center items-center flex flex-col gap-12 p-12">
          <h1 className="text-5xl font-bold max-md:text-4xl text-[#BFDBF7]">
            Testimonials
          </h1>
          <h1 className="text-3xl font-semibold max-md:text-xl text-[#E1E5F2]">
            What our students say about us
          </h1>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-24 max-md:gap-16 px-0 items-start">
            <Testimonial
              brand="Equilibrium Academy"
              comment="Equilibrium Academy has completely transformed the way I approach personal growth. The comprehensive programs and expert guidance have allowed me to achieve a better work-life balance, improving both my professional and personal life."
            />
            <Testimonial
              brand="Success Path Coaching"
              comment="Thanks to Equilibrium Academy, I've gained invaluable insights into managing stress and prioritizing my well-being. The tools provided have helped me find true balance and peace amidst a busy schedule."
            />
            <Testimonial
              brand="Mindset Masters"
              comment="Equilibrium Academy's holistic approach to personal development has been a game-changer for me. The guidance and resources have helped me unlock my full potential and live a more fulfilling, centered life."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
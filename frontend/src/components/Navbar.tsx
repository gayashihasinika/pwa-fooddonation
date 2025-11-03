import React from "react";
import { Button } from "./Button";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-[#FF5722] tracking-tight">FoodLink</h1>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#about" className="text-gray-700 hover:text-[#FF5722] transition-colors">
            About
          </a>
          <a href="#how" className="text-gray-700 hover:text-[#FF5722] transition-colors">
            How It Works
          </a>
          <a href="#contact" className="text-gray-700 hover:text-[#FF5722] transition-colors">
            Contact
          </a>
          <Button variant="warning">Get Started</Button>
        </div>
      </div>
    </nav>
  );
};

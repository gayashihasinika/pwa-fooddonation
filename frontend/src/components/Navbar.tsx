import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">FoodDonation</h1>
        <div className="space-x-4">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          <a href="#login" className="text-gray-600 hover:text-gray-900">Login</a>
        </div>
      </div>
    </nav>
  );
}

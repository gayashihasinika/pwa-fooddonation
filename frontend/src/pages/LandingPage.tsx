// frontend/src/pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { HiMenu, HiX } from "react-icons/hi";
import { type Variants } from "framer-motion";
// Hero images
import heroFood1 from "../assets/images/hero/food1.jpg";
import heroFood2 from "../assets/images/hero/food2.jpg";
import heroFood3 from "../assets/images/hero/food3.jpg";
import heroFood4 from "../assets/images/hero/food4.jpg";

// Impact images
import impact1 from "../assets/images/impact/impact1.jpeg";
import impact2 from "../assets/images/impact/impact2.jpg";
import impact3 from "../assets/images/impact/impact3.jpeg";
import impact4 from "../assets/images/impact/impact4.jpg";

// Footer images
import footer1 from "../assets/images/footer/footer1.jpg";
import footer2 from "../assets/images/footer/footer2.jpg";
import footer3 from "../assets/images/footer/footer3.jpg";


type Language = "en" | "si" | "ta";

type ImageCardProps = {
  src: string;
  alt: string;
};

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="overflow-hidden rounded-3xl shadow-2xl"
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </motion.div>
);

export default function LandingPage() {
  const { t, language, changeLanguage } = useLang();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const stats = [
    { value: 3200, label: t("mealsShared") },
    { value: 17, label: t("citiesCovered") },
    { value: 850, label: t("activeDonors") },
    { value: 120, label: t("volunteers") },
  ];

  const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99], // Custom cubic bezier close to easeOutQuart
    },
  },
};

const stagger: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

  return (
    <div className="bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              🍲
            </div>
            <span className="text-3xl font-bold text-orange-800">FeedSriLanka</span>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-10">
            <a href="#how" className="text-lg text-gray-700 hover:text-orange-600 font-medium transition">How It Works</a>
            <a href="#impact" className="text-lg text-gray-700 hover:text-orange-600 font-medium transition">Our Impact</a>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition transform hover:scale-105"
            >
              Get Started
            </Link>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="border-2 border-orange-300 rounded-full px-6 py-3 bg-white text-gray-700 font-medium"
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
            </select>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-3xl">
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-2xl"
          >
            <div className="px-8 py-8 space-y-6 text-center">
              <a href="#how" onClick={() => setMenuOpen(false)} className="block text-xl text-gray-700">How It Works</a>
              <a href="#impact" onClick={() => setMenuOpen(false)} className="block text-xl text-gray-700">Our Impact</a>
              <Link to="/signup" className="block bg-orange-600 text-white py-4 rounded-full text-xl font-bold">
                Get Started
              </Link>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as Language)}
                className="w-full border-2 border-orange-300 rounded-full py-4 text-center text-lg"
              >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </motion.div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text Content */}
            <motion.div variants={fadeInUp} className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-orange-900 leading-tight">
                Share Food,<br />
                <span className="text-amber-600">Share Love</span>
              </h1>
              <p className="text-xl md:text-2xl text-orange-800 mt-6 font-medium">
                Reducing food waste • Feeding families across Sri Lanka
              </p>
              <p className="text-lg text-gray-700 mt-8 max-w-2xl mx-auto lg:mx-0">
                Join thousands of Sri Lankans donating surplus food to those in need.
                Every plate shared creates hope and brings communities together ❤️
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-3xl transition transform hover:scale-105 text-center"
                >
                  🍲 Donate Food Now
                </Link>
                <Link
                  to="/signup"
                  className="border-4 border-orange-600 text-orange-700 bg-white px-12 py-6 rounded-full text-2xl font-bold hover:bg-orange-50 transition text-center"
                >
                  🎯 Find Food Nearby
                </Link>
              </div>
            </motion.div>

            {/* Hero Image Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-2 gap-4"
            >

              <ImageCard src={heroFood1} alt="Home cooked food donation" />
              <ImageCard src={heroFood2} alt="Volunteers packing food" />
              <ImageCard src={heroFood3} alt="Food donation for families" />
              <ImageCard src={heroFood4} alt="Sharing meals with community" />

            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="bg-white rounded-3xl p-8 text-center shadow-2xl"
              >
                <div className="text-5xl font-extrabold text-orange-600">
                  <CountUp end={stat.value} duration={2.5} separator="," />
                </div>
                <p className="text-lg text-gray-700 mt-4 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 bg-orange-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-orange-900 mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: "📦", title: "Post Your Food", desc: "Share surplus home-cooked meals or groceries" },
              { icon: "🤝", title: "Connect Locally", desc: "Nearby families in need can request your donation" },
              { icon: "🍲", title: "Share the Joy", desc: "Deliver warmth and reduce food waste together" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition"
              >
                <div className="text-7xl mb-8">{step.icon}</div>
                <h3 className="text-2xl font-bold text-orange-800 mb-4">{step.title}</h3>
                <p className="text-gray-700 text-lg">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-bold text-orange-900 mb-8"
              >
                Creating Real Change, One Meal at a Time
              </motion.h2>
              <p className="text-xl text-gray-700 mb-10">
                Every donation feeds a family, reduces waste, and brings Sri Lankans together in kindness.
              </p>
              <div className="grid grid-cols-2 gap-8">

                <ImageCard src={impact1} alt="Community food sharing" />
                <ImageCard src={impact2} alt="Helping families with food" />
                <ImageCard src={impact3} alt="Reducing food waste" />
                <ImageCard src={impact4} alt="Volunteers distributing meals" />



              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-10 text-center shadow-xl">
                  <div className="text-5xl font-extrabold text-orange-700">
                    <CountUp end={stat.value} duration={2.5} separator="," />
                  </div>
                  <p className="text-xl text-gray-800 mt-4 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-extrabold mb-10"
          >
            Be the Change Sri Lanka Needs Today
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-8 justify-center"
          >
            <Link
              to="/signup"
              className="bg-white text-orange-700 px-16 py-8 rounded-full text-3xl font-bold shadow-2xl hover:shadow-3xl transition transform hover:scale-110"
            >
              🍲 Donate Food Now
            </Link>
            <Link
              to="/signup"
              className="border-4 border-white text-white px-16 py-8 rounded-full text-3xl font-bold hover:bg-white/20 transition"
            >
              🎯 Find Available Food
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-6">FeedSriLanka ❤️</h3>
          <p className="text-xl mb-12 opacity-90">
            Reducing food waste • Feeding families • Building hope across Sri Lanka
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

            <ImageCard src={footer1} alt="Sri Lankan food culture" />
            <ImageCard src={footer2} alt="Community kitchen" />
            <ImageCard src={footer3} alt="Sharing food with care" />



          </div>
          <p className="text-sm opacity-75">© 2025 FeedSriLanka. Made with ❤️ in Sri Lanka</p>
        </div>
      </footer>
    </div>
  );
}
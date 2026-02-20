// frontend/src/pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { HiMenu, HiX } from "react-icons/hi";

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

  return (
    <div className="bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl">
              🍲
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-orange-800">
              FeedSriLanka
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#how" className="text-lg text-gray-700 hover:text-orange-600 font-medium transition">
              {t("howTitle")}
            </a>
            <a href="#impact" className="text-lg text-gray-700 hover:text-orange-600 font-medium transition">
              {t("impactTitle")}
            </a>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition"
            >
              {t("signUp")}
            </Link>

            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="border-2 border-orange-300 rounded-full px-4 py-2 bg-white text-gray-700"
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
            </select>
          </nav>

          {/* Mobile Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-3xl">
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white shadow-xl">
            <div className="px-6 py-6 space-y-5 text-center">
              <a href="#how" onClick={() => setMenuOpen(false)} className="block text-lg">
                {t("howTitle")}
              </a>
              <a href="#impact" onClick={() => setMenuOpen(false)} className="block text-lg">
                {t("impactTitle")}
              </a>
              <Link to="/signup" className="block bg-orange-600 text-white py-3 rounded-full font-bold">
                {t("signUp")}
              </Link>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as Language)}
                className="w-full border-2 border-orange-300 rounded-full py-3 text-center"
              >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-orange-900 leading-tight">
              {t("heroTitle")}
            </h1>

            <p className="text-lg sm:text-xl text-orange-800 mt-6 font-medium">
              {t("heroSubtitle")}
            </p>

            <p className="text-base sm:text-lg text-gray-700 mt-6 max-w-xl mx-auto lg:mx-0">
              {t("heroDescription")}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-8 py-4 rounded-full text-lg sm:text-xl font-bold shadow-xl hover:scale-105 transition text-center"
              >
                {t("startDonating")}
              </Link>

              <Link
                to="/signup"
                className="border-2 border-orange-600 text-orange-700 bg-white px-8 py-4 rounded-full text-lg sm:text-xl font-bold hover:bg-orange-50 transition text-center"
              >
                {t("nearbyDonation")}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImageCard src={heroFood1} alt="food1" />
            <ImageCard src={heroFood2} alt="food2" />
            <ImageCard src={heroFood3} alt="food3" />
            <ImageCard src={heroFood4} alt="food4" />
          </div>
        </div>

        {/* STATS */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl p-6 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-orange-600">
                <CountUp end={stat.value} duration={2.5} separator="," />
              </div>
              <p className="text-sm sm:text-base text-gray-700 mt-3 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 bg-orange-100 px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-900 mb-12">
          {t("howTitle")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: "📦", title: t("postStep"), desc: t("postStepDesc") },
            { icon: "🤝", title: t("connectStep"), desc: t("connectStepDesc") },
            { icon: "🍲", title: t("shareStep"), desc: t("shareStepDesc") },
          ].map((step, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-6xl mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold text-orange-800 mb-3">{step.title}</h3>
              <p className="text-gray-700">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-900 mb-6">
              {t("impactTitle")}
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              {t("impactSubtitle")}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <ImageCard src={impact1} alt="impact1" />
              <ImageCard src={impact2} alt="impact2" />
              <ImageCard src={impact3} alt="impact3" />
              <ImageCard src={impact4} alt="impact4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-8 text-center shadow-xl">
                <div className="text-3xl sm:text-4xl font-extrabold text-orange-700">
                  <CountUp end={stat.value} duration={2.5} separator="," />
                </div>
                <p className="mt-3 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center px-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-8">
          {t("ctaReady")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/signup"
            className="bg-white text-orange-700 px-10 py-4 rounded-full text-lg sm:text-xl font-bold shadow-xl hover:scale-105 transition"
          >
            {t("startDonating")}
          </Link>
          <Link
            to="/signup"
            className="border-2 border-white px-10 py-4 rounded-full text-lg sm:text-xl font-bold hover:bg-white/20 transition"
          >
            {t("signUp")}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-orange-900 text-white py-14 px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">FeedSriLanka ❤️</h3>
        <p className="mb-8 opacity-90">
          {t("heroSubtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
          <ImageCard src={footer1} alt="footer1" />
          <ImageCard src={footer2} alt="footer2" />
          <ImageCard src={footer3} alt="footer3" />
        </div>

        <p className="text-sm opacity-75">
          © 2025 FeedSriLanka. {t("rightsReserved")}
        </p>
      </footer>
    </div>
  );
}

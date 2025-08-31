import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { HeroText } from "../components/HeroText";
import CountUp from "react-countup";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


export default function HomeWireframe() {
  const [heroText, setHeroText] = useState("Loading...");
  const [menuOpen, setMenuOpen] = useState(false);
  const [donationProgress, setDonationProgress] = useState(68);

  useEffect(() => {
    setTimeout(
      () =>
        setHeroText(
          "Help Feed Sri Lanka – Donate Food, Receive Support, Volunteer Today!"
        ),
      500
    );
  }, []);

  const handleStartClick = () => {
    setDonationProgress((p) => Math.min(100, p + 5));
  };

  const stats = [
    { value: 3200, label: "Meals Shared" },
    { value: 17, label: "Cities Covered" },
    { value: 850, label: "Active Donors" },
    { value: 120, label: "Volunteers" },
  ];

  // Framer Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-emerald-50 via-white to-emerald-100 min-h-screen relative overflow-hidden">

      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-extrabold text-emerald-600"
          >
            FeedSriLanka
          </motion.div>
          <div className="hidden md:flex items-center gap-4">
            <motion.select
              whileHover={{ scale: 1.05 }}
              className="border rounded-lg px-3 py-1 text-sm border-gray-300 hover:border-emerald-500 focus:ring focus:ring-emerald-200 transition"
            >
              <option>EN</option>
              <option>SI</option>
              <option>TA</option>
            </motion.select>
            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-emerald-600 transition">
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setMenuOpen((s) => !s)}>
              {menuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white shadow w-full absolute left-0 top-full z-40 p-4 flex flex-col gap-3 rounded-b-lg"
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-emerald-600">Home</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-emerald-600">Login</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="hover:text-emerald-600">Sign Up</Link>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-40 px-4 text-center bg-gradient-to-r from-emerald-100 to-emerald-50 relative overflow-hidden">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 text-emerald-800 leading-snug"
        >
          <HeroText text={heroText} animationDelay={40} />
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl mb-8 text-gray-700"
        >
          Together, we can reduce hunger and bring smiles to every table in Sri Lanka.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={handleStartClick}
            className="px-10 py-3 rounded-full bg-rose-500 text-white font-semibold shadow-lg hover:bg-rose-600 transition"
          >
            Join the Movement
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 max-w-lg mx-auto"
        >
          <ProgressBar progress={donationProgress} animate={true} color="#059669" />
        </motion.div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-emerald-800">Who Can Use the App</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {["Donors", "Receivers", "Volunteers"].map((role, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="p-8 bg-white border border-emerald-100 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="text-7xl mb-4">
                  {role === "Donors" ? "👤" : role === "Receivers" ? "🎯" : "🙋"}
                </div>
                <h3 className="font-semibold text-lg text-emerald-700 mb-2">{role}</h3>
                <p className="text-gray-600">
                  {role === "Donors"
                    ? "Share excess food safely."
                    : role === "Receivers"
                    ? "Receive meals easily."
                    : "Volunteer locally."}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-emerald-50 text-center">
        <h2 className="text-3xl font-bold mb-12 text-emerald-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: "📦", title: "Post or Find Donations", desc: "Donors post meals, receivers find them." },
            { icon: "🔗", title: "Connect Safely", desc: "Verified users ensure trust." },
            { icon: "🍲", title: "Share or Receive Food", desc: "Meals reach those in need." },
          ].map((item, idx) => (
            <Card key={idx} className="p-8 bg-white border border-emerald-100 rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg text-emerald-700 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Gamification Preview Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-emerald-800">Gamification Preview</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Leaderboard", desc: "Top Donors 🏆" },
            { title: "Badges", desc: "Recent Earners 🥇" },
            { title: "Challenges", desc: "Active Drives 🔥" },
          ].map((item, idx) => (
            <Card key={idx} className="p-8 bg-white border border-emerald-100 rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <h3 className="font-semibold text-lg text-emerald-700 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 bg-emerald-50 text-center">
        <h2 className="text-3xl font-bold mb-12 text-emerald-800">Real Impact</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-8 bg-white border border-emerald-100 rounded-3xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
              <h3 className="text-3xl font-bold mb-2 text-rose-500">
                <CountUp end={stat.value} duration={2} separator="," />
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-100 to-emerald-50 py-8 text-center mt-20 text-gray-700">
        <p className="font-medium">Contact: info@feedsrilanka.org | Hotline: 011-XXXXXXX</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-emerald-600 transition">Facebook</a>
          <a href="#" className="hover:text-emerald-600 transition">Twitter</a>
          <a href="#" className="hover:text-emerald-600 transition">Instagram</a>
        </div>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <Link to="#" className="hover:text-emerald-600 transition">About</Link>
          <Link to="#" className="hover:text-emerald-600 transition">Privacy Policy</Link>
          <Link to="#" className="hover:text-emerald-600 transition">Volunteer</Link>
        </div>
      </footer>
    </div>
  );
}

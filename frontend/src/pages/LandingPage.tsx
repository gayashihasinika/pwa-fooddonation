// src/pages/LandingPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { HiMenu, HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { Button } from "../components/Button";

type Language = "en" | "si" | "ta";

export default function LandingPage() {
  const { t, language, changeLanguage } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  // Removed unused states: heroText & donationProgress
  // Removed handleStartClick if not used

  useEffect(() => {
    // Optional: You can keep this if you want a loading effect later
    // But it's not needed now
  }, []);

  const stats = [
    { value: 3200, label: t("mealsShared") },
    { value: 17, label: t("citiesCovered") },
    { value: 850, label: t("activeDonors") },
    { value: 120, label: t("volunteers") },
  ];

  const featureCards = [
    { title: t("leaderboard"), desc: t("leaderboardDesc"), icon: "🏆" },
    { title: t("badges"), desc: t("badgesDesc"), icon: "🥇" },
    { title: t("challenges"), desc: t("challengesDesc"), icon: "🔥" },
  ];

  const foodItems = ["🍎", "🍞", "🍛", "🍲", "🥗", "🍕", "🍌", "🍚", "🍪", "🍇"];
  const [visibleFoods, setVisibleFoods] = useState<
    { id: number; emoji: string; left: string; size: number }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFood = {
        id: Date.now(),
        emoji: foodItems[Math.floor(Math.random() * foodItems.length)],
        left: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 1,
      };
      setVisibleFoods((prev) => [...prev.slice(-10), newFood]);
      setTimeout(() => {
        setVisibleFoods((prev) => prev.filter((f) => f.id !== newFood.id));
      }, 8000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.12 },
    },
  };

  function handleStartClick(_event: React.MouseEvent<HTMLButtonElement>): void {
    // Handle start click - navigate to signup or donation page
  }

  return (
    <div className="font-sans text-gray-900 bg-white relative min-h-screen overflow-x-hidden">
      {/* Decorative gradient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute -left-40 -top-40 w-[1200px] h-[800px] rounded-full blur-3xl opacity-30"
          style={{
            background: "radial-gradient(closest-side,#ff7a59, #ff5774 35%, #8b5cf6 70%, transparent 80%)",
            transform: "rotate(10deg)",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-40 bottom-0 w-[900px] h-[700px] rounded-full blur-3xl opacity-25"
          style={{
            background: "radial-gradient(closest-side,#60a5fa, #7c3aed 40%, #fb7185 70%, transparent 80%)",
            transform: "rotate(-10deg)",
          }}
        />
      </div>

      {/* Falling food animation */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
        {visibleFoods.map((food) => (
          <motion.div
            key={food.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: "100vh", opacity: [1, 0.9, 0.7, 0], rotate: [0, 30, -30, 0] }}
            transition={{ duration: 8 + Math.random() * 4, ease: "easeInOut" }}
            className="absolute"
            style={{ left: food.left, fontSize: `${food.size}rem` }}
          >
            {food.emoji}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 shadow-lg flex items-center justify-center text-white font-bold text-sm">
              FS
            </div>
            <span className="text-lg md:text-xl font-semibold">FeedSriLanka</span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-700 hover:text-gray-900">{t("featuresTitle")}</a>
            <a href="#how" className="text-sm text-gray-700 hover:text-gray-900">{t("howTitle")}</a>
            <a href="#impact" className="text-sm text-gray-700 hover:text-gray-900">{t("impactTitle")}</a>
            <Link
              to="/signup"
              className="ml-4 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold text-sm shadow-md hover:shadow-lg"
            >
              {t("signUp")}
            </Link>

            {/* Language Selector - FIXED TYPE ERROR */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="ml-4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
            </select>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-4"
          >
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setMenuOpen(false)} className="py-2">{t("featuresTitle")}</a>
              <a href="#how" onClick={() => setMenuOpen(false)} className="py-2">{t("howTitle")}</a>
              <a href="#impact" onClick={() => setMenuOpen(false)} className="py-2">{t("impactTitle")}</a>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="py-3 text-center bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full">
                {t("signUp")}
              </Link>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value as Language)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </motion.div>
        )}
      </header>

      <main className="pt-24">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: text */}
              <div className="lg:col-span-7 py-20 lg:py-32">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                >
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400">
                    {t("heroTitle")}
                  </span>
                  <span className="ml-2 text-gray-700 font-medium text-lg">—</span>
                  <span className="block text-gray-700 text-lg md:text-xl font-medium">
                    {t("heroSubtitle")}
                  </span>

                </motion.h1>

                <motion.p
                  className="mt-6 text-gray-600 max-w-2xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t("heroDescription")}
                </motion.p>

                <motion.div className="mt-8 flex flex-wrap gap-4 items-center">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >

                  </motion.div>
                </motion.div>

                {/* Small stats */}
                <motion.div
                  className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  {stats.map((s) => (
                    <motion.div
                      key={s.label}
                      className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-center shadow-sm"
                      variants={fadeInUp}
                    >
                      <div className="text-2xl font-bold text-rose-500">
                        <CountUp end={s.value} duration={1.6} separator="," />
                      </div>
                      <div className="text-sm text-gray-700">{s.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right: visual / floating cards */}
              <div className="lg:col-span-5 relative px-4 py-12">
                {/* animated blobs (framer-motion) */}
                <motion.div
                  animate={{ y: [0, -18, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 w-56 h-56 rounded-full blur-2xl opacity-70"
                  style={{ background: "linear-gradient(135deg,#ff7a59,#ff5774)" }}
                />
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.6 }}
                  className="absolute -bottom-10 left-4 w-72 h-72 rounded-full blur-3xl opacity-60"
                  style={{ background: "linear-gradient(135deg,#60a5fa,#7c3aed)" }}
                />

                {/* mock phone / card stack (visual) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="relative mx-auto max-w-xs"
                >
                  <div className="rounded-2xl p-4 bg-white shadow-2xl border border-white/30">
                    <div className="h-52 w-full rounded-lg bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center text-gray-700">
                      <div className="text-center px-6">
                        <div className="text-sm font-semibold text-rose-500 mb-2">{t("nearbyDonation")}</div>
                        <div className="text-base font-bold">{t("sampleMealTitle")}</div>
                        <div className="text-xs text-gray-500 mt-2">{t("samplePickupInfo")}</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="text-center text-xs">{t("safePickup")}</div>
                      <div className="text-center text-xs">{t("verified")}</div>
                      <div className="text-center text-xs">{t("volunteerLabel")}</div>
                    </div>
                  </div>

                  {/* floating mini cards */}
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -right-8 -top-6 w-36 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 shadow"
                  >
                    <div className="text-sm font-semibold text-emerald-700">{t("topDonor")}</div>
                    <div className="text-xs text-gray-600 mt-1">{t("sampleDonorInfo")}</div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="absolute -left-6 -bottom-6 w-36 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 shadow"
                  >
                    <div className="text-sm font-semibold text-rose-500">{t("drive")}</div>
                    <div className="text-xs text-gray-600 mt-1">{t("areaColombo")}</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES / WHO CAN USE */}
        <section id="features" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-sm font-semibold text-rose-500">{t("featuresTitle")}</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{t("featuresDesc")}</h2>

            <motion.div
              className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {[
                {
                  title: t("donorsTitle"),
                  desc: t("donorsDesc"),
                  icon: "🍱",
                },
                {
                  title: t("receiversTitle"),
                  desc: t("receiversDesc"),
                  icon: "🎯",
                },
                {
                  title: t("volunteersTitle"),
                  desc: t("volunteersDesc"),
                  icon: "🙋‍♂️",
                },
              ].map((it) => (
                <motion.div key={it.title} variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-md border border-white/30">
                  <div className="text-3xl mb-4">{it.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900">{it.title}</h4>
                  <p className="mt-2 text-gray-600 text-sm">{it.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-sm font-semibold text-rose-500">{t("howTitle")}</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{t("howStepsTitle")}</h2>

            <motion.div
              className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {[
                { title: t("postStep"), desc: t("postStepDesc"), icon: "📦" },
                { title: t("connectStep"), desc: t("connectStepDesc"), icon: "🔗" },
                { title: t("shareStep"), desc: t("shareStepDesc"), icon: "🍲" },
              ].map((it) => (
                <motion.div key={it.title} variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-md border border-white/30">
                  <div className="text-3xl mb-4">{it.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900">{it.title}</h4>
                  <p className="mt-2 text-gray-600 text-sm">{it.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* GAMIFICATION / PREVIEW */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-sm font-semibold text-rose-500">{t("engageTitle")}</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{t("leaderboard")}, {t("badges")} & {t("challenges")}</h2>

            <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3">
              {featureCards.map((it) => (
                <div
                  key={it.title}
                  className="bg-white rounded-2xl p-6 shadow-md border border-white/30"
                >
                  <div className="text-3xl mb-4">{it.icon}</div>
                  <h4 className="text-lg font-semibold text-gray-900">{it.title}</h4>
                  <p className="mt-2 text-gray-600 text-sm">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section id="impact" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-sm font-semibold text-rose-500">{t("impactTitle")}</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{t("impactSubtitle")}</h2>

            <motion.div
              className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {stats.map((s) => (
                <motion.div key={s.label} variants={fadeInUp} className="bg-white rounded-2xl p-6 text-center shadow border border-white/30">
                  <div className="text-2xl md:text-3xl font-extrabold text-rose-500">
                    <CountUp end={s.value} duration={1.6} separator="," />
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
              {t("ctaReady")}
            </motion.h3>
            <motion.div className="mt-6 flex justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleStartClick} className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white font-semibold">
                {t("startDonating")}
              </Button>
              <Link to="/signup" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                {t("signUp")}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 🧾 Footer */}
        <footer className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                © {new Date().getFullYear()} FeedSriLanka — {t("rightsReserved")}
              </div>
              <div className="flex gap-4">
                <a className="text-sm text-gray-600 hover:text-gray-900" href="#">
                  {t("privacy")}
                </a>
                <a className="text-sm text-gray-600 hover:text-gray-900" href="#">
                  {t("terms")}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

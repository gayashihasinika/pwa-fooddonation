import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import CountUp from "react-countup";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeWireframe() {
  const [heroText, setHeroText] = useState("Loading...");
  const [menuOpen, setMenuOpen] = useState(false);
  const [donationProgress, setDonationProgress] = useState(68);

  useEffect(() => {
    const timer = setTimeout(
      () =>
        setHeroText(
          "Help Feed Sri Lanka — Donate Food • Receive Support • Volunteer Today"
        ),
      400
    );
    return () => clearTimeout(timer);
  }, []);

  const handleStartClick = () => {
    setDonationProgress((p) => Math.min(100, p + 7));
  };

  const stats = [
    { value: 3200, label: "Meals Shared" },
    { value: 17, label: "Cities Covered" },
    { value: 850, label: "Active Donors" },
    { value: 120, label: "Volunteers" },
  ];

  // Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    }),
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.12 },
    },
  };

  return (
    <div className="font-sans text-gray-900 bg-white relative min-h-screen overflow-x-hidden">
      {/* Decorative gradient background (page) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Large soft gradient */}
        <div
          aria-hidden
          className="absolute -left-40 -top-40 w-[1200px] h-[800px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side,#ff7a59, #ff5774 35%, #8b5cf6 70%, transparent 80%)",
            transform: "rotate(10deg)",
          }}
        />
        {/* Right soft overlay */}
        <div
          aria-hidden
          className="absolute -right-40 bottom-0 w-[900px] h-[700px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(closest-side,#60a5fa, #7c3aed 40%, #fb7185 70%, transparent 80%)",
            transform: "rotate(-10deg)",
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 shadow-lg flex items-center justify-center text-white font-bold">
                FS
              </div>
              <span className="text-lg md:text-xl font-semibold text-gray-900">
                FeedSriLanka
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm text-gray-700 hover:text-gray-900" to="#features">
                Features
              </Link>
              <Link className="text-sm text-gray-700 hover:text-gray-900" to="#how">
                How it works
              </Link>
              <Link className="text-sm text-gray-700 hover:text-gray-900" to="#impact">
                Impact
              </Link>

              <Link
                to="/signup"
                className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-label="Toggle Menu"
                className="p-2 rounded-md text-gray-800 hover:bg-gray-100"
              >
                {menuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 rounded-lg bg-white/60 backdrop-blur-md p-4 shadow-md md:hidden"
            >
              <div className="flex flex-col gap-3">
                <Link to="#features" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50">
                  Features
                </Link>
                <Link to="#how" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50">
                  How it works
                </Link>
                <Link to="#impact" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded hover:bg-gray-50">
                  Impact
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white text-center">
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </div>
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
                  <span className="block text-gray-900 mb-3">
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400">
                      Help Feed Sri Lanka
                    </span>
                    <span className="ml-2 text-gray-700 font-medium text-lg">—</span>
                  </span>
                  <span className="block text-gray-700 text-lg md:text-xl font-medium">
                    Donate meals, join community drives and volunteer locally.
                  </span>
                </motion.h1>

                <motion.p
                  className="mt-6 text-gray-600 max-w-2xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  We match surplus food from donors with neighbourhoods and nonprofits in need — safely,
                  quickly and with respect. Join donors, volunteers and receivers across Sri Lanka.
                </motion.p>

                <motion.div className="mt-8 flex flex-wrap gap-4 items-center">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      onClick={handleStartClick}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white font-semibold shadow-md"
                    >
                      Join the Movement
                    </Button>
                  </motion.div>

                  <motion.a
                    href="#how"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="inline-flex items-center text-sm text-gray-700 hover:underline ml-2"
                  >
                    How it works →
                  </motion.a>
                </motion.div>

                {/* Small stats */}
                <motion.div
                  className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  {stats.map((s, i) => (
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
                        <div className="text-sm font-semibold text-rose-500 mb-2">Nearby Donation</div>
                        <div className="text-base font-bold">Rice & Curry — 6 portions</div>
                        <div className="text-xs text-gray-500 mt-2">Pickup: Colombo 07 · 30m ago</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="text-center text-xs">Safe pickup</div>
                      <div className="text-center text-xs">Verified</div>
                      <div className="text-center text-xs">Volunteer</div>
                    </div>
                  </div>

                  {/* floating mini cards */}
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -right-8 -top-6 w-36 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 shadow"
                  >
                    <div className="text-sm font-semibold text-emerald-700">Top Donor</div>
                    <div className="text-xs text-gray-600 mt-1">S. Perera · 14 donations</div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="absolute -left-6 -bottom-6 w-36 p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 shadow"
                  >
                    <div className="text-sm font-semibold text-rose-500">Drive</div>
                    <div className="text-xs text-gray-600 mt-1">Area: Colombo North</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES / WHO CAN USE */}
        <section id="features" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-sm font-semibold text-rose-500">Who can use</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Donors, Receivers & Volunteers</h2>

            <motion.div
              className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {[
                {
                  title: "Donors",
                  desc: "Share excess food safely with local pick-up options and verification.",
                  icon: "🍱",
                },
                {
                  title: "Receivers",
                  desc: "Find nearby available meals and request safe pickup.",
                  icon: "🎯",
                },
                {
                  title: "Volunteers",
                  desc: "Join drives, help collect and distribute food in your neighbourhood.",
                  icon: "🙋‍♂️",
                },
              ].map((it, i) => (
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
            <h3 className="text-sm font-semibold text-rose-500">How it works</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Three simple steps</h2>

            <motion.div
              className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {[
                { title: "Post", desc: "Donors post meals with pickup info.", icon: "📦" },
                { title: "Connect", desc: "Receivers request and coordinate pickup.", icon: "🔗" },
                { title: "Share", desc: "Volunteers help distribution locally.", icon: "🍲" },
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
            <h3 className="text-sm font-semibold text-rose-500">Engage</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Leaderboard, Badges & Challenges</h2>

            <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3">
              {[
                { title: "Leaderboard", desc: "Top donor rankings and community goals", icon: "🏆" },
                { title: "Badges", desc: "Earn badges for consistent support", icon: "🥇" },
                { title: "Challenges", desc: "Community drives and events", icon: "🔥" },
              ].map((it) => (
                <div key={it.title} className="bg-white rounded-2xl p-6 shadow-md border border-white/30">
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
            <h3 className="text-sm font-semibold text-rose-500">Impact</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Real results, real people</h2>

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
              Ready to help your community?
            </motion.h3>
            <motion.div className="mt-6 flex justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button onClick={handleStartClick} className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white font-semibold">
                Start Donating
              </Button>
              <Link to="/signup" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                Sign Up
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">© {new Date().getFullYear()} FeedSriLanka — All rights reserved.</div>
              <div className="flex gap-4">
                <a className="text-sm text-gray-600 hover:text-gray-900" href="#">Privacy</a>
                <a className="text-sm text-gray-600 hover:text-gray-900" href="#">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

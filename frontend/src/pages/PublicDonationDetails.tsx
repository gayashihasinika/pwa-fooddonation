// src/pages/PublicDonationDetails.tsx — WITH BEAUTIFUL ANIMATIONS
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, Package, User, Clock, ArrowLeft, PlusCircle, Search, Sparkles } from "lucide-react";
import { format } from "date-fns";

const BACKEND_URL = "http://127.0.0.1:8001/api";
const STORAGE_URL = "http://127.0.0.1:8001/storage";

export default function PublicDonationDetails() {
  const { id } = useParams();
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${BACKEND_URL}/public/donations/${id}`)
      .then((res) => {
        setDonation(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("This donation is no longer available.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (donation?.images && donation.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % donation.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [donation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center"
        >
          <Sparkles className="w-20 h-20 text-orange-500 mx-auto mb-6 animate-pulse" />
          <p className="text-3xl text-orange-700 font-medium">Loading this kind donation...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6 bg-gradient-to-b from-orange-50 to-amber-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Package className="w-32 h-32 text-orange-300 mx-auto mb-8" />
          </motion.div>
          <h1 className="text-5xl font-bold text-orange-800 mb-6">
            Donation Not Available
          </h1>
          <p className="text-xl text-gray-700">
            This generous donation may have already been claimed or has expired.
          </p>
          <p className="text-lg text-orange-600 mt-6">Thank you for your kindness in checking ❤️</p>
        </motion.div>
      </div>
    );
  }

  // Stagger children animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* HEADER */}
      <header className="bg-white shadow-lg border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div whileHover={{ x: -5 }}>
              <ArrowLeft className="w-8 h-8 text-orange-600 group-hover:text-orange-800 transition" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-extrabold text-orange-800"
            >
              FeedSriLanka
            </motion.h1>
          </Link>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-orange-700 font-medium hidden md:block"
          >
            Sharing meals, spreading love ❤️
          </motion.p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Hero Image Carousel with Zoom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-3xl mb-12 border-8 border-white"
        >
          {donation.images && donation.images.length > 0 ? (
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              whileHover={{ scale: 1.05 }}
              src={`${STORAGE_URL}/${donation.images[currentImageIndex].image_path}`}
              alt={donation.title}
              className="w-full h-96 md:h-[600px] object-cover cursor-zoom-in"
            />
          ) : (
            <div className="w-full h-96 md:h-[600px] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <Package className="w-40 h-40 text-orange-400" />
              </motion.div>
            </div>
          )}

          {donation.images && donation.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {donation.images.map((_: any, idx: number) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-3 h-3 rounded-full transition ${
                    idx === currentImageIndex ? "bg-white w-10 shadow-lg" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-8 text-white"
          >
            <motion.h1
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-4xl md:text-6xl font-extrabold mb-4"
            >
              A Kind Donation Ready to Help ❤️
            </motion.h1>
            <p className="text-2xl md:text-3xl opacity-90">{donation.title}</p>
          </motion.div>
        </motion.div>

        {/* Main Card with Staggered Animation */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white rounded-3xl shadow-3xl p-8 md:p-12 border-8 border-white"
        >
          {donation.description && (
            <motion.p
              variants={item}
              className="text-xl md:text-2xl text-gray-700 italic mb-12 text-center leading-relaxed"
            >
              "{donation.description}"
            </motion.p>
          )}

          <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-8">
              <motion.div variants={item} className="flex items-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="p-4 bg-red-100 rounded-2xl"
                >
                  <Heart className="w-12 h-12 text-red-600" />
                </motion.div>
                <div>
                  <p className="text-gray-600 font-medium">Servings Available</p>
                  <p className="text-4xl font-extrabold text-red-600">{donation.quantity}</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-center gap-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="p-4 bg-orange-100 rounded-2xl"
                >
                  <Calendar className="w-12 h-12 text-orange-600" />
                </motion.div>
                <div>
                  <p className="text-gray-600 font-medium">Best Before</p>
                  <p className="text-3xl font-bold text-orange-800">
                    {donation.expiry_date ? format(new Date(donation.expiry_date), "dd MMMM yyyy") : "Soon"}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div variants={item} className="flex items-start gap-6">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="p-4 bg-amber-100 rounded-2xl"
                >
                  <MapPin className="w-12 h-12 text-amber-600" />
                </motion.div>
                <div>
                  <p className="text-gray-600 font-medium">Pickup Location</p>
                  <p className="text-xl font-bold text-amber-800">{donation.pickup_address}</p>
                </div>
              </motion.div>

              {donation.preferred_pickup_time && (
                <motion.div variants={item} className="flex items-center gap-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="p-4 bg-yellow-100 rounded-2xl"
                  >
                    <Clock className="w-12 h-12 text-yellow-600" />
                  </motion.div>
                  <div>
                    <p className="text-gray-600 font-medium">Preferred Time</p>
                    <p className="text-xl font-bold text-yellow-800">{donation.preferred_pickup_time}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-3xl p-10 text-center border-4 border-orange-200"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
            >
              <User className="w-20 h-20 text-orange-600 mx-auto mb-6" />
            </motion.div>
            <p className="text-3xl font-bold text-orange-800 mb-4">
              Thank You {donation.donor?.name || "Kind Donor"} ❤️
            </p>
            <p className="text-xl text-orange-700">
              Your generosity will bring warmth and joy to a family in need
            </p>
          </motion.div>

          {/* ENCOURAGING ACTION BUTTONS WITH PULSE */}
          <motion.div variants={item} className="mt-16 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 rounded-3xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4 transition"
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Heart className="w-8 h-8" />
                  </motion.div>
                  I Want to Claim This Donation
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="block bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-6 rounded-3xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4 transition"
                >
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <PlusCircle className="w-8 h-8" />
                  </motion.div>
                  Post My Own Donation
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/donations"
                  className="block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-3xl font-bold text-xl shadow-2xl flex items-center justify-center gap-4 transition"
                >
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                    <Search className="w-8 h-8" />
                  </motion.div>
                  Browse More Donations
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="text-center mt-16"
          >
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-3xl font-bold text-green-700 mb-6"
            >
              This meal was shared with love
            </motion.p>
            <p className="text-2xl text-gray-700">
              Together, we're reducing waste and feeding Sri Lanka 🙏
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* TEXT-ONLY FOOTER WITH SPARKLE */}
      <footer className="bg-orange-800 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h3
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            FeedSriLanka ❤️
          </motion.h3>
          <p className="text-2xl md:text-3xl mb-8 opacity-90">
            Every donation becomes a warm meal for someone
          </p>
          <p className="text-xl md:text-2xl mb-12 opacity-80">
            Thank you for helping share abundance across our beautiful island
          </p>
          <motion.div
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-6xl md:text-8xl inline-block"
          >
            🍲 🙏 ✨
          </motion.div>
          <p className="text-lg mt-8 opacity-70">
            © 2025 FeedSriLanka — Connecting hearts through food
          </p>
        </div>
      </footer>
    </div>
  );
}
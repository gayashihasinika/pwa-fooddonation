import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import Confetti from "react-confetti";
import {
  Heart,
  MapPin,
  Package,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";

/* =======================
   Types
======================= */

interface DonationImage {
  id: number;
  image_path: string;
}

interface Donation {
  id: number;
  title: string;
  description: string | null;
  quantity: number;
  pickup_address: string;
  expiry_date: string | null;
  preferred_pickup_time?: string;
  images: DonationImage[];
  status: string;
}

/* =======================
   Component
======================= */

export default function ViewAvailableDonation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  /* =======================
     Fetch Donation
  ======================= */

  useEffect(() => {
    api
      .get(`/receivers/donations/${id}`)
      .then((res) => {
        setDonation(res.data.donation);
        setAlreadyClaimed(res.data.already_claimed);
        setClaimStatus(res.data.claim_status);
      })
      .catch(() => toast.error("Failed to load donation"))
      .finally(() => setLoading(false));
  }, [id]);

  /* =======================
     Countdown Timer
  ======================= */

  useEffect(() => {
    if (!donation?.expiry_date) {
      setTimeLeft("No expiry");
      return;
    }

    const update = () => {
      const diff =
        new Date(donation.expiry_date!).getTime() - new Date().getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      if (d > 0) setTimeLeft(`${d} day${d > 1 ? "s" : ""} left`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m left`);
      else setTimeLeft(`${m} minutes left`);
    };

    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, [donation]);

  /* =======================
     Claim Donation
  ======================= */

  const claimDonation = async () => {
    try {
      await api.post(`/receivers/donations/${id}/claim`);
      setShowConfetti(true);
      setShowThankYouModal(true);
      setTimeout(() => setShowConfetti(false), 7000);
      toast.success("Donation claimed successfully ❤️");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Claim failed");
    }
  };

  /* =======================
     Loading
  ======================= */

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl text-orange-600">Loading kindness...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!donation) return null;

  /* =======================
     UI
  ======================= */

  return (
    <AuthenticatedLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 px-4 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-orange-700 font-semibold mb-8"
          >
            <ArrowLeft /> Back
          </button>

          {/* Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl mb-10">
            {donation.images.length ? (
              <img
                src={`http://127.0.0.1:8001/storage/${donation.images[0].image_path}`}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-orange-100">
                <Package className="w-24 h-24 text-orange-400" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-orange-800 mb-6">
            {donation.title}
          </h1>

          {/* Description */}
          {donation.description && (
            <p className="text-center italic text-gray-700 text-xl mb-10">
              “{donation.description}”
            </p>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <InfoCard icon={<Heart />} label="Servings" value={donation.quantity} />
            <InfoCard icon={<MapPin />} label="Pickup" value={donation.pickup_address} />
            <InfoCard icon={<Calendar />} label="Expiry" value={donation.expiry_date ? new Date(donation.expiry_date).toLocaleDateString() : "No expiry"} />
            <InfoCard icon={<Clock />} label="Time Left" value={timeLeft} />
          </div>

          {/* Action */}
          <div className="text-center">
            {alreadyClaimed ? (
              <div className="inline-block bg-gray-100 px-8 py-4 rounded-xl text-xl font-semibold">
                Already claimed ({claimStatus})
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-6 rounded-full text-2xl font-bold"
              >
                Accept Donation ❤️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <Modal
            title="Accept this donation?"
            onCancel={() => setShowConfirmModal(false)}
            onConfirm={() => {
              setShowConfirmModal(false);
              claimDonation();
            }}
          />
        )}
      </AnimatePresence>

      {/* Thank You */}
      <AnimatePresence>
        {showThankYouModal && (
          <ThankYouModal onClose={() => navigate("/receivers/accepted-donations")} />
        )}
      </AnimatePresence>
    </AuthenticatedLayout>
  );
}

/* =======================
   Reusable Components
======================= */

function InfoCard({ icon, label, value }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
      <div className="text-orange-600 flex justify-center mb-3">{icon}</div>
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-orange-800">{value}</p>
    </div>
  );
}

function Modal({ title, onCancel, onConfirm }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="flex gap-4 justify-center">
          <button onClick={onCancel} className="px-6 py-3 bg-gray-200 rounded-xl">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-3 bg-orange-600 text-white rounded-xl">
            Confirm ❤️
          </button>
        </div>
      </div>
    </div>
  );
}

function ThankYouModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
        <p className="mb-6">Your donation is now reserved.</p>
        <button onClick={onClose} className="bg-green-600 text-white px-6 py-3 rounded-xl">
          View My Claims
        </button>
      </div>
    </div>
  );
}

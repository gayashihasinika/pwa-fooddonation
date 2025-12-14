// src/pages/Receivers/Donations/ViewAvailableDonation.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function ViewAvailableDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);


  // Fetch donation
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

  // Countdown for expiry
  useEffect(() => {
    if (!donation?.expiry_date) return;

    const updateCountdown = () => {
      const expiry = new Date(donation.expiry_date).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [donation]);

  // Confirm dialog before claiming
  const handleClaim = () => {
    if (!window.confirm("Are you sure you want to claim this donation?")) return;
    claimDonation();
  };

  const claimDonation = async () => {
    try {
      await api.post(`/receivers/donations/${id}/claim`);
      toast.success("Donation claimed successfully!");
      navigate("/receivers/claims");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Claim failed");
    }
  };

  if (loading)
    return (
      <AuthenticatedLayout>
        <div className="p-10 text-center text-gray-500">Loading donation...</div>
      </AuthenticatedLayout>
    );

  if (!donation) return null;

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* IMAGE CAROUSEL */}
          {donation.images?.length > 0 ? (
            <Carousel showThumbs={false} showStatus={false} infiniteLoop>
              {donation.images.map((img: any) => (
                <img
                  key={img.id}
                  src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                  alt={donation.title}
                  className="h-[360px] w-full object-cover"
                />
              ))}
            </Carousel>
          ) : (
            <div className="h-[360px] bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
              No images available
            </div>
          )}

          {/* CONTENT */}
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-rose-600">{donation.title}</h1>

            <p className="mt-4 text-gray-700 leading-relaxed">
              {donation.description || "No description provided."}
            </p>

            {/* DETAILS */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">Quantity</p>
                <p className="font-semibold text-gray-800">{donation.quantity}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500">Pickup Address</p>
                <p className="font-semibold text-gray-800">{donation.pickup_address}</p>
              </div>

              {donation.expiry_date && (
                <div className="bg-red-50 p-4 rounded-xl relative">
                  <p className="text-red-500">Expiry Date</p>
                  <p className="font-semibold text-red-700">
                    {new Date(donation.expiry_date).toLocaleDateString()}
                  </p>
                  {/* Countdown badge */}
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">
                    {timeLeft}
                  </span>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-blue-500">Status</p>
                <p className="font-semibold text-blue-700 uppercase">{donation.status}</p>
              </div>
            </div>

            {/* CLAIM BUTTON */}
            {alreadyClaimed ? (
              <div className="mt-10 w-full bg-gray-200 text-gray-600 py-4 rounded-2xl 
                  font-bold text-lg text-center">
                Already claimed ({claimStatus})
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClaim}
                className="mt-10 w-full bg-gradient-to-r from-rose-600 to-orange-600 
               hover:from-rose-700 hover:to-orange-700 
               text-white py-4 rounded-2xl font-bold text-lg shadow-xl"
              >
                Claim Donation
              </motion.button>
            )}

          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}

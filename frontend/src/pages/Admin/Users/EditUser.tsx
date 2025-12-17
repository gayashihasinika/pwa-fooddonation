// src/pages/Admin/Users/EditUser.tsx — FULLY RESPONSIVE & EMOTIONAL
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Trash2,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { User } from "@/types/index";

const fetchUser = async (id: string): Promise<User> => {
  const { data } = await api.get(`/admin/users/${id}`);
  return data.user || data;
};

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [verificationNote, setVerificationNote] = useState("");
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => fetchUser(id!),
    retry: false,
  });

  const actionMutation = useMutation({
    mutationFn: ({ action, note }: { action: string; note?: string }) =>
      api.post(`/admin/users/${id}/${action}`, {
        verification_note: note,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      const msg =
        variables.action === "suspend"
          ? "User suspended"
          : variables.action === "unsuspend"
          ? "User unsuspended"
          : "NGO verified successfully!";
      toast.success(msg);
      setShowSuspendDialog(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Operation failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User permanently deleted");
      navigate("/admin/users");
    },
    onError: () => {
      toast.error("Failed to delete user");
      setShowDeleteDialog(false);
    },
  });

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-red-600">Failed to load user. Please try again.</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (isLoading || !user) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading user details...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-3xl mb-10 sm:mb-12 border-8 border-white"
          >
            <img
              src="https://peacewindsamerica.org/wp-content/uploads/2022/12/IMG_4753-scaled.jpg"
              alt="Volunteers welcoming new community members with food and kindness"
              className="w-full h-72 sm:h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 text-white text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
                Manage User: {user.name}
              </h1>
              <p className="text-lg sm:text-xl lg:text-3xl opacity-90">
                Support and grow our community of kindness
              </p>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-orange-700 hover:text-orange-800 font-medium mb-8 text-base sm:text-lg"
          >
            <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
            Back to Users
          </motion.button>

          {/* User Info Card */}
          <div className="bg-white rounded-3xl shadow-3xl p-6 sm:p-8 lg:p-10 mb-12 border-8 border-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-800 mb-8">
              User Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-600 text-base sm:text-lg">Email</p>
                    <p className="text-xl sm:text-2xl font-medium">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-start gap-4">
                    <Phone className="w-8 h-8 text-orange-600 mt-1" />
                    <div>
                      <p className="text-gray-600 text-base sm:text-lg">Phone</p>
                      <p className="text-xl sm:text-2xl font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.organization && (
                  <div className="flex items-start gap-4">
                    <Building2 className="w-8 h-8 text-orange-600 mt-1" />
                    <div>
                      <p className="text-gray-600 text-base sm:text-lg">Organization</p>
                      <p className="text-xl sm:text-2xl font-bold">{user.organization}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <Calendar className="w-8 h-8 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-600 text-base sm:text-lg">Joined</p>
                    <p className="text-xl sm:text-2xl font-medium">
                      {new Date(user.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`p-6 sm:p-8 rounded-3xl border-4 ${user.is_suspended ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"}`}>
                  {user.is_suspended ? (
                    <Ban className="text-red-600 w-16 h-16 mx-auto mb-4" />
                  ) : (
                    <CheckCircle2 className="text-green-600 w-16 h-16 mx-auto mb-4" />
                  )}
                  <p className="font-bold text-2xl sm:text-3xl text-center">
                    {user.is_suspended ? "Suspended" : "Active"}
                  </p>
                </div>

                {user.role === "receiver" && (
                  <div className={`p-6 sm:p-8 rounded-3xl border-4 ${user.is_verified ? "bg-emerald-50 border-emerald-300" : "bg-amber-50 border-amber-300"}`}>
                    {user.is_verified ? (
                      <ShieldCheck className="text-emerald-600 w-16 h-16 mx-auto mb-4" />
                    ) : (
                      <ShieldAlert className="text-amber-600 w-16 h-16 mx-auto mb-4" />
                    )}
                    <p className="font-bold text-2xl sm:text-3xl text-center">
                      {user.is_verified ? "Verified NGO" : "Pending Verification"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Verify NGO */}
            {user.role === "receiver" && !user.is_verified && (
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl">
                <ShieldCheck size={64} className="mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-6 text-center">Verify NGO</h3>
                <textarea
                  placeholder="Verification note (optional)"
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  className="w-full p-4 rounded-xl text-gray-900 mb-6 resize-none bg-white/90"
                  rows={3}
                />
                <button
                  onClick={() => actionMutation.mutate({ action: "verify", note: verificationNote || "Verified by admin" })}
                  disabled={actionMutation.isPending}
                  className="w-full bg-white text-amber-600 font-bold py-5 rounded-xl hover:bg-amber-50 transition text-xl"
                >
                  {actionMutation.isPending ? "Verifying..." : "Mark as Verified"}
                </button>
              </div>
            )}

            {/* Suspend Button */}
            <button
              onClick={() => setShowSuspendDialog(true)}
              className={`p-8 rounded-3xl text-white shadow-2xl hover:shadow-3xl transition-all text-center ${
                user.is_suspended
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : "bg-gradient-to-br from-orange-500 to-red-600"
              }`}
            >
              <Ban size={64} className="mx-auto mb-6" />
              <p className="text-3xl font-bold">
                {user.is_suspended ? "Unsuspend" : "Suspend"} User
              </p>
            </button>

            {/* Delete Button */}
            {user.role !== "admin" && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-8 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-2xl hover:shadow-3xl transition-all text-center"
              >
                <Trash2 size={64} className="mx-auto mb-6" />
                <p className="text-3xl font-bold">Delete User</p>
              </button>
            )}
          </div>

          {/* Verified Badge */}
          {user.is_verified && user.role === "receiver" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-emerald-50 border-4 border-emerald-300 rounded-3xl p-12 text-center shadow-2xl mb-16"
            >
              <ShieldCheck size={96} className="text-emerald-600 mx-auto mb-6" />
              <h3 className="text-4xl font-bold text-emerald-800 mb-6">Officially Verified NGO</h3>
              <p className="text-2xl text-emerald-700">
                {user.verification_note || "Trusted organization in Sri Lanka"}
              </p>
            </motion.div>
          )}

          {/* Dialogs */}
          <AnimatePresence>
            {showSuspendDialog && (
              <SuspendDialog
                user={user}
                isPending={actionMutation.isPending}
                onConfirm={() => actionMutation.mutate({ action: user.is_suspended ? "unsuspend" : "suspend" })}
                onClose={() => setShowSuspendDialog(false)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteDialog && (
              <DeleteDialog
                user={user}
                isPending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate()}
                onClose={() => setShowDeleteDialog(false)}
              />
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div className="mt-20 bg-orange-800 text-white rounded-3xl p-12 text-center shadow-2xl">
            <img
              src="https://thumbs.dreamstime.com/b/delicious-sri-lankan-rice-curry-spread-lanka-food-photography-vibrant-kitchen-close-up-culinary-experience-explore-flavors-367829555.jpg"
              alt="Beautiful Sri Lankan rice and curry — shared with love"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl mb-12"
            />
            <h3 className="text-5xl font-bold mb-8">FeedSriLanka Community ❤️</h3>
            <p className="text-3xl mb-10 opacity-90">
              Together, we're building a nation of kindness
            </p>
            <p className="text-2xl opacity-80">
              Every user helps reduce waste and feed families
            </p>
            <div className="mt-12 text-8xl">🍲🙏✨</div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Dialogs (unchanged but responsive)
const SuspendDialog = ({ user, isPending, onConfirm, onClose }: any) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-3xl max-w-lg w-full p-8 sm:p-10">
        <div className="text-center mb-8">
          <Ban className={user.is_suspended ? "text-emerald-600" : "text-red-600"} size={72} />
          <h3 className="text-3xl sm:text-4xl font-bold mt-6">
            {user.is_suspended ? "Unsuspend" : "Suspend"} {user.name}?
          </h3>
          <p className="text-gray-600 mt-4 text-base sm:text-lg">
            {user.is_suspended
              ? "This user will regain full access."
              : "This user will be blocked from logging in."}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={onClose} className="px-6 sm:px-8 py-3 sm:py-4 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-base sm:text-lg">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-white font-bold text-base sm:text-lg ${
              user.is_suspended ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isPending ? "Processing..." : user.is_suspended ? "Unsuspend" : "Suspend"}
          </button>
        </div>
      </div>
    </motion.div>
  </>
);

const DeleteDialog = ({ user, isPending, onConfirm, onClose }: any) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-3xl max-w-lg w-full p-8 sm:p-10 border-4 border-red-200">
        <div className="text-center">
          <AlertCircle className="text-red-600 mx-auto" size={80} />
          <h3 className="text-3xl sm:text-4xl font-bold text-red-800 mt-6">Delete Forever?</h3>
          <p className="text-gray-700 mt-4 text-base sm:text-lg">
            <strong>{user.name}</strong> will be <span className="text-red-600 font-bold">permanently deleted</span>.
          </p>
          <p className="text-red-600 font-bold text-xl sm:text-2xl mt-4">This cannot be undone.</p>
        </div>
        <div className="flex gap-4 justify-center mt-8">
          <button onClick={onClose} className="px-8 sm:px-10 py-3 sm:py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-base sm:text-lg">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-base sm:text-lg flex items-center gap-3"
          >
            {isPending ? "Deleting..." : <><Trash2 size={20} /> Yes, Delete Forever</>}
          </button>
        </div>
      </div>
    </motion.div>
  </>
);
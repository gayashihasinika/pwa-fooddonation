// src/pages/Admin/Users/EditUser.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Trash2,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { User } from "@/types/index";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="p-8 text-center text-red-600 text-xl">
          Failed to load user. Please refresh.
        </div>
      </AuthenticatedLayout>
    );
  }

  if (isLoading || !user) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 text-center text-gray-600 text-xl">Loading user...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Users
        </button>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              {user.role === "receiver" ? <Building2 className="text-rose-500" /> : <UserCheck className="text-rose-500" />}
              Manage User: {user.name}
            </h1>
            <p className="text-gray-600 mt-2">Update status, verify NGO, or manage access</p>
          </div>
          <div
            className={`px-6 py-3 rounded-full text-white font-bold text-lg ${
              user.is_suspended
                ? "bg-red-600"
                : user.role === "admin"
                ? "bg-purple-600"
                : user.role === "donor"
                ? "bg-green-600"
                : user.role === "receiver"
                ? "bg-blue-600"
                : "bg-orange-600"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">User Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Mail className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex gap-4">
                  <Phone className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{user.phone}</p>
                  </div>
                </div>
              )}
              {user.organization && (
                <div className="flex gap-4">
                  <Building2 className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="font-bold text-lg">{user.organization}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                <Calendar className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p>{new Date(user.created_at).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border-2 ${user.is_suspended ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"}`}>
                {user.is_suspended ? <Ban className="text-red-600" size={36} /> : <CheckCircle2 className="text-green-600" size={36} />}
                <p className="font-bold text-xl mt-3">{user.is_suspended ? "Suspended" : "Active"}</p>
              </div>

              {user.role === "receiver" && (
                <div className={`p-6 rounded-2xl border-2 ${user.is_verified ? "bg-emerald-50 border-emerald-300" : "bg-amber-50 border-amber-300"}`}>
                  {user.is_verified ? <ShieldCheck className="text-emerald-600" size={36} /> : <ShieldAlert className="text-amber-600" size={36} />}
                  <p className="font-bold text-xl mt-3">{user.is_verified ? "Verified NGO" : "Pending Verification"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Cards - FIXED: Using <> fragments to prevent "0" rendering */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Verify NGO */}
          {user.role === "receiver" && !user.is_verified && (
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
              <ShieldCheck size={48} className="mb-4" />
              <h3 className="text-2xl font-bold mb-4">Verify NGO</h3>
              <textarea
                placeholder="Verification note (optional)"
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                className="w-full p-3 rounded-lg text-gray-900 mb-4 resize-none bg-white/90"
                rows={3}
              />
              <button
                onClick={() => actionMutation.mutate({ action: "verify", note: verificationNote || "Verified by admin" })}
                disabled={actionMutation.isPending}
                className="w-full bg-white text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition"
              >
                {actionMutation.isPending ? "Verifying..." : "Mark as Verified"}
              </button>
            </div>
          )}

          {/* Suspend Button */}
          <button
            onClick={() => setShowSuspendDialog(true)}
            className={`p-8 rounded-2xl text-white shadow-xl transition-all hover:shadow-2xl ${
              user.is_suspended
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-orange-500 to-red-600"
            }`}
          >
            <Ban size={48} />
            <p className="text-2xl font-bold mt-4">
              {user.is_suspended ? "Unsuspend" : "Suspend"} User
            </p>
          </button>

          {/* Delete Button - THIS WAS THE PROBLEM! */}
          {user.role !== "admin" && (
            <>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-8 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl hover:shadow-2xl transition-all"
              >
                <Trash2 size={48} />
                <p className="text-2xl font-bold mt-4">Delete User</p>
              </button>
            </>
          )}
        </div>

        {/* Verified Badge */}
        {user.is_verified && user.role === "receiver" && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-10 text-center">
            <ShieldCheck size={80} className="text-emerald-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-emerald-800">Officially Verified NGO</h3>
            <p className="text-emerald-700 mt-3 text-lg max-w-2xl mx-auto">
              {user.verification_note || "Trusted organization in Sri Lanka"}
            </p>
          </div>
        )}

        {/* Dialogs remain unchanged */}
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
      </div>
    </AuthenticatedLayout>
  );
}

// Extracted dialogs to prevent re-render issues
const SuspendDialog = ({ user, isPending, onConfirm, onClose }: any) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <Ban className={user.is_suspended ? "text-emerald-600" : "text-red-600"} size={72} />
          <h3 className="text-3xl font-bold mt-6">
            {user.is_suspended ? "Unsuspend" : "Suspend"} {user.name}?
          </h3>
          <p className="text-gray-600 mt-4 text-lg">
            {user.is_suspended
              ? "This user will regain full access."
              : "This user will be blocked from logging in."}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`px-8 py-3 rounded-xl text-white font-bold ${
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-4 border-red-200">
        <div className="text-center">
          <AlertCircle className="text-red-600 mx-auto" size={80} />
          <h3 className="text-3xl font-bold text-red-800 mt-6">Delete Forever?</h3>
          <p className="text-gray-700 mt-4 text-lg">
            <strong>{user.name}</strong> will be <span className="text-red-600 font-bold">permanently deleted</span>.
          </p>
          <p className="text-red-600 font-bold text-xl mt-4">This cannot be undone.</p>
        </div>
        <div className="flex gap-4 justify-center mt-8">
          <button onClick={onClose} className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-3"
          >
            {isPending ? "Deleting..." : <><Trash2 size={20} /> Yes, Delete Forever</>}
          </button>
        </div>
      </div>
    </motion.div>
  </>
);
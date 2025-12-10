// src/pages/Admin/Gamification/PointsConfig.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Settings, 
  Zap, 
  Trophy, 
  Star, 
  Save, 
  X, 
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";

interface Config {
  id: number;
  key: string;
  value: string;
}

export default function PointsConfig() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Add New Rule Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({ key: "", value: "" });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/gamification");
      setConfigs(data.configs || []);
    } catch (error: any) {
      toast.error("Failed to load points configuration");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (config: Config) => {
    setEditingKey(config.key);
    setEditValue(config.value);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const saveConfig = async (key: string) => {
    if (!editValue.trim()) {
      toast.error("Value cannot be empty");
      return;
    }

    try {
      await api.post("/admin/gamification/config", { key, value: editValue });
      toast.success("Points updated successfully!");
      setEditingKey(null);
      fetchConfigs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleAddNewRule = async () => {
    if (!newRule.key.trim() || !newRule.value.trim()) {
      toast.error("Both key and value are required");
      return;
    }

    // Convert spaces to underscores and lowercase
    const formattedKey = newRule.key.toLowerCase().replace(/\s+/g, "_");

    try {
      await api.post("/admin/gamification/config", {
        key: formattedKey,
        value: newRule.value,
      });
      toast.success("New points rule created!");
      setShowAddModal(false);
      setNewRule({ key: "", value: "" });
      fetchConfigs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create rule");
    }
  };

  const configItems = configs.map((c) => ({
    key: c.key,
    label: c.key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace("Per", "per"),
    value: c.value,
    icon: c.key.includes("donation") ? <Trophy className="w-8 h-8" /> :
          c.key.includes("streak") ? <Zap className="w-8 h-8" /> :
          c.key.includes("referral") ? <Star className="w-8 h-8" /> :
          <Settings className="w-8 h-8" />,
    color: c.key.includes("donation") ? "from-rose-500 to-pink-500" :
           c.key.includes("streak") ? "from-yellow-500 to-orange-500" :
           c.key.includes("referral") ? "from-purple-500 to-indigo-500" :
           "from-blue-500 to-cyan-500",
  }));

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-100 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 mb-4"
            >
              Points & Rewards System
            </motion.h1>
            <p className="text-xl text-gray-700">
              Control how donors earn points • Motivate consistent giving
            </p>
          </div>

          {/* Add New Rule Button */}
          <div className="text-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl flex items-center gap-4 mx-auto transition"
            >
              Add New Points Rule
            </motion.button>
          </div>

          {/* Config Cards */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-rose-500 border-t-transparent"></div>
            </div>
          ) : configs.length === 0 ? (
            <motion.div className="text-center py-20">
              <Settings className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <p className="text-2xl text-gray-500">No points rules yet</p>
              <p className="text-gray-400 mt-2">Click above to create your first rule!</p>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {configItems.map((item) => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-orange-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-4 border-white overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${item.color}`}></div>

                      <div className="text-center">
                        <div className="mb-6">
                          <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${item.color} text-white shadow-2xl`}>
                            {item.icon}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.label}</h3>

                        <div className="mb-8">
                          {editingKey === item.key ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="px-8 py-5 text-5xl font-bold text-center border-4 border-rose-400 rounded-3xl focus:border-rose-600 focus:outline-none w-full max-w-xs mx-auto"
                              autoFocus
                            />
                          ) : (
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">
                              {item.value}
                            </div>
                          )}
                          <p className="text-gray-600 mt-3 text-lg">points</p>
                        </div>

                        <div className="flex justify-center gap-4">
                          {editingKey === item.key ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => saveConfig(item.key)}
                                className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-3xl shadow-xl"
                              >
                                <Save className="w-7 h-7" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={cancelEdit}
                                className="bg-gray-600 hover:bg-gray-700 text-white p-5 rounded-3xl shadow-xl"
                              >
                                <X className="w-7 h-7" />
                              </motion.button>
                            </>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => startEdit(configs.find(c => c.key === item.key)!)}
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-5 rounded-3xl font-bold text-lg shadow-xl flex items-center gap-3"
                            >
                              Edit Value
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* ADD NEW RULE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Add New Points Rule
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Rule Name (e.g., "Daily Login Bonus")
                  </label>
                  <input
                    value={newRule.key}
                    onChange={(e) => setNewRule({ ...newRule, key: e.target.value })}
                    placeholder="Daily Login Bonus"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Will be converted to: <code className="bg-gray-100 px-2 py-1 rounded">daily_login_bonus</code>
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Points Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRule.value}
                    onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    placeholder="50"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-rose-500 focus:outline-none transition text-lg"
                  />
                </div>

                <div className="flex gap-4 justify-end pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-8 py-4 border-2 border-gray-300 rounded-2xl font-semibold hover:bg-gray-50 transition text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewRule}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-2xl transition"
                  >
                    Create Rule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthenticatedLayout>
  );
}
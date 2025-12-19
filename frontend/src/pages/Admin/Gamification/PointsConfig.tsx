// src/pages/Admin/Gamification/PointsConfig.tsx — EMOTIONAL & FULLY RESPONSIVE
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
  Plus,
  Sparkles,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import api from "@/lib/api";
import pointsImg from "@/assets/images/points1.jpg";
import pointsImg2 from "@/assets/images/points2.jpg";
import pointsImg3 from "@/assets/images/points3.jpg";

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
    } catch {
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
      toast.success("Points updated successfully! ✨");
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

    const formattedKey = newRule.key.toLowerCase().replace(/\s+/g, "_");

    try {
      await api.post("/admin/gamification/config", {
        key: formattedKey,
        value: newRule.value,
      });
      toast.success("New points rule created! 🎉");
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
    icon: c.key.includes("donation") ? <Trophy className="w-10 h-10" /> :
          c.key.includes("streak") ? <Zap className="w-10 h-10" /> :
          c.key.includes("referral") ? <Star className="w-10 h-10" /> :
          <Settings className="w-10 h-10" />,
    color: c.key.includes("donation") ? "from-rose-500 to-pink-500" :
           c.key.includes("streak") ? "from-yellow-500 to-orange-500" :
           c.key.includes("referral") ? "from-purple-500 to-indigo-500" :
           "from-blue-500 to-cyan-500",
  }));

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-6 px-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 rounded-3xl overflow-hidden shadow-3xl mb-12 sm:mb-16 border-8 border-white"
          >
            <img
              src={pointsImg}
              alt="Gamification boosting donations"
              className="w-full h-64 sm:h-80 object-contain bg-white"
            />
            <img
              src={pointsImg2}
              alt="Earning points and rewards"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <img
              src={pointsImg3}
              alt="Celebrating generosity"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>

          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-orange-800 mb-6">
              Configuring Points to Inspire Kindness ✨
            </h1>
            <p className="text-xl sm:text-2xl text-orange-700 px-4">
              Set rewards that motivate consistent giving ({configs.length} rules)
            </p>
          </div>

          {/* Add New Rule Button */}
          <div className="text-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 rounded-3xl font-bold text-xl shadow-2xl flex items-center gap-4 mx-auto transition"
            >
              <Plus className="w-8 h-8" />
              Add New Points Rule
            </motion.button>
          </div>

          {/* Config Cards - Responsive Grid */}
          {loading ? (
            <div className="text-center py-32">
              <Sparkles className="w-32 h-32 text-orange-300 mx-auto mb-8 animate-pulse" />
              <p className="text-3xl text-orange-700">Loading points rules...</p>
            </div>
          ) : configs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/90 backdrop-blur rounded-3xl shadow-2xl"
            >
              <Settings className="w-40 h-40 text-orange-300 mx-auto mb-10" />
              <p className="text-5xl font-bold text-orange-800 mb-6">No Points Rules Yet</p>
              <p className="text-2xl text-gray-700 px-8">
                Create rules to reward donors and encourage more giving!
              </p>
              <p className="text-xl text-orange-600 mt-8">Every point motivates kindness 🙏</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {configItems.map((item) => (
                <motion.div
                  key={item.key}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white hover:shadow-3xl transition-all"
                >
                  <div className={`h-4 bg-gradient-to-r ${item.color}`} />

                  <div className="p-8 text-center">
                    <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${item.color} text-white mb-6 shadow-xl`}>
                      {item.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-orange-800 mb-4">{item.label}</h3>

                    <div className="mb-8">
                      {editingKey === item.key ? (
                        <div className="flex items-center justify-center gap-4">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-6 py-4 text-4xl font-bold text-center border-4 border-orange-400 rounded-3xl focus:border-orange-600 focus:outline-none w-32"
                            autoFocus
                          />
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => saveConfig(item.key)}
                              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl transition"
                            >
                              <Save className="w-6 h-6" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl shadow-xl transition"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                            {item.value}
                          </div>
                          <p className="text-xl text-gray-600 mt-3">points awarded</p>
                        </>
                      )}
                    </div>

                    {!editingKey && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEdit(configs.find(c => c.key === item.key)!)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-5 rounded-3xl font-bold text-lg shadow-2xl transition"
                      >
                        Edit Points Value
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add New Rule Modal */}
          <AnimatePresence>
            {showAddModal && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/60 z-40"
                  onClick={() => setShowAddModal(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-3xl border-8 border-white">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-3xl font-bold text-orange-800">
                        Add New Points Rule
                      </h2>
                      <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition">
                        <X className="w-8 h-8" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-lg font-bold text-gray-700">Rule Name *</label>
                        <input
                          value={newRule.key}
                          onChange={(e) => setNewRule({ ...newRule, key: e.target.value })}
                          placeholder="Daily Login Bonus"
                          className="w-full mt-3 px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Will become: <code className="bg-gray-100 px-2 py-1 rounded">daily_login_bonus</code>
                        </p>
                      </div>

                      <div>
                        <label className="text-lg font-bold text-gray-700">Points Value *</label>
                        <input
                          type="number"
                          min="1"
                          value={newRule.value}
                          onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                          placeholder="50"
                          className="w-full mt-3 px-6 py-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          className="flex-1 px-8 py-5 border-4 border-gray-300 rounded-3xl hover:bg-gray-50 font-bold text-lg transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddNewRule}
                          className="flex-1 px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-3xl font-bold text-lg shadow-2xl transition"
                        >
                          Create Rule
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
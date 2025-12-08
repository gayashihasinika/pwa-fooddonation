// src/pages/Donors/PostDonation/PostDonationAdd.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  UploadCloud,
  CalendarDays,
  Package,
  MapPin,
  Clock,
  AlertCircle,
  Droplet,
  X,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AuthUser = { id: number; name?: string; email?: string };

export default function DonationAdd() {
  const navigate = useNavigate();

  const authUser: AuthUser | null = useMemo(() => {
    try {
      const raw = localStorage.getItem("authUser");
      return raw ? JSON.parse(raw) as AuthUser : null;
    } catch {
      return null;
    }
  }, []);

  const [form, setForm] = useState({
    user_id: "",
    title: "",
    description: "",
    quantity: 1,
    pickup_address: "",
    expiry_date: "",
    preferred_pickup_time: "",
    food_category: "",
    allergy_tags: [] as string[],
    freshness_level: "",
    images: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [mapPreviewUrl, setMapPreviewUrl] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");

  useEffect(() => {
    if (authUser?.id) {
      setForm((prev) => ({ ...prev, user_id: String(authUser.id) }));
    }
  }, [authUser?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "quantity" ? Number(value) : value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleAllergyChange = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      allergy_tags: prev.allergy_tags.includes(tag)
        ? prev.allergy_tags.filter((t) => t !== tag)
        : [...prev.allergy_tags, tag],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setForm({ ...form, images: files });
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };


  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Please enter a title";
    if (!form.pickup_address.trim()) errs.pickup_address = "Please enter pickup address";
    if (form.quantity < 1) errs.quantity = "Quantity must be at least 1";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images" || key === "allergy_tags") return;
      formData.append(key, String(value));
    });

    form.allergy_tags.forEach((tag) => formData.append("allergy_tags[]", tag));
    form.images.forEach((file) => formData.append("images[]", file));

    try {
      await api.post("/donations", formData);
      toast.success("Donation posted successfully!");
      navigate("/donors/post-donation/post-donation-list");
    } catch (err: any) {
      toast.error("Failed to post donation");
      console.error(err);
    }
  };

  const showMapFromAddress = async () => {
    const address = form.pickup_address.trim();
    if (!address) {
      toast.error("Please enter an address first");
      return;
    }

    toast.loading("Finding your location...", { id: "map" });

    try {
      // Try with full address first
      let query = address + ", Sri Lanka";

      // If very long/detailed, fall back to city/town only
      if (address.length > 50 || address.includes("/") || address.includes("No.")) {
        // Extract city/town from address (common Sri Lankan patterns)
        const parts = address.toLowerCase().split(/[\s,]+/);
        const cities = ["colombo", "kandy", "galle", "jaffna", "kadawatha", "gampaha", "negombo", "rathnapura", "kurunegala", "anuradhapura"];
        const foundCity = parts.find(p => cities.some(city => p.includes(city))) || parts[parts.length - 1];
        query = foundCity + ", Sri Lanka";
      }

      const encoded = encodeURIComponent(query);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=lk&addressdetails=1`
      );
      const data = await res.json();

      if (data && data[0]) {
        const { lat, lon, display_name } = data[0];

        setLat(lat);
        setLon(lon);
        setForm(prev => ({ ...prev, pickup_address: display_name }));

        setMapPreviewUrl("show");
        toast.success("Map loaded perfectly!", { id: "map" });
      } else {
        // FINAL FALLBACK: Show map of Sri Lanka center
        setLat("7.8731");
        setLon("80.7718");
        setMapPreviewUrl("show");
        toast.success("Showing approximate area in Sri Lanka", { id: "map" });
      }
    } catch (err) {
      // Ultimate fallback
      setLat("7.8731");
      setLon("80.7718");
      setMapPreviewUrl("show");
      toast.success("Showing Sri Lanka", { id: "map" });
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header Card */}
          <Card className="mb-8 rounded-3xl shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white p-10 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Share Food, Spread Love
              </h1>
              <p className="text-xl opacity-90">Your donation can feed a family today</p>
            </div>
          </Card>

          {/* Main Form Card */}
          <Card className="rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur">
            <CardHeader className="text-center pt-10 pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Add New Donation
              </CardTitle>
              <p className="text-gray-600 mt-2">Fill in the details below</p>
            </CardHeader>

            <CardContent className="px-6 md:px-12 pb-12">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label className="text-lg font-semibold text-gray-700">Donation Title</Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Fresh Rice & Curry for 10 people"
                    className="text-lg py-6 rounded-xl border-gray-300 focus:ring-rose-500"
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label className="text-lg font-semibold text-gray-700">Description (Optional)</Label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell us more about your food..."
                    className="min-h-32 rounded-xl focus:ring-rose-500"
                    rows={4}
                  />
                </motion.div>

                {/* Grid: Quantity + Expiry */}
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <Package className="text-rose-600" /> Quantity (servings)
                    </Label>
                    <Input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      min={1}
                      className="text-lg py-6"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <CalendarDays className="text-rose-600" /> Expiry Date
                    </Label>
                    <Input
                      type="date"
                      name="expiry_date"
                      value={form.expiry_date}
                      onChange={handleChange}
                      className="py-6"
                    />
                  </motion.div>
                </div>

                {/* SIMPLE & BEAUTIFUL ADDRESS FIELD — LIKE ALL OTHERS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label className="text-xl font-bold flex items-center gap-3">
                      <MapPin className="text-rose-600" /> Pickup Location
                    </Label>

                    {/* Address Input + Show Map Button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Input
                          name="pickup_address"
                          value={form.pickup_address}
                          onChange={handleChange}
                          placeholder="e.g., No. 123, Temple Road, Colombo 07"
                          className="text-lg py-6 bg-white border-gray-300 focus:ring-rose-500"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        className="whitespace-nowrap shadow-lg hover:shadow-xl font-bold flex items-center gap-2"
                        onClick={showMapFromAddress}
                      >
                        <Search className="w-5 h-5" />
                        Show on Map
                      </Button>
                    </div>

                    {mapPreviewUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-100 bg-gray-50"
                      >
                        <iframe
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon) - 0.02},${parseFloat(lat) - 0.02},${parseFloat(lon) + 0.02},${parseFloat(lat) + 0.02}&layer=mapnik&marker=${lat},${lon}`}
                          width="100%"
                          height="520"
                          frameBorder="0"
                          title="Your Pickup Location"
                          className="rounded-3xl"
                          allowFullScreen
                          loading="lazy"
                        />

                        {/* Animated Red Pin */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <motion.div
                            animate={{ y: [0, -30, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-red-500/60 rounded-full blur-2xl animate-ping" />
                            <div className="relative w-20 h-20 bg-red-600 rounded-full border-6 border-white shadow-2xl flex items-center justify-center">
                              <MapPin className="w-12 h-12 text-white" fill="white" />
                            </div>
                          </motion.div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setMapPreviewUrl("")}
                          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition z-10"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Preferred Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="text-rose-600" /> Preferred Pickup Time
                  </Label>
                  <Input type="time" name="preferred_pickup_time" value={form.preferred_pickup_time} onChange={handleChange} className="py-6" />
                </motion.div>

                {/* Food Category — Also Fixed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label className="text-lg font-semibold text-gray-700">Food Category</Label>

                  <div className="relative">
                    <Select value={form.food_category} onValueChange={(v) => handleSelectChange("food_category", v)}>
                      <SelectTrigger className="py-6 text-lg">
                        <SelectValue placeholder="Select food type" />
                      </SelectTrigger>

                      <SelectContent className="z-50 bg-white shadow-2xl border border-gray-200 rounded-xl min-w-[280px]" position="popper" sideOffset={8}>
                        <SelectItem value="rice" className="py-3 px-4 hover:bg-rose-50">Rice & Curry</SelectItem>
                        <SelectItem value="bread" className="py-3 px-4 hover:bg-rose-50">Bread & Bakery</SelectItem>
                        <SelectItem value="packaged" className="py-3 px-4 hover:bg-rose-50">Packaged Food</SelectItem>
                        <SelectItem value="event_food" className="py-3 px-4 hover:bg-rose-50">Event/Party Food</SelectItem>
                        <SelectItem value="curry" className="py-3 px-4 hover:bg-rose-50">Curry Only</SelectItem>
                        <SelectItem value="other" className="py-3 px-4 hover:bg-rose-50">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Allergy Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-4"
                >
                  <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <AlertCircle className="text-amber-600" /> Allergy Information (Optional)
                  </Label>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {["nuts", "dairy", "gluten", "eggs", "soy", "seafood"].map((tag) => (
                        <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            value={tag}
                            checked={form.allergy_tags.includes(tag)}
                            onChange={() => handleAllergyChange(tag)}
                            className="w-6 h-6 text-rose-600 rounded focus:ring-rose-500"
                          />
                          <span className="text-gray-700 font-medium capitalize group-hover:text-rose-600 transition">
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Freshness Level — FIXED WITH PROPER Z-INDEX */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Droplet className="text-blue-600" /> Freshness Level
                  </Label>

                  <div className="relative">
                    <Select value={form.freshness_level} onValueChange={(v) => handleSelectChange("freshness_level", v)}>
                      <SelectTrigger className="py-6 text-lg">
                        <SelectValue placeholder="How fresh is your food?" />
                      </SelectTrigger>

                      {/* THIS IS THE FIX — High z-index + proper positioning */}
                      <SelectContent className="z-50 bg-white shadow-2xl border border-gray-200 rounded-xl min-w-[300px]"
                        position="popper"
                        sideOffset={8}
                      >
                        <SelectItem value="freshly_cooked" className="py-3 px-4 hover:bg-rose-50 cursor-pointer">
                          Freshly Cooked Today
                        </SelectItem>
                        <SelectItem value="yesterdays_leftover" className="py-3 px-4 hover:bg-rose-50 cursor-pointer">
                          Yesterday's Leftover
                        </SelectItem>
                        <SelectItem value="packaged_sealed" className="py-3 px-4 hover:bg-rose-50 cursor-pointer">
                          Factory Sealed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Images Upload */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-4"
                >
                  <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <UploadCloud className="text-rose-600" /> Upload Photos (Up to 5)
                  </Label>
                  <div
                    className="border-2 border-dashed border-rose-200 bg-rose-50 rounded-2xl p-12 text-center hover:border-rose-400 hover:bg-rose-100 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).slice(0, 5);
                      if (files.length > 0) {
                        setForm({ ...form, images: files });
                        setPreviewImages(files.map(f => URL.createObjectURL(f)));
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      id="file-upload"
                    />

                    <label htmlFor="file-upload" className="cursor-pointer z-10 relative">
                      <div className="flex flex-col items-center gap-5">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="p-8 bg-white rounded-full shadow-2xl border-4 border-rose-100"
                        >
                          <UploadCloud className="w-16 h-16 text-rose-600" />
                        </motion.div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">
                            Drop Images Here or Click to Browse
                          </p>
                          <p className="text-gray-600 mt-2">Maximum 5 photos • JPG or PNG</p>
                        </div>
                      </div>
                    </label>

                    {/* Optional: Subtle animation background */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 to-orange-200/20" />
                    </div>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      {previewImages.map((src, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={src}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-40 object-cover rounded-2xl shadow-lg border-2 border-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                          >
                            <X size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="pt-8"
                >
                  <Button
                    type="submit"
                    className="w-full py-8 text-2xl font-bold bg-gradient-to-r from-rose-600 via-orange-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Publish My Donation
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
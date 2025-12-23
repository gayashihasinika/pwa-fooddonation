// src/pages/Donors/PostDonation/PostDonationEdit.tsx — BEAUTIFUL & RESPONSIVE
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function PostDonationEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mapPreviewUrl, setMapPreviewUrl] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: 1,
    pickup_address: "",
    expiry_date: "",
    preferred_pickup_time: "",
    food_category: "",
    allergy_tags: [] as string[],
    freshness_level: "",
    existingImages: [] as { id: number; image_path: string }[],
    newImages: [] as File[],
  });

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await api.get(`/donors/donations/${id}`);
        const d = res.data;

        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toISOString().split("T")[0];
        };

        setForm({
          title: d.title || "",
          description: d.description || "",
          quantity: d.quantity || 1,
          pickup_address: d.pickup_address || "",
          expiry_date: formatDate(d.expiry_date),
          preferred_pickup_time: d.preferred_pickup_time || "",
          food_category: d.food_category || "",
          allergy_tags: Array.isArray(d.allergy_tags)
            ? d.allergy_tags
            : JSON.parse(d.allergy_tags || "[]"),
          freshness_level: d.freshness_level || "",
          existingImages: d.images || [],
          newImages: [],
        });

        if (d.pickup_address) {
          setTimeout(() => showMapFromAddress(d.pickup_address), 800);
        }
      } catch (err) {
        toast.error("Failed to load donation");
        navigate("/donors/post-donation/post-donation-list");
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === "quantity") {
      // Make sure we use Math.floor and parse as integer
      const quantity = Math.max(1, Math.floor(Number(value) || 1));
      setForm(prev => ({ ...prev, quantity }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergyChange = (tag: string) => {
    setForm(prev => ({
      ...prev,
      allergy_tags: prev.allergy_tags.includes(tag)
        ? prev.allergy_tags.filter(t => t !== tag)
        : [...prev.allergy_tags, tag],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setForm(prev => ({ ...prev, newImages: files }));
    }
  };

  const removeExistingImage = (imageId: number) => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img.id !== imageId),
    }));
  };

  const removeNewImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  const showMapFromAddress = async (addressOverride?: string) => {
    const address = (addressOverride || form.pickup_address).trim();
    if (!address) {
      toast.error("Please enter an address");
      return;
    }

    toast.loading("Loading map...", { id: "map" });

    try {
      const encoded = encodeURIComponent(address + ", Sri Lanka");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=lk`
      );
      const data = await res.json();

      if (data && data[0]) {
        const { lat, lon } = data[0];
        setLat(lat);
        setLon(lon);
        setMapPreviewUrl("show");
        toast.success("Map loaded!", { id: "map" });
      } else {
        toast.error("Address not found", { id: "map" });
      }
    } catch (err) {
      toast.error("Map failed to load", { id: "map" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");

    // Required
    formData.append("title", form.title);
    formData.append("quantity", String(form.quantity));
    formData.append("pickup_address", form.pickup_address);

    // Optional
    formData.append("description", form.description);
    formData.append("expiry_date", form.expiry_date);
    formData.append("preferred_pickup_time", form.preferred_pickup_time);
    formData.append("food_category", form.food_category);
    formData.append("freshness_level", form.freshness_level);

    form.allergy_tags.forEach(tag => formData.append("allergy_tags[]", tag));
    form.newImages.forEach(file => formData.append("images[]", file));
    form.existingImages.forEach(img => formData.append("existing_images[]", String(img.id)));

    try {
      await api.post(`/donors/donations/${id}`, formData);
      toast.success("Donation updated successfully! ❤️");
      navigate("/donors/post-donation/post-donation-list");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
          <p className="text-2xl text-orange-700">Loading donation...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Hero Header */}
          <Card className="mb-12 rounded-3xl shadow-2xl overflow-hidden border-0">
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-12 text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                Edit Your Donation
              </h1>
              <p className="text-2xl opacity-90">
                Update details to help more families ❤️
              </p>
            </div>
          </Card>

          {/* Form Card */}
          <Card className="rounded-3xl shadow-2xl bg-white/95 backdrop-blur">
            <CardHeader className="text-center pt-12 pb-8">
              <CardTitle className="text-4xl font-bold text-orange-800">
                Update Donation Details
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 md:px-16 pb-16">
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Title */}
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-gray-800">Donation Title</Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Fresh Rice & Curry for 8 people"
                    className="text-lg py-7 rounded-2xl"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-gray-800">Description (Optional)</Label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Any special notes..."
                    className="min-h-32 rounded-2xl"
                    rows={4}
                  />
                </div>

                {/* Quantity + Expiry */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <Package className="text-orange-600" />
                      Quantity (servings)
                    </Label>
                    <Input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      min="1"
                      className="text-lg py-7 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <CalendarDays className="text-orange-600" />
                      Expiry Date
                    </Label>
                    <Input
                      type="date"
                      name="expiry_date"
                      value={form.expiry_date}
                      onChange={handleChange}
                      className="text-lg py-7 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Address + Map */}
                <div className="space-y-6">
                  <Label className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <MapPin className="text-orange-600" />
                    Pickup Location
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      name="pickup_address"
                      value={form.pickup_address}
                      onChange={handleChange}
                      placeholder="e.g., No. 123, Temple Road, Kadawatha"
                      className="flex-1 text-lg py-7 rounded-2xl"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => showMapFromAddress()}
                      className="whitespace-nowrap shadow-lg hover:shadow-xl font-bold flex items-center gap-3"
                    >
                      <Search className="w-5 h-5" />
                      Show on Map
                    </Button>
                  </div>

                  {mapPreviewUrl && lat && lon && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-100"
                    >
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon) - 0.02},${parseFloat(lat) - 0.02},${parseFloat(lon) + 0.02},${parseFloat(lat) + 0.02}&layer=mapnik&marker=${lat},${lon}`}
                        width="100%"
                        height="520"
                        frameBorder="0"
                        className="rounded-3xl"
                        allowFullScreen
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => setMapPreviewUrl("")}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg z-10"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Category + Freshness */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xl font-bold text-gray-800">Food Category</Label>
                    <Select value={form.food_category} onValueChange={(v) => handleSelectChange("food_category", v)}>
                      <SelectTrigger className="py-7 text-lg rounded-2xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice & Curry</SelectItem>
                        <SelectItem value="bread">Bread & Bakery</SelectItem>
                        <SelectItem value="packaged">Packaged Food</SelectItem>
                        <SelectItem value="event_food">Event/Party Food</SelectItem>
                        <SelectItem value="curry">Curry Only</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <Droplet className="text-blue-600" />
                      Freshness Level
                    </Label>
                    <Select value={form.freshness_level} onValueChange={(v) => handleSelectChange("freshness_level", v)}>
                      <SelectTrigger className="py-7 text-lg rounded-2xl">
                        <SelectValue placeholder="How fresh?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freshly_cooked">Freshly Cooked Today</SelectItem>
                        <SelectItem value="yesterdays_leftover">Yesterday's Leftover</SelectItem>
                        <SelectItem value="packaged_sealed">Factory Sealed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Allergy Tags */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <AlertCircle className="text-amber-600" />
                    Allergy Information (Optional)
                  </Label>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {["nuts", "dairy", "gluten", "eggs", "soy", "seafood"].map(tag => (
                        <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={form.allergy_tags.includes(tag)}
                            onChange={() => handleAllergyChange(tag)}
                            className="w-6 h-6 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <span className="capitalize font-medium group-hover:text-orange-600 transition">
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-6">
                  <Label className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <UploadCloud className="text-orange-600" />
                    Photos
                  </Label>

                  {/* Existing Images */}
                  {form.existingImages.length > 0 && (
                    <div>
                      <p className="text-lg text-gray-700 mb-4">Current Photos</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {form.existingImages.map(img => (
                          <div key={img.id} className="relative group">
                            <img
                              src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                              alt="Current"
                              className="w-full h-40 object-cover rounded-2xl shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(img.id)}
                              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {form.newImages.length > 0 && (
                    <div>
                      <p className="text-lg text-gray-700 mb-4 mt-8">New Photos</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {form.newImages.map((file, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="New"
                              className="w-full h-40 object-cover rounded-2xl shadow-lg border-2 border-dashed border-orange-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(i)}
                              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New */}
                  <div className="border-4 border-dashed border-orange-200 bg-orange-50 rounded-3xl p-12 text-center hover:border-orange-400 transition">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="new-images"
                    />
                    <label htmlFor="new-images" className="cursor-pointer">
                      <UploadCloud className="w-20 h-20 text-orange-600 mx-auto mb-4" />
                      <p className="text-2xl font-bold text-gray-800">Add More Photos</p>
                      <p className="text-gray-600 mt-2">Click to upload</p>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto px-16 py-8 text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-3xl shadow-2xl hover:shadow-3xl transition transform hover:scale-105"
                  >
                    Update Donation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-16 py-8 text-xl border-4 border-orange-600 text-orange-700 hover:bg-orange-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
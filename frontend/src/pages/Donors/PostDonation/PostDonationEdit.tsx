// src/pages/Donors/PostDonation/PostDonationEdit.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  UploadCloud,
  Package,
  CalendarDays,
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

  // FETCH DONATION DATA
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await api.get(`/donors/donations/${id}`);
        const d = res.data;

        // Fix date format for input[type="date"]
        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toISOString().split("T")[0]; // → YYYY-MM-DD
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

        // Auto-show map when page loads
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
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) || 1 : value,
    }));
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

  // SHOW MAP FROM ADDRESS
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
        setMapPreviewUrl("show"); // Triggers map render

        toast.success("Map loaded!", { id: "map" });
      } else {
        toast.error("Address not found", { id: "map" });
      }
    } catch (err) {
      toast.error("Map failed to load", { id: "map" });
    }
  };

  // SUBMIT UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");

    // Required fields
    formData.append("title", form.title);
    formData.append("quantity", String(form.quantity));
    formData.append("pickup_address", form.pickup_address);

    // Optional fields
    formData.append("description", form.description);
    formData.append("expiry_date", form.expiry_date);
    formData.append("preferred_pickup_time", form.preferred_pickup_time);
    formData.append("food_category", form.food_category);
    formData.append("freshness_level", form.freshness_level);

    // Allergy tags
    form.allergy_tags.forEach(tag => formData.append("allergy_tags[]", tag));

    // New images
    form.newImages.forEach(file => formData.append("images[]", file));

    // Existing images to keep
    form.existingImages.forEach(img => formData.append("existing_images[]", String(img.id)));

    try {
      await api.post(`/donations/${id}`, formData);
      toast.success("Donation updated successfully!");
      navigate("/donors/post-donation/post-donation-list");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-10 text-center text-xl">Loading donation...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur">
            <CardHeader className="text-center pt-10 pb-6">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Edit Donation
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 md:px-12 pb-12">
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* Same beautiful layout as Add page */}
                <motion.div className="space-y-2">
                  <Label className="text-lg font-semibold">Donation Title</Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="text-lg py-6"
                    required
                  />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Package /> Quantity
                    </Label>
                    <Input
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      min={1}
                      className="py-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CalendarDays /> Expiry Date
                    </Label>
                    <Input
                      type="date"
                      name="expiry_date"
                      value={form.expiry_date}
                      onChange={handleChange}
                      className="py-6"
                    />
                  </div>
                </div>

                {/* Address + Map */}
                <motion.div className="space-y-6">
                  <Label className="text-xl font-bold flex items-center gap-3">
                    <MapPin className="text-rose-600" /> Pickup Location
                  </Label>
                  <div className="flex gap-4">
                    <Input
                      name="pickup_address"
                      value={form.pickup_address}
                      onChange={handleChange}
                      placeholder="e.g., Kadawatha, Colombo"
                      className="flex-1 text-lg py-6"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => showMapFromAddress()}
                      className="flex items-center gap-2"
                    >
                      <Search className="w-5 h-5" /> Show on Map
                    </Button>
                  </div>

                  {/* MAP — NOW WORKS 100% */}
                  {mapPreviewUrl && lat && lon && (
                    <motion.div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-100 bg-gray-50">
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon) - 0.015},${parseFloat(lat) - 0.015},${parseFloat(lon) + 0.015},${parseFloat(lat) + 0.015}&layer=mapnik&marker=${lat},${lon}`}
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
                </motion.div>

                {/* Food Category + Freshness */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label>Food Category</Label>
                    <Select value={form.food_category} onValueChange={(v) => handleSelectChange("food_category", v)}>
                      <SelectTrigger className="py-6">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white shadow-2xl border border-gray-200 rounded-xl min-w-[280px]" position="popper" sideOffset={8}>
                        <SelectItem value="rice">Rice & Curry</SelectItem>
                        <SelectItem value="bread">Bread & Bakery</SelectItem>
                        <SelectItem value="packaged">Packaged Food</SelectItem>
                        <SelectItem value="event_food">Event/Party Food</SelectItem>
                        <SelectItem value="curry">Curry Only</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Droplet /> Freshness Level
                    </Label>
                    <Select value={form.freshness_level} onValueChange={(v) => handleSelectChange("freshness_level", v)}>
                      <SelectTrigger className="py-6">
                        <SelectValue placeholder="How fresh?" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white shadow-2xl border border-gray-200 rounded-xl min-w-[300px]"
                        position="popper"
                        sideOffset={8}
                      >
                        <SelectItem value="freshly_cooked">Freshly Cooked Today</SelectItem>
                        <SelectItem value="yesterdays_leftover">Yesterday's Leftover</SelectItem>
                        <SelectItem value="packaged_sealed">Factory Sealed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Allergy Tags */}
                <motion.div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="text-amber-600" /> Allergy Information
                  </Label>
                  <div className="bg-amber-50 rounded-2xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {["nuts", "dairy", "gluten", "eggs", "soy", "seafood"].map(tag => (
                        <label key={tag} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.allergy_tags.includes(tag)}
                            onChange={() => handleAllergyChange(tag)}
                            className="w-6 h-6 text-rose-600 rounded"
                          />
                          <span className="capitalize font-medium">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Images */}
                <motion.div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <UploadCloud /> Photos
                  </Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {form.existingImages.map(img => (
                      <div key={img.id} className="relative group">
                        <img
                          src={`http://127.0.0.1:8001/storage/${img.image_path}`}
                          alt="Donation"
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {form.newImages.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt="New"
                        className="w-full h-32 object-cover rounded-xl border-2 border-dashed border-rose-300"
                      />
                    ))}
                  </div>
                  <Input type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
                </motion.div>

                {/* Submit */}
                <motion.div className="pt-8 flex gap-4 justify-center">
                  <Button
                    type="submit"
                    className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700"
                  >
                    Update Donation
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
                    Cancel
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
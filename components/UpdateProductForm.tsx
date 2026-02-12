"use client";

import { useState, useEffect } from "react";
import { Package, ImageIcon, Sparkles, Check, Tags } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface UpdateProductFormProps {
  product: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpdateProductForm({
  product,
  onSuccess,
  onCancel,
}: UpdateProductFormProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [categoryId, setCategoryId] = useState(product.category_id || "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.image_url,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      setCategories(categoryData || []);
    };

    fetchCategories();
  }, []);

  const handleImageChange = (file: File | null | undefined) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function uploadProductImage(file: File) {
    const ext = file.name.split(".").pop();
    const fileName = `products/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);

    return data.publicUrl;
  }

  const handleSubmit = async () => {
    if (!name || !description) {
      toast.error("Name and description required");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = product.image_url;

      // If user uploaded a new image
      if (imageFile) {
        finalImageUrl = await uploadProductImage(imageFile);
      }

      // Update product
      const res = await fetch("/api/products/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name,
          description,
          imageUrl: finalImageUrl,
          categoryId: categoryId || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Update failed");
        setLoading(false);
        return;
      }

      toast.success("Product updated!");
      if (onSuccess) onSuccess();
      setLoading(false);
    } catch (err) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl shadow-xl border border-slate-800 max-h-[80vh] flex flex-col">
      {/* HEADER - Fixed at top */}
      <div className="flex items-center gap-3 p-8 pb-4">
        <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg shadow-primary/20">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-400 to-blue-400 bg-clip-text text-transparent">
            Update Product
          </h2>
          <p className="text-sm text-slate-400">Modify your product details</p>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="overflow-y-auto px-8 pb-8 flex-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-6">
          {/* NAME */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-300 mb-2">
              <Package className="w-4 h-4 text-primary" />
              Product Name
            </label>
            <input
              type="text"
              className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 p-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-300 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Description
            </label>
            <textarea
              rows={4}
              className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 p-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-300 mb-2">
              <Tags className="w-4 h-4 text-primary" />
              Category (Optional)
            </label>
            <select
              className="w-full bg-slate-800/50 border border-slate-700 text-white p-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-slate-300 mb-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Product Image
            </label>

            {imagePreview ? (
              <div className="relative group">
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-xl border border-slate-700 bg-slate-800/50"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                  <label className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold shadow-lg hover:from-primary/90 hover:to-blue-600/90 transition-all">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-3 w-full text-slate-400 hover:text-slate-300 hover:underline text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

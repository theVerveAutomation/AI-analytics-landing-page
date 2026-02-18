"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Category } from "@/types";

interface UpdateCategoryFormProps {
  category: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateCategoryForm({
  category,
  onSuccess,
  onCancel,
}: UpdateCategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || "",
    image_url: category.image_url || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image_url || null,
  );

  const handleImageChange = (file?: File | null) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  async function uploadCategoryImage(file: File) {
    const ext = file.name.split(".").pop();
    const fileName = `categories/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("products") // Use 'products' bucket
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadCategoryImage(imageFile);
      }
      const { error } = await supabase
        .from("categories")
        .update({
          name: formData.name,
          description: formData.description,
          image_url: imageUrl,
        })
        .eq("id", category.id);
      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-4">Edit Category</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Category Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="e.g., Cameras, Servers, Accessories"
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1"
            placeholder="Brief description of the category..."
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <Label
            htmlFor="image"
            className="text-sm font-medium text-foreground"
          >
            Category Image (optional)
          </Label>
          {imagePreview ? (
            <div className="relative group mt-2">
              <Image
                src={imagePreview}
                alt="Category preview"
                className="w-full h-40 object-contain rounded-xl border border-slate-700 bg-slate-800/50"
                width={100}
                height={100}
              />
              <button
                onClick={handleRemoveImage}
                type="button"
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
              className="mt-2"
            />
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="flex-1"
          >
            {loading ? "Updating..." : "Update Category"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

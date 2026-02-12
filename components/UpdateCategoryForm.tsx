"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: formData.name,
          description: formData.description,
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

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AddCategoryForm from "@/components/AddCategoryForm";
import UpdateCategoryForm from "@/components/UpdateCategoryForm";
import ShopNavbar from "@/components/ShopNavbar";
import { Tags, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Category } from "@/types";
import Image from "next/image";
import { userLoginStore } from "@/store/loginUserStore";
import { toast } from "@/components/ui/sonner";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const profile = userLoginStore((state) => state.user);
  const loading = userLoginStore((state) => state.isLoading);

  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  async function deleteCategory(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
      return;
    }
    const res = await fetch(
      `/api/categories/delete?category_id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to delete category");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted successfully");
  }

  if (loading || !profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <span className="text-lg text-foreground font-medium">
            Loading categories...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 relative overflow-hidden">
      <ShopNavbar
        fullName={profile.full_name}
        role={profile.role}
        organizationLogo={profile.organization_logo}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 blur-lg opacity-40 rounded-2xl" />
            <div className="relative p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/20">
              <Tags className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              Category Management
            </h1>
            <p className="mt-1 text-muted-foreground">
              Organize products into categories
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-foreground uppercase">
                    Image Name
                  </th>
                  <th className="p-4 text-left text-xs font-bold text-foreground uppercase">
                    Description
                  </th>
                  <th className="p-4 text-left text-xs font-bold text-foreground uppercase">
                    Created
                  </th>
                  <th className="p-4 text-center text-xs font-bold text-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <Tags className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        No categories found
                      </p>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-contain w-12 h-12 border border-border bg-muted"
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-foreground">
                        {category.name}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {category.description}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {category?.created_at
                          ? new Date(category.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-4 text-center flex justify-center gap-2">
                        {/* EDIT */}
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-2 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 transition-colors"
                        >
                          ✏️
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 rounded-xl bg-destructive/20 hover:bg-destructive/30 border border-destructive/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-8 left-8 group z-40"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 blur-xl opacity-50 rounded-full group-hover:opacity-70 transition-opacity" />
        <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-full shadow-2xl shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all flex items-center gap-3">
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold text-lg">Go Back</span>
        </div>
      </button>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 group z-40"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 blur-xl opacity-50 rounded-full group-hover:opacity-70 transition-opacity" />
        <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-5 rounded-full shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all">
          <Plus className="w-7 h-7" />
        </div>
      </button>

      {/* ADD CATEGORY MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border shadow-2xl">
            <AddCategoryForm
              onSuccess={async () => {
                const { data } = await supabase
                  .from("categories")
                  .select("*")
                  .order("created_at", { ascending: false });

                setCategories(data || []);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border shadow-2xl">
            <UpdateCategoryForm
              category={editingCategory}
              onSuccess={async () => {
                const { data } = await supabase
                  .from("categories")
                  .select("*")
                  .order("created_at", { ascending: false });

                setCategories(data || []);
                setEditingCategory(null);
              }}
              onCancel={() => setEditingCategory(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

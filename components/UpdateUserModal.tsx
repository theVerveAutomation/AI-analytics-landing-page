"use client";

import { useState } from "react";
import { X, Save, User, Mail, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { Profile } from "@/types";

interface UpdateUserModalProps {
  user: Profile;
  onClose: () => void;
  onUpdated: () => void;
}

export default function UpdateUserModal({
  user,
  onClose,
  onUpdated,
}: UpdateUserModalProps) {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role || "user");
  const [organizationLogo, setOrganizationLogo] = useState(
    user.organization_logo || "",
  );
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(false);

  // async function handleLogoUpload(file: File) {
  //   setUploadingLogo(true);

  //   try {
  //     const ext = file.name.split(".").pop();
  //     const fileName = `logos/${crypto.randomUUID()}.${ext}`;

  //     const { error } = await supabase.storage
  //       .from("products")
  //       .upload(fileName, file, {
  //         contentType: file.type,
  //         upsert: false,
  //       });

  //     if (error) {
  //       toast.error(error.message);
  //       setUploadingLogo(false);
  //       return;
  //     }

  //     const { data } = supabase.storage.from("products").getPublicUrl(fileName);

  //     setOrganizationLogo(data.publicUrl);
  //     toast.success("Logo uploaded successfully!");
  //   } catch (err: unknown) {
  //     toast.error("Failed to upload logo");
  //   } finally {
  //     setUploadingLogo(false);
  //   }
  // }

  async function handleUpdate() {
    if (!username || !email || !role) {
      toast.error("Username, email, and role are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username,
          email,
          role,
          organization_logo: organizationLogo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Update failed");
        return;
      }

      toast.success("User updated successfully!");
      onUpdated();
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl border border-slate-800 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-between p-6 border-b border-slate-800 rounded-t-2xl z-10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Update User
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Organization Logo Upload */}
          {/* <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Organization Logo
            </label>

            <div className="flex items-center gap-4">
              {organizationLogo ? (
                <Image
                  src={organizationLogo}
                  alt="Organization Logo"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-slate-700 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                  No Logo
                </div>
              )}

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleLogoUpload(e.target.files[0]);
                    }
                  }}
                  disabled={uploadingLogo}
                  className="text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer disabled:opacity-50"
                />
                {uploadingLogo && (
                  <p className="text-xs text-primary mt-1 flex items-center gap-1">
                    <Upload className="w-3 h-3 animate-bounce" />
                    Uploading...
                  </p>
                )}
              </div>
            </div>
          </div> */}

          {/* Username */}
          <div>
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="user@example.com"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "user")}
                className="w-full pl-10 bg-slate-800/50 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md flex gap-3 p-6 border-t border-slate-800 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-700 bg-slate-800/50 text-slate-300 rounded-xl py-3 font-semibold hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading || uploadingLogo}
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

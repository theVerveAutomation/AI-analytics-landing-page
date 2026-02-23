"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ShopNavbar from "@/components/ShopNavbar";
import { UserPlus, Building2, Mail } from "lucide-react";
import { Organization } from "@/types";
import { userLoginStore } from "@/store/loginUserStore";
import { toast } from "sonner";

export default function UserRegistrationPage() {
  const router = useRouter();

  const profile = userLoginStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  const [orgId, setOrgId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formError, setFormError] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/organizations/fetch");
        const data = await res.json();
        if (res.ok && data.organizations) {
          setOrganizations(data.organizations);
        } else {
          setOrganizations([]);
        }
      } catch (err) {
        setOrganizations([]);
      }
      setLoading(false);
    };
    if (!profile) return;
    fetchOrganizations();
  }, [profile]);

  async function handleRegister() {
    if (
      !email ||
      !username ||
      !orgId ||
      !password ||
      !confirmPassword ||
      !fullName
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        username,
        organization_id: orgId,
        role: "user",
        services: selectedServices,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || "Registration failed");
      return;
    }

    setFormError("");
    toast.success("User created successfully!");
    // Reset form

    setOrgId("");
    setEmail("");
    setUsername("");
    setFullName("");
    setPassword("");
    setConfirmPassword("");
    setSelectedServices([]);

    router.push("/panels/admin/users");
  }

  if (loading || !profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-lg text-slate-300 font-medium">
            Loading user registration...
          </span>
        </div>
      </div>
    );
  }

  // async function handleLogoUpload(file: File) {
  //   setUploadingLogo(true);

  //   const ext = file.name.split(".").pop();
  //   const fileName = `logos/${crypto.randomUUID()}.${ext}`;

  //   const { error } = await supabase.storage
  //     .from("products")
  //     .upload(fileName, file, {
  //       contentType: file.type,
  //       upsert: false,
  //     });

  //   if (error) {
  //     alert(error.message);
  //     setUploadingLogo(false);
  //     return;
  //   }

  //   const { data } = supabase.storage.from("products").getPublicUrl(fileName);

  //   setOrganizationLogo(data.publicUrl);
  //   setUploadingLogo(false);
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 mt-20 relative overflow-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <ShopNavbar
        fullName={profile.full_name}
        role={profile.role}
        organizationLogo={profile.organization_logo}
      />

      <div className="flex items-center justify-center py-8 px-6 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg shadow-primary/20 mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-400 to-blue-400 bg-clip-text text-transparent mb-2">
              User Registration
            </h1>
            <p className="text-slate-400">
              Register a new user under your organization
            </p>
          </div>

          {/* Form */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-8">
            <form className="space-y-4">
              {/* Organization Dropdown */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Organization
                </label>
                <select
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
                >
                  <option value="">Select organization...</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organization Name */}
              {/* <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
              </div> */}

              {/* Organization Logo */}
              {/* <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Organization Logo
                </label>

                <div className="flex items-center gap-4">
                  {organizationLogo ? (
                    <Image
                      src={organizationLogo}
                      alt="Organization Logo"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-sm">
                      No Logo
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleLogoUpload(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div> */}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {formError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-3 border border-slate-700 bg-slate-800/50 text-slate-300 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleRegister}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

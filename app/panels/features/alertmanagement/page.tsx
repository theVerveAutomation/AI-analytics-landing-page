"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Check,
  Bell,
  Sparkles,
  Eye,
  Activity,
  UserCheck,
  AlertTriangle,
  X,
  Clock,
  Camera,
  MapPin,
} from "lucide-react";
import { FeatureAlert, AlertType, Profile } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import PhoneNumberManager, {
  AlertContact,
} from "@/components/PhoneNumberManager";

type AlertChannel = "whatsapp" | "telegram" | null;

const featureAlertsData: FeatureAlert[] = [
  {
    id: "object-detection",
    name: "Object Detection",
    description: "Alerts triggered when specific objects are detected",
    icon: <Eye className="w-5 h-5" />,
    alertCount: 24,
    color: "blue",
    lastAlert: "2 min ago",
    recentAlerts: [
      {
        id: "od-1",
        timestamp: "2 min ago",
        camera: "Cam 1 - Main Entrance",
        location: "Building A - Front Gate",
        description: "Suspicious package detected near entrance.",
        imageUrl: "/placeholder-alert-1.jpg",
      },
      {
        id: "od-2",
        timestamp: "15 min ago",
        camera: "Cam 3 - Parking Lot",
        location: "Building A - Parking Area",
        description:
          "Unattended package detected near entrance. Security team has been notified for inspection.",
        imageUrl: "/placeholder-alert-2.jpg",
      },
      {
        id: "od-3",
        timestamp: "1 hour ago",
        camera: "Cam 5 - Warehouse",
        location: "Building B - Storage",
        description:
          "Forklift operating in restricted hours. Equipment movement detected outside scheduled time.",
        imageUrl: "/placeholder-alert-3.jpg",
      },
    ],
  },
  {
    id: "motion-detection",
    name: "Motion Detection",
    description: "Alerts triggered when motion is detected",
    icon: <Activity className="w-5 h-5" />,
    alertCount: 18,
    color: "cyan",
    lastAlert: "5 min ago",
    recentAlerts: [
      {
        id: "md-1",
        timestamp: "5 min ago",
        camera: "Cam 2 - Back Door",
        location: "Building A - Rear Exit",
        description:
          "Motion detected in restricted area after hours. Movement pattern suggests human activity near emergency exit.",
        imageUrl: "/placeholder-alert-4.jpg",
      },
      {
        id: "md-2",
        timestamp: "20 min ago",
        camera: "Cam 4 - Server Room",
        location: "Building C - IT Department",
        description:
          "Unexpected motion in server room. Access log shows no scheduled maintenance.",
        imageUrl: "/placeholder-alert-5.jpg",
      },
    ],
  },
  {
    id: "face-recognition",
    name: "Human Recognition",
    description: "Alerts triggered when faces are recognized",
    icon: <UserCheck className="w-5 h-5" />,
    alertCount: 7,
    color: "purple",
    lastAlert: "12 min ago",
    recentAlerts: [
      {
        id: "fr-1",
        timestamp: "12 min ago",
        camera: "Cam 1 - Main Entrance",
        location: "Building A - Reception",
        description:
          "Unknown person detected attempting entry. Face not matching any registered employee or visitor database.",
        imageUrl: "/placeholder-alert-6.jpg",
      },
      {
        id: "fr-2",
        timestamp: "45 min ago",
        camera: "Cam 6 - Executive Floor",
        location: "Building A - Floor 5",
        description:
          "Employee John Smith recognized outside authorized hours. Last scheduled shift ended at 6:00 PM.",
        imageUrl: "/placeholder-alert-7.jpg",
      },
    ],
  },
];

export default function AlertsPage() {
  const router = useRouter();
  const [selectedChannel, setSelectedChannel] = useState<AlertChannel>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureAlert | null>(
    null
  );
  const [featureAlerts] = useState<FeatureAlert[]>(featureAlertsData);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>();
  const [selectedPlatform, setSelectedPlatform] = useState<AlertType | null>(
    null
  );
  const [phoneNumbers, setPhoneNumbers] = useState<
    Record<AlertType, AlertContact[]>
  >({
    SMS: [],
    WHATSAPP: [],
    WECHAT: [],
    TELEGRAM: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.push("/Login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*, organizations!inner(id, alerts)")
        .eq("id", user.id)
        .single();

      if (!profile) {
        router.push("/Login");
        return;
      }

      // Fetch phone numbers from organization_alert_numbers table
      const { data: alertNumbers } = await supabase
        .from("organization_alert_numbers")
        .select("name, phone_number, alert_type")
        .eq("org_id", profile.organizations.id);

      // Group phone numbers by alert type
      const groupedNumbers = {
        SMS: [],
        WHATSAPP: [],
        WECHAT: [],
        TELEGRAM: [],
      } as Record<AlertType, AlertContact[]>;

      alertNumbers?.forEach(({ name, phone_number, alert_type }) => {
        if (groupedNumbers[alert_type as AlertType]) {
          groupedNumbers[alert_type as AlertType].push({
            name: name || "",
            phoneNumber: phone_number,
          });
        }
      });

      setProfile(profile);
      setPhoneNumbers(groupedNumbers);
      setLoading(false);
    };
    fetchUserAndProfile();
  }, [router]);

  const addPhoneNumber = (platform: AlertType, contact: AlertContact) => {
    if (
      contact.phoneNumber &&
      !phoneNumbers[platform].some((c) => c.phoneNumber === contact.phoneNumber)
    ) {
      setPhoneNumbers((prev) => ({
        ...prev,
        [platform]: [...prev[platform], contact],
      }));
    }
  };

  const removePhoneNumber = (platform: AlertType, index: number) => {
    setPhoneNumbers((prev) => ({
      ...prev,
      [platform]: prev[platform].filter((_, i) => i !== index),
    }));
  };

  const savePhoneNumbers = async () => {
    if (!profile?.organizations?.id) return;

    setSaving(true);
    try {
      const orgId = profile.organizations.id;

      // Delete existing numbers for this platform
      const { error: deleteError } = await supabase
        .from("organization_alert_numbers")
        .delete()
        .eq("org_id", orgId)
        .eq("alert_type", selectedPlatform);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new numbers if any
      if (phoneNumbers[selectedPlatform!].length > 0) {
        const numbersToInsert = phoneNumbers[selectedPlatform!].map(
          (contact) => ({
            org_id: orgId,
            name: contact.name,
            phone_number: contact.phoneNumber,
            alert_type: selectedPlatform,
          })
        );

        const { error: insertError } = await supabase
          .from("organization_alert_numbers")
          .insert(numbersToInsert);

        if (insertError) {
          throw insertError;
        }
      }

      setSelectedPlatform(null);
    } catch (error) {
      console.error("Error saving phone numbers:", error);
      // You might want to show a toast notification here
    } finally {
      setSaving(false);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          icon: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-700",
          badge: "bg-blue-500",
          header: "from-blue-500 to-blue-600",
        };
      case "cyan":
        return {
          bg: "bg-cyan-100 dark:bg-cyan-900/30",
          icon: "text-cyan-600 dark:text-cyan-400",
          border: "border-cyan-200 dark:border-cyan-700",
          badge: "bg-cyan-500",
          header: "from-cyan-500 to-sky-600",
        };
      case "purple":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          icon: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-700",
          badge: "bg-purple-500",
          header: "from-purple-500 to-indigo-600",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-slate-700",
          icon: "text-gray-600 dark:text-gray-400",
          border: "border-gray-200 dark:border-slate-600",
          badge: "bg-gray-500",
          header: "from-gray-500 to-slate-600",
        };
    }
  };

  const getAlertConfig = (type: AlertType) => {
    switch (type) {
      case "SMS":
        return {
          icon: MessageCircle,
          activeColors:
            "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700",
          iconBg: "bg-blue-500",
          textColors: "text-blue-800 dark:text-blue-200",
          statusColors: "text-blue-600 dark:text-blue-300",
        };
      case "WHATSAPP":
        return {
          icon: MessageCircle,
          activeColors:
            "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700",
          iconBg: "bg-green-500",
          textColors: "text-green-800 dark:text-green-200",
          statusColors: "text-green-600 dark:text-green-300",
        };
      case "WECHAT":
        return {
          icon: MessageCircle,
          activeColors:
            "from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700",
          iconBg: "bg-purple-500",
          textColors: "text-purple-800 dark:text-purple-200",
          statusColors: "text-purple-600 dark:text-purple-300",
        };
      case "TELEGRAM":
        return {
          icon: Send,
          activeColors:
            "from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30 border-cyan-200 dark:border-cyan-700",
          iconBg: "bg-cyan-500",
          textColors: "text-cyan-800 dark:text-cyan-200",
          statusColors: "text-cyan-600 dark:text-cyan-300",
        };
    }
  };

  const totalAlerts = featureAlerts.reduce((sum, f) => sum + f.alertCount, 0);

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Hero Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Alert Settings
            </h1>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-15">
          Configure how you want to receive real-time notifications
        </p>
      </div>

      {/* Organization Alert Status */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Organization Alert Status
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current alert types enabled for your organization
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-300 dark:bg-slate-600 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-16"></div>
                  </div>
                </div>
              ))
            : (["SMS", "WHATSAPP", "WECHAT", "TELEGRAM"] as AlertType[]).map(
                (alertType) => {
                  const isActive =
                    profile?.organizations?.alerts?.includes(alertType) ||
                    false;
                  const config = getAlertConfig(alertType);
                  const IconComponent = config.icon;

                  return (
                    <div
                      key={alertType}
                      onClick={() => isActive && setSelectedPlatform(alertType)}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 relative ${
                        isActive
                          ? `bg-gradient-to-br ${config.activeColors} cursor-pointer hover:shadow-md hover:-translate-y-0.5`
                          : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700/50 dark:to-slate-600/50 border-gray-200 dark:border-slate-600"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-white/20 rounded-full text-gray-600 dark:text-gray-300">
                          Configure
                        </div>
                      )}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                          isActive
                            ? config.iconBg
                            : "bg-gray-400 dark:bg-slate-500"
                        }`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            isActive
                              ? config.textColors
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {alertType === "WHATSAPP"
                            ? "WhatsApp"
                            : alertType === "WECHAT"
                            ? "WeChat"
                            : alertType}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isActive
                                ? "bg-green-500 animate-pulse"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span
                            className={`text-xs ${
                              isActive
                                ? config.statusColors
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {isActive
                              ? `Active (${
                                  phoneNumbers[alertType]?.length || 0
                                } numbers)`
                              : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
        </div>
      </div>

      {/* Phone Number Configuration Modal */}
      {selectedPlatform && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-2xl overflow-hidden">
            <div
              className={`bg-gradient-to-r ${
                getAlertConfig(selectedPlatform).activeColors.includes("blue")
                  ? "from-blue-500 to-blue-600"
                  : getAlertConfig(selectedPlatform).activeColors.includes(
                      "green"
                    )
                  ? "from-green-500 to-green-600"
                  : getAlertConfig(selectedPlatform).activeColors.includes(
                      "purple"
                    )
                  ? "from-purple-500 to-purple-600"
                  : "from-cyan-500 to-cyan-600"
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {getAlertConfig(selectedPlatform).icon === Send ? (
                      <Send className="w-5 h-5 text-white" />
                    ) : (
                      <MessageCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Configure{" "}
                      {selectedPlatform === "WHATSAPP"
                        ? "WhatsApp"
                        : selectedPlatform === "WECHAT"
                        ? "WeChat"
                        : selectedPlatform}{" "}
                      Numbers
                    </h2>
                    <p className="text-white/80 text-sm">
                      Manage phone numbers for alert notifications
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <PhoneNumberManager
                platform={selectedPlatform}
                phoneNumbers={phoneNumbers[selectedPlatform]}
                onAdd={addPhoneNumber}
                onRemove={removePhoneNumber}
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePhoneNumbers}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Numbers"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Alerts Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Feature Alerts
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alert counts by detection feature
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {totalAlerts}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Alerts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featureAlerts.map((feature) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className={`p-4 rounded-xl border ${colors.border} ${colors.bg} transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm`}
                  >
                    <span className={colors.icon}>{feature.icon}</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full ${colors.badge} text-white text-sm font-bold`}
                  >
                    {feature.alertCount}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {feature.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Last alert: {feature.lastAlert}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Details Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div
              className={`bg-gradient-to-r ${
                getColorClasses(selectedFeature.color).header
              } p-6`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white">{selectedFeature.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedFeature.name}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {selectedFeature.alertCount} alerts • Last:{" "}
                      {selectedFeature.lastAlert}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Recent Alerts
              </h3>
              <div className="space-y-4">
                {selectedFeature.recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Alert Image */}
                      <div className="md:w-64 h-48 md:h-auto bg-gray-900 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              Alert Snapshot
                            </p>
                          </div>
                        </div>
                        {/* Timestamp overlay */}
                        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                          {alert.timestamp}
                        </div>
                      </div>

                      {/* Alert Details */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{alert.timestamp}</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getColorClasses(selectedFeature.color).badge
                            } text-white`}
                          >
                            Alert
                          </span>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Camera className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-800 dark:text-white">
                              {alert.camera}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {alert.location}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {alert.description}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1.5 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                            View Full Image
                          </button>
                          <button className="px-3 py-1.5 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                            Mark as Reviewed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
          Need Help?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Having trouble setting up alerts? Contact our support team.
        </p>
      </div>
    </div>
  );
}

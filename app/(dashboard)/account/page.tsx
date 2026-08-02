"use client";

import { useState, useEffect } from "react";
import {
  User as UserIcon,
  ShieldCheck,
  CreditCard,
  BookOpen,
  Settings,
  Sparkles,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  MapPin,
  Tag,
  GraduationCap,
  Compass,
  Bell,
  Lock,
  ExternalLink
} from "lucide-react";
import { getFullUserAccount, updateStudentAccount } from "@/lib/actions/user.actions";

export default function StudentAccountPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "courses" | "settings">("profile");
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  // AI & Notification State
  const [aiProvider, setAiProvider] = useState<string>("local");
  const [aiApiKey, setAiApiKey] = useState<string>("");
  const [aiModel, setAiModel] = useState<string>("deepseek-r1");
  const [notifEmail, setNotifEmail] = useState<boolean>(false);
  const [notifAnnounce, setNotifAnnounce] = useState<boolean>(true);

  const fetchUserAccount = async () => {
    setLoading(true);
    try {
      const res = await getFullUserAccount();
      if (res && res.success && res.user) {
        const u = res.user;
        setUser(u);
        setFirstName(u.firstName || "");
        setLastName(u.lastName || "");
        setUsername(u.username || "");
        setBio(u.bio || "");
        setLocation(u.location || "");
        setAiProvider(u.aiSettings?.provider || "local");
        setAiApiKey(u.aiSettings?.apiKey || "");
        setAiModel(u.aiSettings?.defaultModel || "deepseek-r1");
        setNotifEmail(u.notificationSettings?.emailNotifications || false);
        setNotifAnnounce(u.notificationSettings?.announcements ?? true);
      }
    } catch (err) {
      console.error("Failed to load account:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccount();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await updateStudentAccount({
        firstName,
        lastName,
        username,
        bio,
        location,
        aiSettings: {
          provider: aiProvider,
          apiKey: aiApiKey,
          defaultModel: aiModel,
        },
        notificationSettings: {
          emailNotifications: notifEmail,
          announcements: notifAnnounce,
        },
      });

      if (res.success) {
        setUser(res.user);
        setSaveMessage({ type: "success", text: "Account profile updated successfully!" });
      } else {
        setSaveMessage({ type: "error", text: res.error || "Failed to update profile" });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message || "Failed to save settings" });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-sm font-mono text-amber-400">
          <RefreshCw size={20} className="animate-spin" /> Loading Account Dashboard...
        </div>
      </div>
    );
  }

  const membershipStatus = user?.membershipStatus || (user?.role === "student" || user?.role === "admin" ? "active" : "free");
  const isActiveMember = membershipStatus === "active" || user?.role === "admin" || user?.role === "student";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "S"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.email}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    isActiveMember
                      ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                      : "bg-slate-900 border border-slate-800 text-slate-400"
                  }`}>
                    {isActiveMember ? "★ Active Student Member" : "Free Member"}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Message Alert */}
      {saveMessage && (
        <div className={`max-w-6xl mx-auto mb-6 p-4 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 ${
          saveMessage.type === "success"
            ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
            : "bg-rose-950/80 border-rose-800 text-rose-300"
        }`}>
          {saveMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === "profile"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg"
                : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200"
            }`}
          >
            <UserIcon size={16} /> Profile Details
          </button>

          <button
            onClick={() => setActiveTab("subscription")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeTab === "subscription"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg"
                : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard size={16} /> GrooveSell Billing
            </div>
            {isActiveMember && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-between cursor-pointer ${
              activeTab === "courses"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg"
                : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={16} /> Enrolled Access
            </div>
            <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-amber-400 font-bold">
              {(user?.purchasedCourses?.length || 0) + (user?.enrolledNiches?.length || 0)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === "settings"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg"
                : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200"
            }`}
          >
            <Settings size={16} /> AI & Notifications
          </button>
        </div>

        {/* Content Workspace */}
        <div className="lg:col-span-9">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm min-h-[500px]">

            {/* TAB 1: PROFILE DETAILS */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-800">
                  <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                    <UserIcon className="text-amber-400" size={20} /> Personal Profile Settings
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Manage your public identity and profile credentials</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Austin, TX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase">Bio / Elevator Pitch</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a short bio with fellow academy members..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GROOVESELL BILLING & SUBSCRIPTION */}
            {activeTab === "subscription" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-800">
                  <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                    <CreditCard className="text-amber-400" size={20} /> GrooveSell Membership & Billing
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Your active subscriptions and GrooveSell digital product access</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                    <div>
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold">Membership Tier</span>
                      <h3 className="text-lg font-black text-slate-100 uppercase mt-0.5">
                        {isActiveMember ? "Pro Student Access" : "Free Access Plan"}
                      </h3>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                      isActiveMember
                        ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                        : "bg-slate-900 border border-slate-800 text-slate-400"
                    }`}>
                      Status: {membershipStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-400 uppercase font-bold">Unlocked GrooveSell Products</span>
                    {user?.activeGrooveSellProducts && user.activeGrooveSellProducts.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {user.activeGrooveSellProducts.map((p: string, idx: number) => (
                          <span key={idx} className="bg-slate-900 border border-slate-800 text-amber-400 px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                            <Tag size={12} /> {p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-slate-500 italic">No specific GrooveSell product IDs attached yet.</p>
                    )}
                  </div>

                  {!isActiveMember && (
                    <div className="pt-4 border-t border-slate-800/80">
                      <a
                        href="/admin/groovesell"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
                      >
                        <ExternalLink size={14} /> Upgrade via GrooveSell Checkout
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ENROLLED COURSES & NICHES */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-800">
                  <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                    <GraduationCap className="text-amber-400" size={20} /> My Learning Vault & Enrolled Courses
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Courses and Niche Boxes unlocked on your account</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Purchased Courses</h3>
                  {user?.purchasedCourses && user.purchasedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.purchasedCourses.map((c: any) => (
                        <div key={c._id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                          <span className="font-bold text-slate-100 text-sm truncate">{c.title || "Course Access"}</span>
                          <a href={`/courses/${c._id}`} className="text-amber-400 text-xs font-mono font-bold hover:underline">
                            Open →
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-xs font-mono text-slate-500">
                      No courses unlocked yet. Browse the course catalog to enroll!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: AI & NOTIFICATION SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-800">
                  <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={20} /> AI Configuration & Notifications
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">Configure your personal AI preferences and notification delivery</p>
                </div>

                <div className="space-y-5">
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Key size={14} /> AI Provider Settings
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-400 font-bold uppercase">AI Provider</label>
                        <select
                          value={aiProvider}
                          onChange={(e) => setAiProvider(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-100 focus:border-amber-500 focus:outline-none"
                        >
                          <option value="local">Local Default Engine</option>
                          <option value="openrouter">OpenRouter / Custom API Key</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-400 font-bold uppercase">Default AI Model</label>
                        <input
                          type="text"
                          value={aiModel}
                          onChange={(e) => setAiModel(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {aiProvider === "openrouter" && (
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-mono text-slate-400 font-bold uppercase">OpenRouter / OpenAI API Key</label>
                          <input
                            type="password"
                            value={aiApiKey}
                            onChange={(e) => setAiApiKey(e.target.value)}
                            placeholder="sk-or-..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-100 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Bell size={14} /> Notification Preferences
                    </h3>

                    <label className="flex items-center gap-3 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifEmail}
                        onChange={(e) => setNotifEmail(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Receive email notifications for course updates & announcements</span>
                    </label>

                    <label className="flex items-center gap-3 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifAnnounce}
                        onChange={(e) => setNotifAnnounce(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Show platform announcements on dashboard</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

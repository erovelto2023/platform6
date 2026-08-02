"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CreditCard,
  Edit,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  Save,
  Tag,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X
} from "lucide-react";
import { getAllStudentsAdmin, updateStudentByAdmin } from "@/lib/actions/user.actions";

interface StudentAccount {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role: "admin" | "student" | "free";
  membershipStatus?: "free" | "active" | "cancelled" | "refunded";
  activeGrooveSellProducts?: string[];
  hasAccess?: string[];
  purchasedCourses?: any[];
  enrolledNiches?: any[];
  isShadowBanned?: boolean;
  lastActiveAt?: string;
  createdAt: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected Student for Editing Modal
  const [editingStudent, setEditingStudent] = useState<StudentAccount | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [newProductId, setNewProductId] = useState<string>("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getAllStudentsAdmin();
      if (res && res.success && res.students) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSaveStudentEdit = async () => {
    if (!editingStudent) return;
    setSaving(true);
    try {
      const res = await updateStudentByAdmin(editingStudent._id, {
        role: editingStudent.role,
        membershipStatus: editingStudent.membershipStatus || "free",
        activeGrooveSellProducts: editingStudent.activeGrooveSellProducts || [],
        hasAccess: editingStudent.hasAccess || [],
        isShadowBanned: editingStudent.isShadowBanned || false,
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
      });

      if (res.success) {
        fetchStudents();
        setEditingStudent(null);
      } else {
        alert("Failed to update student: " + res.error);
      }
    } catch (err: any) {
      alert("Error saving student edits: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddProductToStudent = () => {
    if (!newProductId.trim() || !editingStudent) return;
    const prod = newProductId.trim();
    const currentProds = editingStudent.activeGrooveSellProducts || [];
    if (!currentProds.includes(prod)) {
      const currentAccess = editingStudent.hasAccess || [];
      setEditingStudent({
        ...editingStudent,
        activeGrooveSellProducts: [...currentProds, prod],
        hasAccess: currentAccess.includes(prod) ? currentAccess : [...currentAccess, prod],
      });
    }
    setNewProductId("");
  };

  const handleRemoveProductFromStudent = (prod: string) => {
    if (!editingStudent) return;
    setEditingStudent({
      ...editingStudent,
      activeGrooveSellProducts: (editingStudent.activeGrooveSellProducts || []).filter((p) => p !== prod),
      hasAccess: (editingStudent.hasAccess || []).filter((p) => p !== prod),
    });
  };

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.username || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || s.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || (s.membershipStatus || "free") === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalStudentsCount = students.length;
  const activeProCount = students.filter(
    (s) => s.membershipStatus === "active" || s.role === "student"
  ).length;
  const freeCount = students.filter((s) => (s.membershipStatus || "free") === "free" && s.role !== "admin").length;
  const adminCount = students.filter((s) => s.role === "admin").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-slate-900 to-amber-950/60 border border-indigo-500/30 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                <Users size={14} /> Student & Member Management Console
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
                Student <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">Accounts</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-lg font-medium mt-2 max-w-2xl leading-relaxed">
                Manage student profiles, roles, GrooveSell membership access, and course enrollments across the entire platform.
              </p>
            </div>

            <button
              onClick={fetchStudents}
              className="px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-indigo-500 text-indigo-400 hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Accounts
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Total Accounts</span>
          <p className="text-2xl font-black text-slate-100 mt-1">{totalStudentsCount}</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Active Pro Members</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{activeProCount}</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Free Tier</span>
          <p className="text-2xl font-black text-slate-300 mt-1">{freeCount}</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-mono text-amber-400 uppercase font-bold">Platform Admins</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{adminCount}</p>
        </div>
      </div>

      {/* Main Table Workspace */}
      <div className="max-w-7xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or username..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Filter size={14} />
              <span>Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="free">Free</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="free">Free</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-indigo-400" /> Loading student accounts...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 bg-slate-950/40 rounded-2xl">
            No student accounts match the search/filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Student Name & Email</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">GrooveSell Status</th>
                  <th className="pb-3 px-3">Unlocked Products</th>
                  <th className="pb-3 px-3">Joined Date</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((student) => {
                  const isPro = student.membershipStatus === "active" || student.role === "student" || student.role === "admin";
                  return (
                    <tr key={student._id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-100 text-sm">
                          {student.firstName || student.lastName
                            ? `${student.firstName || ""} ${student.lastName || ""}`
                            : student.username || "Student Account"}
                        </div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          student.role === "admin"
                            ? "bg-amber-950 border border-amber-800 text-amber-400"
                            : student.role === "student"
                            ? "bg-indigo-950 border border-indigo-800 text-indigo-400"
                            : "bg-slate-950 border border-slate-800 text-slate-400"
                        }`}>
                          {student.role}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          isPro
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                            : "bg-slate-950 text-slate-400 border border-slate-800"
                        }`}>
                          ● {student.membershipStatus || "free"}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {(student.activeGrooveSellProducts || []).length > 0 ? (
                            student.activeGrooveSellProducts?.map((p, idx) => (
                              <span key={idx} className="bg-slate-950 border border-slate-800 text-[10px] text-amber-400 px-2 py-0.5 rounded">
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-600 text-[11px]">None</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 text-indigo-400 hover:text-white text-xs font-mono font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit size={13} /> Edit Account
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT STUDENT ACCOUNT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="text-indigo-400" size={20} /> Edit Student Account
                </h3>
                <p className="text-xs font-mono text-slate-400">{editingStudent.email}</p>
              </div>

              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">Account Role</label>
                  <select
                    value={editingStudent.role}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, role: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="student">student (Full Student Access)</option>
                    <option value="free">free (Free Tier)</option>
                    <option value="admin">admin (Platform Administrator)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase">GrooveSell Status</label>
                  <select
                    value={editingStudent.membershipStatus || "free"}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, membershipStatus: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="active">active (Active Subscriber)</option>
                    <option value="free">free (Free Member)</option>
                    <option value="cancelled">cancelled (Subscription Cancelled)</option>
                    <option value="refunded">refunded (Refunded)</option>
                  </select>
                </div>
              </div>

              {/* Product Access Manager */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <label className="text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1.5">
                  <Tag size={14} /> Unlocked GrooveSell Product Access
                </label>

                <div className="flex flex-wrap gap-2">
                  {(editingStudent.activeGrooveSellProducts || []).map((prod) => (
                    <span
                      key={prod}
                      className="bg-slate-900 border border-slate-800 text-amber-300 px-3 py-1 rounded-xl text-xs font-mono flex items-center gap-2"
                    >
                      <span>{prod}</span>
                      <button
                        onClick={() => handleRemoveProductFromStudent(prod)}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newProductId}
                    onChange={(e) => setNewProductId(e.target.value)}
                    placeholder="e.g. prod_scale_pro or groovesell_member"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddProductToStudent}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold shrink-0 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Shadowban Toggle */}
              <label className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-3 rounded-2xl text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingStudent.isShadowBanned || false}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, isShadowBanned: e.target.checked })
                  }
                  className="rounded border-slate-800 bg-slate-900 text-rose-500 focus:ring-rose-500"
                />
                <span>Shadowban Student (Restricts community visibility)</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveStudentEdit}
                disabled={saving}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Student Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

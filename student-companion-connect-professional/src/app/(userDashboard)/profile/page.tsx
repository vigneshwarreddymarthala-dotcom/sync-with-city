"use client";

import Notify, { showToast } from "@/components/notify";
import { UserInfo } from "@/models/user.model";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import locList from "@/db/location.json";

export default function UserProfile() {
  const [authToken, setAuthToken] = useState<string>("");
  const [isUsr, setIsUsr] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"identity" | "heritage" | "bio" | "social" | "privacy">("identity");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { register, reset, handleSubmit, watch, setValue } = useForm<UserInfo>({
    defaultValues: {
      gender: "Male",
      discoverable: true,
      womenOnly: false,
      location: "Stuttgart",
      locationIndia: "Telangana",
      language: "Telugu",
    },
  });

  const upTypes = ["jpg", "jpeg", "png", "gif", "webp"];

  const fullName = watch("fullName") || "";
  const usrEmail = watch("usrEmail") || "";
  const location = watch("location") || "Stuttgart";
  const locationIndia = watch("locationIndia") || "Telangana";
  const language = watch("language") || "Telugu";
  const company = watch("company") || "";
  const profession = watch("profession") || "";
  const hobbies = watch("hobbies") || "";
  const description = watch("description") || "";
  const usrImg = watch("usrImg");
  const discoverable = watch("discoverable");
  const gender = watch("gender");

  // Calculate profile completeness score
  const completenessScore = useMemo(() => {
    let score = 0;
    if (fullName) score += 15;
    if (usrImg) score += 20;
    if (locationIndia && locationIndia !== "-") score += 15;
    if (language && language !== "-") score += 15;
    if (company) score += 10;
    if (profession) score += 10;
    if (description) score += 10;
    if (hobbies) score += 5;
    return Math.min(score, 100);
  }, [fullName, usrImg, locationIndia, language, company, profession, description, hobbies]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("LogInSCCTkn");
      if (token) setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const getUsr = async () => {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      };

      try {
        const res: any = await fetch(endpoint, options);
        const pInfo: any = await res.json();

        if (res.status === 200) {
          reset(pInfo);
          setIsUsr(true);
        } else {
          showToast(pInfo.error || "Failed to load user profile", "error");
        }
      } catch (e: any) {
        showToast(e?.message || "Failed to load profile", "error");
      }
    };

    if (authToken) getUsr();
  }, [authToken, reset]);

  const getImgPath = (img?: string) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  const addImg = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !upTypes.includes(ext)) {
      showToast("File must be jpg, jpeg, png, gif, or webp!", "error");
      return;
    }

    if (file.size >= 4 * 1024 * 1024) {
      showToast("Image must be under 4 MB!", "error");
      return;
    }

    // Local instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    try {
      const uFrm = new FormData();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
      uFrm.append("file", file, sanitizedName);
      uFrm.append("userImg", file, sanitizedName);

      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user/upload`;
      const options = {
        method: "POST",
        headers: {
          authorization: authToken,
        },
        body: uFrm,
      };

      showToast("Uploading new photo...", "info");

      const res = await fetch(endpoint, options);
      const data = await res.json();

      if (res.status === 200) {
        const uploadedFilename = typeof data === "string" ? data : (data.filename || data.url);
        setValue("usrImg", uploadedFilename);
        showToast("Profile photo uploaded successfully!", "success");
      } else {
        showToast("Failed to upload image. Please try again.", "error");
      }
    } catch (error: any) {
      showToast(error?.message || "Upload failed", "error");
    }
  };

  const updateProf = async (data: UserInfo) => {
    setIsSaving(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_PATH}user`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          ...data,
          location: data.location || "Stuttgart",
          locationIndia: data.locationIndia || "Telangana",
          language: data.language || "Telugu",
        }),
      };

      const res = await fetch(endpoint, options);
      const pInfo = await res.json();

      if (res.status === 202 || res.status === 200) {
        showToast("Profile updated successfully!", "success");
      } else {
        showToast(pInfo?.error || pInfo || "Failed to update profile", "error");
      }
    } catch (e: any) {
      showToast(e?.message || "Error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <Notify />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* TOP HERO PROFILE HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-sm transition-all">
          {/* Decorative Gradient Background */}
          <div className="h-44 sm:h-52 bg-gradient-to-r from-orange/90 via-amber-500 to-orange relative">
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Student
              </span>
            </div>
          </div>

          {/* Profile Quick Info Bar */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar with Camera Button */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group size-32 sm:size-36 rounded-2xl p-1 bg-white shadow-xl ring-4 ring-white">
                <div className="size-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative">
                  {previewImage || (usrImg && usrImg !== "default-avatar.jpg") ? (
                    <Image
                      src={previewImage || getImgPath(usrImg)}
                      alt={fullName || "Profile Avatar"}
                      width={144}
                      height={144}
                      className="size-full object-cover object-center"
                    />
                  ) : (
                    <div className="size-full bg-gradient-to-tr from-orange to-amber-400 text-white font-extrabold text-4xl flex items-center justify-center">
                      {fullName ? fullName.charAt(0).toUpperCase() : "S"}
                    </div>
                  )}

                  {/* Upload overlay */}
                  <label
                    htmlFor="profilePhotoUpload"
                    className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
                  >
                    <svg className="size-7 fill-current" viewBox="0 0 24 24">
                      <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                    <span className="text-xs font-medium mt-1">Change Photo</span>
                  </label>
                  <input
                    type="file"
                    id="profilePhotoUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={addImg}
                  />
                </div>

                <label
                  htmlFor="profilePhotoUpload"
                  className="absolute -bottom-2 -right-2 size-9 rounded-xl bg-orange text-white shadow-md flex items-center justify-center hover:bg-orange/90 transition cursor-pointer"
                  title="Upload New Photo"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {fullName || "Student Profile"}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ Verified Student
                  </span>
                </div>

                <p className="text-sm text-slate-600 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="flex items-center gap-1 text-slate-700">
                    <svg className="size-4 text-orange fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {location}, Germany
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    🇮🇳 {locationIndia}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    🗣️ {language}
                  </span>
                </p>

                {company && (
                  <p className="text-xs text-slate-500 font-medium">
                    🎓 {company} {profession ? `• ${profession}` : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions & Navigation */}
            <div className="flex flex-wrap items-center gap-2.5 self-center md:self-end">
              <Link
                href="/friends"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                My Friends
              </Link>

              <Link
                href="/message"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                Messages
              </Link>

              <button
                type="button"
                onClick={handleSubmit(updateProf)}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange hover:bg-orange/90 shadow-md shadow-orange/20 transition cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin size-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="size-4 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Completeness Bar */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-semibold text-slate-700 whitespace-nowrap">Profile Completeness</span>
              <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completenessScore}%` }}
                ></div>
              </div>
              <span className="font-bold text-orange">{completenessScore}%</span>
            </div>
            <p className="text-slate-500 text-center sm:text-right">
              {completenessScore < 100
                ? "💡 Add your university, native state & bio to get discovered by Indian students."
                : "🎉 Your student profile is complete and fully discoverable!"}
            </p>
          </div>
        </div>

        {/* MAIN BODY GRID: NAVIGATION TABS & FORM CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: NAVIGATION TABS */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("identity")}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === "identity"
                    ? "bg-orange text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="size-5 fill-current shrink-0" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Student Identity</span>
                </div>
                <span className="text-xs opacity-75 hidden sm:inline">Basic Info</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("heritage")}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === "heritage"
                    ? "bg-orange text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg shrink-0">🇮🇳</span>
                  <span>Indian Heritage</span>
                </div>
                <span className="text-xs opacity-75 hidden sm:inline">State & Tongue</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bio")}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === "bio"
                    ? "bg-orange text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="size-5 fill-current shrink-0" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span>Bio & Passions</span>
                </div>
                <span className="text-xs opacity-75 hidden sm:inline">About & Hobbies</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("social")}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === "social"
                    ? "bg-orange text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="size-5 fill-current shrink-0" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>Contact & Socials</span>
                </div>
                <span className="text-xs opacity-75 hidden sm:inline">Connect Links</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("privacy")}
                className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === "privacy"
                    ? "bg-orange text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="size-5 fill-current shrink-0" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Visibility & Privacy</span>
                </div>
                <span className="text-xs opacity-75 hidden sm:inline">Search Rules</span>
              </button>
            </div>

            {/* LIVE CARD PREVIEW */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Search Card Preview
                </h3>
                <span className="text-xs text-orange font-semibold">Live</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden bg-orange/10 border border-orange/20 text-orange font-bold text-lg flex items-center justify-center shrink-0">
                    {previewImage || (usrImg && usrImg !== "default-avatar.jpg") ? (
                      <Image
                        src={previewImage || getImgPath(usrImg)}
                        alt={fullName}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    ) : (
                      fullName.charAt(0).toUpperCase() || "S"
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 truncate text-sm">
                      {fullName || "Student Name"}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {company || "University in Germany"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-orange/10 text-orange font-semibold">
                    🇮🇳 {locationIndia}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    🗣️ {language}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    📍 {location}
                  </span>
                </div>

                {description && (
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    &ldquo;{description}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TAB CONTENT FORMS */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(updateProf)} className="space-y-6">
              {/* TAB 1: STUDENT IDENTITY */}
              {activeTab === "identity" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Student Identity</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your legal name, academic enrollment, and core student details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Full Name <span className="text-orange">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vigneshwar Reddy"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("fullName", { required: true })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Registered University / Company
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. University of Stuttgart"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("company")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Course / Profession
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. M.Sc. Computer Science"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("profession")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Account Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          readOnly
                          value={usrEmail}
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          ✓ Verified
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <input
                        type="text"
                        placeholder="DD-MM-YYYY (e.g. 15-08-2000)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("dob")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Gender
                      </label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("gender")}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INDIAN HERITAGE & DISCOVERY */}
              {activeTab === "heritage" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>🇮🇳</span> Indian Heritage & Discovery
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Connect with students from your native Indian state who speak your mother tongue.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                        <span>Native State in India</span>
                        <span className="text-orange text-xs font-normal">Primary community filter</span>
                      </label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("locationIndia")}
                      >
                        <option value="-">Select Your Native State</option>
                        {locList.india.map((loc: any, i: number) => (
                          <option value={loc.name} key={i}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Mother Tongue / Primary Language
                      </label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("language")}
                      >
                        <option value="-">Select Primary Language</option>
                        {locList.language.map((lng: any, i: number) => (
                          <option value={lng.name} key={i}>
                            {lng.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Current German City
                      </label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("location")}
                      >
                        <option value="Stuttgart">Stuttgart</option>
                        <option value="Berlin">Berlin</option>
                        <option value="Munich">Munich</option>
                        <option value="Frankfurt">Frankfurt</option>
                        <option value="Hamburg">Hamburg</option>
                        <option value="Dresden">Dresden</option>
                        <option value="Aachen">Aachen</option>
                        <option value="Heidelberg">Heidelberg</option>
                        <option value="Ludwigsburg">Ludwigsburg</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BIO & PASSIONS */}
              {activeTab === "bio" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Bio & Passions</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tell other students what you love doing on weekends, campus events, and hobbies.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Short About Me / Bio
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Share a few sentences about your background, goals in Germany, and what kind of friends you'd like to meet..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition resize-none"
                        {...register("description")}
                      ></textarea>
                      <p className="text-xs text-slate-400 text-right">
                        Displayed on your public profile and friend searches.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Hobbies & Weekend Activities
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Badminton, Cricket, Photography, Cooking Indian food, Travel"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("hobbies")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT & SOCIALS */}
              {activeTab === "social" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Contact & Social Channels</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Optional contact channels for connected friends to reach you outside the app.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>📸</span> Instagram Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">@</span>
                        <input
                          type="text"
                          placeholder="your_handle"
                          className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                          {...register("instagram")}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>💼</span> LinkedIn or X (Twitter)
                      </label>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/... or @handle"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("twitter")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>📱</span> Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+49 ... or +91 ..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("contactNo")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>✉️</span> Secondary Contact Email
                      </label>
                      <input
                        type="email"
                        placeholder="personal@gmail.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition"
                        {...register("contactEmail")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PRIVACY & VISIBILITY */}
              {activeTab === "privacy" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Visibility & Privacy Rules</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Control who can find your profile in student searches and community events.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200/80 hover:border-orange/40 bg-slate-50/50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        {...register("discoverable")}
                        className="mt-1 size-5 rounded text-orange focus:ring-orange accent-orange"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm text-slate-900 block">
                          Allow Indian Students to Discover My Profile
                        </span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          When enabled, your profile appears in the "Find Friends" filter by Country (India), Native State, and Language.
                        </p>
                      </div>
                    </label>

                    {gender === "Female" && (
                      <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200/80 hover:border-orange/40 bg-slate-50/50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          {...register("womenOnly")}
                          className="mt-1 size-5 rounded text-orange focus:ring-orange accent-orange"
                        />
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-slate-900 block">
                            Women-Only Visibility
                          </span>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Only verified female students will be able to see your profile and send friend requests.
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* BOTTOM STICKY ACTION BAR */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500">
                  {isSaving ? "Saving updates..." : "Unsaved changes will be preserved when you save."}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (authToken) {
                        const getUsr = async () => {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}user`, {
                            headers: { authorization: authToken },
                          });
                          const pInfo = await res.json();
                          if (res.status === 200) reset(pInfo);
                        };
                        getUsr();
                        showToast("Changes reset", "info");
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-orange hover:bg-orange/90 shadow-md shadow-orange/20 transition cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin size-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import { useSessionStore } from "../../stores/session";
import { useProfileStore } from "../../stores/profile";

export default function ProfilePage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const userSession = useSessionStore((state) => state.userSession);
  const profile = useProfileStore((state) => state.profile);
  const isAdmin = useProfileStore((state) => state.isAdmin);

  const userInitial = useMemo(() => {
    const fromName = (profile?.first_name || "").trim()[0];
    const fromEmail = (profile?.email || "").trim()[0];
    return (fromName || fromEmail || "U").toUpperCase();
  }, [profile?.first_name, profile?.email]);

  return (
    <>
      <Head>
        <title>My Profile</title>
      </Head>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

        {!isAuthenticated && (
          <div className="p-4 rounded border bg-yellow-50 text-yellow-900">
            Please log in to view your profile. {" "}
            <Link href="/login">
              <a className="underline font-medium">Go to Login</a>
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <div className="space-y-6">
            <div className="p-5 rounded border bg-white flex items-center gap-4">
              {profile?.avatar_url ? (
                // Using img to align with project usage
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
                  {userInitial}
                </div>
              )}
              <div className="flex-1">
                <div className="text-lg font-medium text-gray-900">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.email || userSession?.email || "User"}
                </div>
                {profile?.email && (
                  <div className="text-sm text-gray-500">{profile.email}</div>
                )}
                {isAdmin && (
                  <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/results">
                <a className="p-4 rounded border bg-white hover:bg-gray-50 transition">
                  <div className="font-medium text-gray-900">Results</div>
                  <div className="text-sm text-gray-500">View your quiz results</div>
                </a>
              </Link>
              <Link href="/profile/purchases">
                <a className="p-4 rounded border bg-white hover:bg-gray-50 transition">
                  <div className="font-medium text-gray-900">Purchases</div>
                  <div className="text-sm text-gray-500">See your course orders</div>
                </a>
              </Link>
              <Link href="/premium-courses">
                <a className="p-4 rounded border bg-white hover:bg-gray-50 transition">
                  <div className="font-medium text-gray-900">Premium Courses</div>
                  <div className="text-sm text-gray-500">Explore premium content</div>
                </a>
              </Link>
              <Link href="/quiz">
                <a className="p-4 rounded border bg-white hover:bg-gray-50 transition">
                  <div className="font-medium text-gray-900">Quiz</div>
                  <div className="text-sm text-gray-500">Jump into a quiz</div>
                </a>
              </Link>
            </div>

            <div className="p-5 rounded border bg-white">
              <div className="font-medium text-gray-900 mb-3">Account Info</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID</span>
                  <span className="text-gray-900">{userSession?.id || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">First Name</span>
                  <span className="text-gray-900">{profile?.first_name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Name</span>
                  <span className="text-gray-900">{profile?.last_name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{profile?.email || userSession?.email || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="text-gray-900">{isAdmin ? "Admin" : "Student"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}



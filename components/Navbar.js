import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSessionStore } from "../stores/session";
import { useProfileStore } from "../stores/profile";
import Router from "next/router";

const Navbar = () => {
  const { handleSignOut } = useSessionStore();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const profile = useProfileStore((state) => state.profile);
  const isAdmin = useProfileStore((state) => state.isAdmin);
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOutClick = async () => {
    setIsMobileOpen(false);
    localStorage.setItem("authToken", "");
    await handleSignOut();
    Router.push("/");
  };

  const navLinks = [
    { href: "/premium-courses", label: "Premium Courses", authOnly: false },
    { href: "/quiz", label: "Quiz", authOnly: true },
    { href: "/profile", label: "Profile", authOnly: true },
    { href: "/results", label: "Results", authOnly: true },
    { href: "/profile/purchases", label: "Purchases", authOnly: true },
    { href: "/about", label: "About Us", authOnly: false },
    { href: "/contact", label: "Contact Us", authOnly: false }
  ];

  const isActive = (href) => router.pathname === href;

  const NavItem = ({ href, label }) => (
    <Link href={href}>
      <a
        className={`px-2 py-1 text-sm transition-colors hover:text-gray-900 ${
          isActive(href) ? "text-gray-900" : "text-gray-600"
        }`}
      >
        {label}
      </a>
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href={"/"}>
            <a className="flex items-center text-gray-900">
              <img src="/download.png" width="30px" alt="COKWP Logo" />
              <span className="ml-3 text-lg font-semibold tracking-tight">COKWP</span>
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks
              .filter((l) => (l.authOnly ? isAuthenticated : true))
              .map((l) => (
                <NavItem key={l.href} href={l.href} label={l.label} />
              ))}
            {!isAuthenticated ? (
              <Link href={"/login"}>
                <button className="ml-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm transition-colors hover:bg-blue-700 focus:outline-none">
                  Login
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.email || "User"}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {profile?.first_name?.[0]?.toUpperCase() ||
                      profile?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <button
                  className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-white text-xs font-medium shadow-sm transition-colors hover:bg-gray-700 focus:outline-none"
                  onClick={handleSignOutClick}
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </header>
      <nav
        className={`md:hidden ${
          isMobileOpen ? "flex" : "hidden"
        } w-full flex-col border-b bg-white px-4 py-3 text-sm`}
      >
        <div className="flex flex-col gap-2">
          {navLinks
            .filter((l) => (l.authOnly ? isAuthenticated : true))
            .map((l) => (
              <Link key={l.href} href={l.href}>
                <a
                  className={`py-2 ${
                    isActive(l.href) ? "text-gray-900" : "text-gray-600"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {l.label}
                </a>
              </Link>
            ))}
        </div>
        <div className="mt-3">
          {!isAuthenticated ? (
            <Link href={"/login"}>
              <button
                className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm transition-colors hover:bg-blue-700 focus:outline-none"
                onClick={() => setIsMobileOpen(false)}
              >
                Login
              </button>
            </Link>
          ) : (
            <div className="flex flex-col w-full gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    {profile?.first_name?.[0]?.toUpperCase() ||
                      profile?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.email || "User"}
                  </div>
                  {profile?.email && profile?.first_name && (
                    <div className="text-xs text-gray-500">{profile.email}</div>
                  )}
                  {isAdmin && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-white text-sm font-medium shadow-sm transition-colors hover:bg-gray-700 focus:outline-none"
                onClick={handleSignOutClick}
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </nav>

    </>
  );
};

export default Navbar;

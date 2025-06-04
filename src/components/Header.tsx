"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { cn } from "../lib/utils";
import { FaSpinner } from "react-icons/fa";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => {
    return pathname === path
      ? "text-blue-600"
      : "text-gray-600 hover:text-blue-600";
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Navigation */}
          <nav className="flex space-x-8">
            <Link
              href="/"
              className={cn(
                isActive("/"),
                "font-medium transition-colors duration-200",
              )}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={cn(
                isActive("/blog"),
                "font-medium transition-colors duration-200",
              )}
            >
              Blog
            </Link>
            <Link
              href="/nft-gift"
              className={cn(
                isActive("/nft-gift"),
                "font-medium transition-colors duration-200",
              )}
            >
              NFT Gift
            </Link>
          </nav>

          {/* Right side - Auth button */}
          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <FaSpinner className="h-5 w-5 animate-spin text-gray-600" />
            ) : session ? (
              <button
                onClick={() => signOut()}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import { Home, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <>
      <nav className="relative z-20 p-4 sm:p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                GameOverse
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Home
                </span>
              </Link>
              <Link
                href="/dataset-editor"
                className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-semibold">
                  New Dataset
                </span>
                <span className="sm:hidden text-sm font-semibold">New</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

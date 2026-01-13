// src/components/Layout.jsx
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-sky-200">
          Synex • Unified Banking Dashboard
        </div>
      </footer>
    </div>
  );
}

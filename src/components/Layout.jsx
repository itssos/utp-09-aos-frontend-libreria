import React from "react";
import HorizontalNavBar from "./HorizontalNavBar";
import useAuth from "../hooks/useAuth";

const SIDEBAR_WIDTH = 256; // 64 (w-64) * 4 = 256px

const Layout = ({ children }) => {
  const { user } = useAuth();

  if (user?.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar Fijo */}
        <aside
          className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-30"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <HorizontalNavBar vertical />
        </aside>

        {/* Main Content, deja espacio al sidebar */}
        <main
          className="ml-64 px-8 py-8 min-h-screen"
          style={{ marginLeft: SIDEBAR_WIDTH }}
        >
          {children}
        </main>
      </div>
    );
  }

  // Si NO hay usuario, navbar horizontal arriba
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center">
          <HorizontalNavBar />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-800 text-gray-100 py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Libreria Jesus Amigo. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

import React, { useState } from "react";
import Asidebar from "./Asidebar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      <Asidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        id="content-wrapper"
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? "ml-96" : "ml-16"
        }`}
      >
        {children}
      </div>
      {/* mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 w-full border-t text-black md:hidden">
        <Asidebar
          mobile={true}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}

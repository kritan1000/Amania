import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const HomeLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
export default HomeLayout;
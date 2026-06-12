import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/TempHeader/TempHeader";
import TempFooter from "../components/TempFooter/TempFooter";
import BackToTop from "../pages/Backtotop/Backtotop";

export default function Layout({ content }) {
  const { pathname } = useLocation();
  return (
    <div>
      <Header />
      {/* key đổi theo route -> fade-in lại mỗi lần chuyển trang cho mượt */}
      <main key={pathname} className="page-fade">
        {content}
      </main>
      <TempFooter />
      <BackToTop />
    </div>
  );
}

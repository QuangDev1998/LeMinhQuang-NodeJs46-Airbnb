import React from "react";
import Header from "../components/TempHeader/TempHeader";
import TempFooter from "../components/TempFooter/TempFooter";
import BackToTop from "../pages/Backtotop/Backtotop";

export default function Layout({ content }) {
  return (
    <div>
      <Header />
      {content}
      <TempFooter />
      <BackToTop />
    </div>
  );
}

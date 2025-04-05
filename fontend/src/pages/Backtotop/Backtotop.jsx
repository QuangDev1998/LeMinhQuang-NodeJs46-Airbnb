import React, { useState, useEffect } from "react";
import { BackTop } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Theo dõi vị trí cuộn của trang
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      {isVisible && (
        <BackTop>
          <div
            className="
              fixed bottom-5 right-5
              flex items-center justify-center
              w-12 h-12
              bg-primary
              text-white font-bold 
              rounded-lg shadow-lg
              transition-all duration-300
              cursor-pointer
            "
          >
            <ArrowUpOutlined style={{ fontSize: "20px" }} />{" "}
          </div>
        </BackTop>
      )}
    </div>
  );
}

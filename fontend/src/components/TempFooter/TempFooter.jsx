import React from "react";
import {
  GlobalOutlined,
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const TempFooter = () => {
  const handleLinkClick = () => {
    window.location.href = "https://www.airbnb.com.vn/";
  };

  const columns = [
    {
      title: "Hỗ trợ",
      items: [
        "Trung tâm trợ giúp",
        "AirCover",
        "Chống phân biệt đối xử",
        "Hỗ trợ người khuyết tật",
        "Các tùy chọn hủy",
        "Báo cáo lo ngại của khu dân cư",
      ],
    },
    {
      title: "Đón tiếp khách",
      items: [
        "Cho thuê nhà trên Airbnb",
        "AirCover cho Host",
        "Tài nguyên về đón tiếp khách",
        "Diễn đàn cộng đồng",
        "Đón tiếp khách có trách nhiệm",
      ],
    },
    {
      title: "Airbnb",
      items: [
        "Trang tin tức",
        "Tính năng mới",
        "Cơ hội nghề nghiệp",
        "Nhà đầu tư",
        "Chỗ ở khẩn cấp Airbnb.org",
      ],
    },
  ];

  return (
    <footer id="contactSection" className="border-t border-gray-200 bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold text-gray-900">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li
                    key={item}
                    onClick={handleLinkClick}
                    className="cursor-pointer text-sm text-gray-600 transition hover:text-gray-900 hover:underline"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-gray-600 md:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2024 Airbnb, Inc.</span>
            <span className="hidden md:inline">·</span>
            <span className="cursor-pointer hover:underline" onClick={handleLinkClick}>
              Quyền riêng tư
            </span>
            <span>·</span>
            <span className="cursor-pointer hover:underline" onClick={handleLinkClick}>
              Điều khoản
            </span>
            <span>·</span>
            <span className="cursor-pointer hover:underline" onClick={handleLinkClick}>
              Sơ đồ trang web
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="flex cursor-pointer items-center gap-2 font-semibold text-gray-900 hover:underline">
              <GlobalOutlined /> Tiếng Việt (VN)
            </span>
            <span className="cursor-pointer font-semibold text-gray-900 hover:underline">
              ₫ VND
            </span>
            <div className="flex items-center gap-4 text-lg text-gray-900">
              <FacebookFilled className="cursor-pointer" onClick={handleLinkClick} />
              <TwitterOutlined className="cursor-pointer" onClick={handleLinkClick} />
              <InstagramOutlined className="cursor-pointer" onClick={handleLinkClick} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TempFooter;

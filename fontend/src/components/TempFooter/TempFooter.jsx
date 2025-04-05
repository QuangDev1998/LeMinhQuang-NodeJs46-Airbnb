import React from "react";
import { useSelector } from "react-redux";

const TempFooter = () => {
  const handleLinkClick = () => {
    window.location.href = "https://www.airbnb.com.vn/";
  };
  const { themeMode } = useSelector((state) => state.darkModeSlice);

  return (
    <footer id="contactSection" className={` ${themeMode} bg-gray-100 py-8 `}>
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* GIỚI THIỆU */}
        <div>
          <h3 className="text-lg font-semibold mb-4">GIỚI THIỆU</h3>
          <ul className="space-y-2">
            {[
              "Phương thức hoạt động của Airbnb",
              "Trang tin tức",
              "Nhà đầu tư",
              "Airbnb Plus",
              "Airbnb Luxe",
              "HotelTonight",
              "Airbnb for Work",
              "Nhờ có Host, mọi điều đều có thể",
              "Cơ hội nghề nghiệp",
            ].map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline"
                onClick={handleLinkClick}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CỘNG ĐỒNG */}
        <div>
          <h3 className="text-lg font-semibold mb-4">CỘNG ĐỒNG</h3>
          <ul className="space-y-2">
            {[
              "Sự đa dạng và Cảm giác thân thuộc",
              "Tiện nghi phù hợp cho người khuyết tật",
              "Đối tác liên kết Airbnb",
              "Chỗ ở cho tuyến đầu",
              "Lượt giới thiệu của khách",
              "Airbnb.org",
            ].map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline"
                onClick={handleLinkClick}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ĐÓN TIẾP KHÁCH */}
        <div>
          <h3 className="text-lg font-semibold mb-4">ĐÓN TIẾP KHÁCH</h3>
          <ul className="space-y-2">
            {[
              "Cho thuê nhà",
              "Tổ chức Trải nghiệm trực tuyến",
              "Tổ chức Trải nghiệm",
              "Đón tiếp khách có trách nhiệm",
              "Trung tâm tài nguyên",
              "Trung tâm cộng đồng",
            ].map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline"
                onClick={handleLinkClick}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* HỖ TRỢ */}
        <div>
          <h3 className="text-lg font-semibold mb-4">HỖ TRỢ</h3>
          <ul className="space-y-2">
            {[
              "Biện pháp ứng phó đại dịch COVID-19",
              "Trung tâm trợ giúp",
              "Các tùy chọn hủy",
              "Hỗ trợ khu dân cư",
              "Tin cậy và an toàn",
            ].map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline"
                onClick={handleLinkClick}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default TempFooter;

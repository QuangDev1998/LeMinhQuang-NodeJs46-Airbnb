import React from "react";
import Slider from "../components/Sider/Slider";
import { useSelector } from "react-redux";
import { Modal } from "antd";

export default function AdminLayout({ content }) {
  const loginData = useSelector((state) => state.userSlice.loginData);

  const renderLayout = () => {
    // nếu role người dùng ko phải admin => trả về thông báo và nút quay về trang chủ
    if (loginData?.user.role !== "ADMIN") {
      return (
        <Modal open={true} maskClosable="false" footer={null} closable={false}>
          <div className="space-y-5">
            <p className="text-center text-2xl ">Bạn không phải admin</p>
            <div className="flex justify-center">
              <button
                className="button-primary"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Trở về trang chủ
              </button>
            </div>
          </div>
        </Modal>
      );
    } else {
      return <Slider content={content} />;
    }
  };
  return <div>{renderLayout()}</div>;
}

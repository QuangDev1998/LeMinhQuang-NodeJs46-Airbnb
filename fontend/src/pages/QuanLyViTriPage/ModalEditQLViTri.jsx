import React from "react";
import { Modal, Form, Input, message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { EnvironmentOutlined } from "@ant-design/icons";
import { setIsModalEditOpenAction } from "../../redux/slices/quanLyViTriSlice";
import { viTriServices } from "../../services/viTriServices";
import {
  fetchListViTriAction,
  fetchViTriInfoAction,
} from "../../redux/thunks/quanLyViTriThunks";
import AdminModalHeader from "../../components/Admin/AdminModalHeader";

export default function ModalEditQLViTri({ valueInput }) {
  const { isModalEditOpen, viTriInfo, currentPage } = useSelector(
    (state) => state.quanLyViTriSlice
  );
  const { token } = useSelector((state) => state.userSlice.loginData);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const hideModal = () => {
    dispatch(setIsModalEditOpenAction(false));
  };
  // hàm submit form
  const handleOk = (values) => {
    // nếu hinhAnh của form ko có
    if (!values.hinhAnh) {
      // ko edit hình => giữ ảnh cũ
      values.hinhAnh = viTriInfo.hinh_anh;
      // gọi api edit
      viTriServices
        .editViTri(values, token)
        .then((result) => {
          // => update list
          dispatch(fetchViTriInfoAction(values.id));
          dispatch(fetchListViTriAction({ currentPage, valueInput }));
          dispatch(setIsModalEditOpenAction(false));
          message.success("Cập nhật thành công");
        })
        .catch((err) => {
          console.error(err);
          message.error("Cập nhật thất bại");
        });
    } else {
      // có edit hình => tạo FormData từ hình upload
      values.hinhAnh = values.hinhAnh[0].originFileObj;
      let formData = new FormData();
      formData.append("formFile", values.hinhAnh, values.hinhAnh.name);
      // gọi api up hình
      viTriServices
        .uploadHinhViTri(formData, values.id, token)
        .then((result) => {
          values.hinhAnh =
            result.data?.content?.hinh_anh ?? result.data?.content?.hinhAnh;
          // => gọi api edit
          viTriServices
            .editViTri(values, token)
            .then((result) => {
              // => update list
              dispatch(fetchViTriInfoAction(values.id));
              dispatch(fetchListViTriAction({ currentPage, valueInput }));
              message.success("Cập nhật thành công");
            })
            .catch((err) => {
              console.error(err);
              message.error("Cập nhật thất bại");
            });
        })
        .catch((err) => {
          console.error(err);
          message.error("Cập nhật thất bại");
        });
    }
  };
  const renderInitialValues = () => {
    if (viTriInfo) {
      return {
        id: viTriInfo.id,
        tenViTri: viTriInfo.ten_vi_tri,
        tinhThanh: viTriInfo.tinh_thanh,
        quocGia: viTriInfo.quoc_gia,
      };
    }
  };

  return (
    <div>
      <Modal
        className="admin-modal"
        centered
        closable={false}
        open={isModalEditOpen}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { backgroundColor: "#ff385c", borderColor: "#ff385c" },
        }}
        onCancel={hideModal}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            clearOnDestroy
            initialValues={renderInitialValues()}
            onFinish={(values) => handleOk(values)}
          >
            {dom}
          </Form>
        )}
      >
        <AdminModalHeader
          icon={<EnvironmentOutlined />}
          title="Cập nhật vị trí"
          subtitle="Chỉnh sửa thông tin địa điểm"
        />
        <img
          src={viTriInfo?.hinh_anh}
          alt=""
          className="mb-4 h-44 w-full rounded-xl object-cover"
        />
        {/* hinhAnh */}
        <Form.Item
          label="Đổi hình ảnh"
          name="hinhAnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg"
            customRequest={({ onSuccess }) => onSuccess("ok")}
          >
            <button
              className="border-2 border-solid py-2 px-3 rounded-md"
              type="button"
            >
              Đổi hình
            </button>
          </Upload>
        </Form.Item>
        {/* id */}
        <Form.Item name="id" label="Mã vị trí">
          <Input disabled />
        </Form.Item>
        {/* tenViTri */}
        <Form.Item
          name="tenViTri"
          label="Tên vị trí"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên vị trí!",
              whitespace: true,
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        {/* tinhThanh */}
        <Form.Item
          name="tinhThanh"
          label="Tỉnh thành"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tỉnh thành!",
              whitespace: true,
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        {/* quocGia */}
        <Form.Item
          name="quocGia"
          label="Quốc gia"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập quốc gia!",
              whitespace: true,
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
      </Modal>
    </div>
  );
}

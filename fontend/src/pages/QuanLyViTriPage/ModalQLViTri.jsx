import React from "react";
import { Modal, Form, Input, message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalOpenAction } from "../../redux/slices/quanLyViTriSlice";
import { viTriServices } from "../../services/viTriServices";
import { PlusOutlined } from "@ant-design/icons";
import { fetchListViTriAction } from "../../redux/thunks/quanLyViTriThunks";

export default function ModalQLViTri({ valueInput }) {
  const { isModalOpen, currentPage } = useSelector(
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
    dispatch(setIsModalOpenAction(false));
  };
  // hàm submit form
  const handleOk = (values) => {
    // tạo FormData từ hình upload
    values.hinhAnh = values.hinhAnh[0].originFileObj;
    let formData = new FormData();
    formData.append("formFile", values.hinhAnh, values.hinhAnh.name);
    // gọi api tạo
    const valuesClone = { ...values };
    valuesClone.hinhAnh = "";
    viTriServices
      .addVitri(valuesClone, token)
      .then((result) => {
        // => có id => gọi api up hình
        viTriServices
          .uploadHinhViTri(formData, result.data.content.id, token)
          .then((result) => {
            // => update list
            dispatch(fetchListViTriAction({ currentPage, valueInput }));
            dispatch(setIsModalOpenAction(false));
            message.success("Thêm thành công");
          })
          .catch((err) => {
            console.error(err);
            message.error("Thêm thất bại");
          });
      })
      .catch((err) => {
        console.error(err);
        message.error("Thêm thất bại");
      });
  };

  return (
    <div>
      <Modal
        closable={false}
        open={isModalOpen}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: {
            backgroundColor: "rgb(254 107 110)",
          },
        }}
        prop
        onCancel={hideModal}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            clearOnDestroy
            onFinish={(values) => handleOk(values)}
          >
            {dom}
          </Form>
        )}
      >
        <h1 className="my-3 text-2xl text-center">Thêm vị trí mới</h1>
        {/* hinhAnh */}
        <Form.Item
          label="Thêm hình"
          name="hinhAnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn hình!",
            },
          ]}
          hasFeedback
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
              <PlusOutlined />
            </button>
          </Upload>
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

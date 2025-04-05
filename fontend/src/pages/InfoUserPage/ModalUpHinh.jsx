import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, message, Upload } from "antd";
import { setIsModalUpHinhOpenAction } from "../../redux/slices/infoUserSlice";
import { PlusOutlined } from "@ant-design/icons";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import { fetchInfoUserAction } from "../../redux/thunks/infoUserThunks";
import { setLoginData } from "../../redux/slices/userSlice";

export default function ModalUpHinh({ idUser }) {
  const { isModalUpHinhOpen, infoUser } = useSelector(
    (state) => state.infoUserSlice
  );
  const loginData = useSelector((state) => state.userSlice.loginData);
  const token = useSelector((state) => state.userSlice.loginData?.token);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const hideModal = () => {
    dispatch(setIsModalUpHinhOpenAction(false));
  };
  const handleOk = (values) => {
    values.avatar = values.avatar[0].originFileObj;
    let formData = new FormData();
    formData.append("formFile", values.avatar, values.avatar.name);
    nguoiDungServices
      .uploadHinhUser(formData, token)
      .then((result) => {
        let userClone = result.data.content;
        userClone.password = "";
        let loginClone = { ...loginData, user: userClone };
        let loginJson = JSON.stringify(loginClone);
        localStorage.setItem("USER_LOGIN", loginJson);
        dispatch(fetchInfoUserAction(idUser));
        dispatch(setLoginData(loginClone));
        message.success("Cập nhật thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Cập nhật thất bại");
      });
  };
  return (
    <div>
      <Modal
        closable={false}
        open={isModalUpHinhOpen}
        okText="Cập nhật"
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
        <h1 className="my-3 text-2xl text-center">Thay đổi ảnh đại diện</h1>
        <div>
          {infoUser.avatar ? (
            <img
              src={infoUser.avatar}
              alt=""
              className="mx-auto h-36 w-36 object-cover rounded-full"
            />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
              alt=""
              className="mx-auto h-36 w-36 object-cover rounded-full"
            />
          )}
        </div>
        {/* hinhAnh */}
        <Form.Item
          label=""
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          style={{ textAlign: "center", marginTop: "20px" }}
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
            <button className="button-primary" type="button">
              <PlusOutlined />
            </button>
          </Upload>
        </Form.Item>
      </Modal>
    </div>
  );
}

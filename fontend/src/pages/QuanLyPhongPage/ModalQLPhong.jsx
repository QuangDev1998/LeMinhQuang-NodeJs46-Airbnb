import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalOpenAction } from "../../redux/slices/quanLyPhongSlice";
import {
  Modal,
  Form,
  message,
  Upload,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Switch,
} from "antd";
import { PlusOutlined, HomeOutlined } from "@ant-design/icons";
import { phongServices } from "../../services/phongServices";
import { fetchListPhongAction } from "../../redux/thunks/quanLyPhongThunks";
import AdminModalHeader from "../../components/Admin/AdminModalHeader";

export default function ModalQLPhong({ valueInput }) {
  const { isModalOpen, currentPage } = useSelector(
    (state) => state.quanLyPhongSlice
  );
  const { token } = useSelector((state) => state.userSlice.loginData);
  const { listViTri } = useSelector((state) => state.quanLyViTriSlice);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

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
    phongServices
      .createPhong(valuesClone, token)
      .then((result) => {
        // createPhong trả mapRoom (không bọc content) -> lấy id linh hoạt
        const newId = result.data?.content?.id ?? result.data?.id;
        phongServices
          .uploadHinhPhong(formData, newId, token)
          .then((result) => {
            // => update list
            dispatch(fetchListPhongAction({ currentPage, valueInput }));
            dispatch(setIsModalOpenAction(false));
            message.success("Thêm thành công");
          })
          .catch((err) => {
            message.error("Thêm thất bại");
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
        message.error("Thêm thất bại");
      });
  };
  const renderSelectOption = () => {
    return listViTri.map((viTri) => {
      return {
        value: viTri.id,
        label: (
          <div className="flex items-center">
            <img
              src={viTri.hinhAnh}
              alt="avatar"
              className="mr-1  h-7 w-10 object-cover rounded-sm"
            />
            <p>{viTri.tenViTri}</p>
          </div>
        ),
      };
    });
  };

  return (
    <div>
      <Modal
        className="admin-modal"
        centered
        width={760}
        closable={false}
        open={isModalOpen}
        okText="Thêm phòng"
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
            onFinish={(values) => handleOk(values)}
          >
            {dom}
          </Form>
        )}
      >
        <AdminModalHeader
          icon={<HomeOutlined />}
          title="Thêm phòng thuê"
          subtitle="Tạo một chỗ ở mới với đầy đủ thông tin & tiện nghi"
        />
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
        <Row gutter={24}>
          {/* Col left */}
          <Col className="gutter-row" span={24} md={12}>
            {/* tenPhong */}
            <Form.Item
              name="tenPhong"
              label="Tên phòng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên người dùng!",
                  whitespace: true,
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Điền tên phòng..." />
            </Form.Item>
            {/* maViTri */}
            <Form.Item
              name="maViTri"
              label="Vị trí"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn vị trí!",
                },
              ]}
              hasFeedback
            >
              <Select
                placeholder="Chọn vị trí"
                options={renderSelectOption()}
              />
            </Form.Item>
            {/* phongNgu */}
            <Form.Item
              name="phongNgu"
              label="Số phòng ngủ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số phòng!",
                },
              ]}
              hasFeedback
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="1"
                className="w-full"
              />
            </Form.Item>
            {/* phongTam */}
            <Form.Item
              name="phongTam"
              label="Số phòng tắm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số phòng tắm!",
                },
              ]}
              hasFeedback
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="1"
                className="w-full"
              />
            </Form.Item>
          </Col>
          {/* Col right */}
          <Col className="gutter-row" span={24} md={12}>
            {/* moTa */}
            <Form.Item
              name="moTa"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả!",
                  whitespace: true,
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Nhập mô tả vào đây" />
            </Form.Item>
            {/* khach */}
            <Form.Item
              name="khach"
              label="Số khách"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số khách!",
                },
              ]}
              hasFeedback
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="1"
                className="w-full"
              />
            </Form.Item>
            {/* giuong */}
            <Form.Item
              name="giuong"
              label="Số giường ngủ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số giường ngủ!",
                },
              ]}
              hasFeedback
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="1"
                className="w-full"
              />
            </Form.Item>
            {/* giaTien */}
            <Form.Item
              name="giaTien"
              label="Giá phòng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá phòng!",
                },
              ]}
              hasFeedback
            >
              <InputNumber min={1} placeholder="Đơn vị $" className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <div className="mt-2 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-bold text-gray-700">Tiện nghi</p>
          <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3">
          {/* mayGiat */}
          <Form.Item name="mayGiat" label="Máy giặt" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* banLa */}
          <Form.Item name="banLa" label="Bàn là" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* tivi */}
          <Form.Item name="tivi" label="Tivi" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* dieuHoa */}
          <Form.Item name="dieuHoa" label="Điều hòa" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* wifi */}
          <Form.Item name="wifi" label="Wifi" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* bep */}
          <Form.Item name="bep" label="Bếp" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* doXe */}
          <Form.Item name="doXe" label="Đỗ xe" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* hoBoi */}
          <Form.Item name="hoBoi" label="Hồ bơi" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          {/* banUi */}
          <Form.Item name="banUi" label="Bàn ủi" initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
          </div>
        </div>
      </Modal>
    </div>
  );
}

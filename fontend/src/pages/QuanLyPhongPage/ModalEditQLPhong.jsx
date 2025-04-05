import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalEditOpenAction } from "../../redux/slices/quanLyPhongSlice";
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
import { phongServices } from "../../services/phongServices";
import {
  fetchListPhongAction,
  fetchPhongInfoAction,
} from "../../redux/thunks/quanLyPhongThunks";

export default function ModalEditQLPhong({ valueInput }) {
  const { isModalEditOpen, phongInfo, currentPage } = useSelector(
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
    dispatch(setIsModalEditOpenAction(false));
  };
  // hàm submit form
  const handleOk = (values) => {
    // nếu hinhAnh của form ko có
    if (!values.hinhAnh) {
      // ko edit hình => hinhAnh của form = phongInfo.hinhAnh
      values.hinhAnh = phongInfo.hinhAnh;
      // gọi api edit
      phongServices
        .editPhong(values.id, values, token)
        .then((result) => {
          // => update list
          dispatch(fetchPhongInfoAction(values.id));
          dispatch(fetchListPhongAction({ currentPage, valueInput }));
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
      phongServices
        .uploadHinhPhong(formData, values.id, token)
        .then((result) => {
          values.hinhAnh = result.data.content.hinhAnh;
          // => gọi api edit
          phongServices
            .editPhong(values.id, values, token)
            .then((result) => {
              // => update list
              dispatch(fetchPhongInfoAction(values.id));
              dispatch(fetchListPhongAction({ currentPage, valueInput }));
              message.success("Cập nhật thành công");
            })
            .catch((err) => {
              message.error("Cập nhật thất bại");
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
          message.error("Cập nhật thất bại");
        });
    }
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
  const renderInitialValues = () => {
    if (phongInfo) {
      return {
        id: phongInfo.id,
        tenPhong: phongInfo.tenPhong,
        khach: phongInfo.khach,
        phongNgu: phongInfo.phongNgu,
        giuong: phongInfo.giuong,
        phongTam: phongInfo.phongTam,
        moTa: phongInfo.moTa,
        giaTien: phongInfo.giaTien,
        mayGiat: phongInfo.mayGiat,
        banLa: phongInfo.banLa,
        tivi: phongInfo.tivi,
        dieuHoa: phongInfo.dieuHoa,
        wifi: phongInfo.wifi,
        bep: phongInfo.bep,
        doXe: phongInfo.doXe,
        hoBoi: phongInfo.hoBoi,
        banUi: phongInfo.banUi,
        maViTri: phongInfo.maViTri,
      };
    }
  };
  return (
    <div>
      <Modal
        closable={false}
        open={isModalEditOpen}
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
            initialValues={renderInitialValues()}
            onFinish={(values) => handleOk(values)}
          >
            {dom}
          </Form>
        )}
      >
        <h1 className="my-3 text-2xl text-center">Cập nhật phòng thuê</h1>
        <img src={phongInfo?.hinhAnh} alt="" className="h-48 w-full" />
        {/* hinhAnh */}
        <Form.Item
          label=""
          name="hinhAnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
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
              Đổi hình
            </button>
          </Upload>
        </Form.Item>
        <Row gutter={24}>
          {/* Col left */}
          <Col className="gutter-row" span={24} md={12}>
            {/* id */}
            <Form.Item name="id" label="Mã phòng thuê">
              <Input disabled />
            </Form.Item>
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
          {/* Col right */}
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
        </Row>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {/* mayGiat */}
          <Form.Item name="mayGiat" label="Máy giặt">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* banLa */}
          <Form.Item name="banLa" label="Bàn là">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* tivi */}
          <Form.Item name="tivi" label="Tivi">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* dieuHoa */}
          <Form.Item name="dieuHoa" label="Điều hòa">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* wifi */}
          <Form.Item name="wifi" label="Wifi">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* bep */}
          <Form.Item name="bep" label="Bếp">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* doXe */}
          <Form.Item name="doXe" label="Đỗ xe">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* hoBoi */}
          <Form.Item name="hoBoi" label="Hồ bơi">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          {/* banUi */}
          <Form.Item name="banUi" label="Bàn ủi">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
        </div>
      </Modal>
    </div>
  );
}

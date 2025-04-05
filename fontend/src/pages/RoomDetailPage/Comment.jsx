import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListCommentByIdRoomAction } from "../../redux/thunks/detailRoomThunks";
import { Form, Input, Rate, Select, message } from "antd";
import dayjs from "dayjs";
import { binhLuanServices } from "../../services/binhLuanServices";
import { setListCommentAction } from "../../redux/slices/detailRoomSlice";

export default function Comment({ idRoom }) {
  const dispatch = useDispatch();
  const { listComment } = useSelector((state) => state.detailRoomSlice);
  const { isBooked } = useSelector((state) => state.bookingSlice);
  const loginData = useSelector((state) => state.userSlice.loginData);
  const token = loginData?.token;
  const user = loginData?.user;

  useEffect(() => {
    dispatch(fetchListCommentByIdRoomAction(idRoom));
  }, [idRoom]);

  const onFinish = (values) => {
    const data = {
      ...values,
      maPhong: idRoom,
      maNguoiBinhLuan: user.id,
      ngayBinhLuan: dayjs(),
    };
    binhLuanServices
      .addComment(token, data)
      .then(() => {
        dispatch(fetchListCommentByIdRoomAction(idRoom));
        message.success("Bình luận thành công");
      })
      .catch(() => message.error("Bình luận thất bại"));
  };

  const renderListComment = () => {
    if (!listComment?.length) return <p>Không có bình luận</p>;
    return listComment.map((c) => (
      <div key={c.id} className="mb-3">
        <div className="flex gap-3">
          <img
            src={
              c.avatar ||
              "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
            }
            alt="avatar"
            className="h-12 w-12 object-cover rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold">{c.tenNguoiBinhLuan}</p>
              <Rate disabled defaultValue={c.saoBinhLuan} />
            </div>
            <p className="text-sm text-gray-500">
              {dayjs(c.ngayBinhLuan).format("DD-MM-YY hh:mm")}
            </p>
          </div>
        </div>
        <p className="mt-2">{c.noiDung}</p>
      </div>
    ));
  };

  return (
    <div className="py-5 divide-y-2">
      {isBooked && user && (
        <Form name="comment" onFinish={onFinish} autoComplete="off">
          <Form.Item name="saoBinhLuan" rules={[{ required: true }]}>
            {" "}
            <Rate />{" "}
          </Form.Item>
          <Form.Item name="noiDung" rules={[{ required: true }]}>
            {" "}
            <Input.TextArea rows={4} />{" "}
          </Form.Item>
          <Form.Item>
            <button type="submit" className="button-primary">
              Đánh giá
            </button>
          </Form.Item>
        </Form>
      )}

      <div className="py-5">
        <h1 className="text-xl font-bold mb-2">Bình luận</h1>
        <Select
          onChange={(value) => {
            const clone = [...listComment];
            if (value === "newest") clone.sort((a, b) => b.id - a.id);
            if (value === "oldest") clone.sort((a, b) => a.id - b.id);
            if (value === "highest")
              clone.sort((a, b) => b.saoBinhLuan - a.saoBinhLuan);
            if (value === "lowest")
              clone.sort((a, b) => a.saoBinhLuan - b.saoBinhLuan);
            dispatch(setListCommentAction(clone));
          }}
          className="w-28 my-3"
          options={[
            { value: "newest", label: "Mới nhất" },
            { value: "oldest", label: "Cũ nhất" },
            { value: "highest", label: "Cao nhất" },
            { value: "lowest", label: "Thấp nhất" },
          ]}
        />
        <div className="space-y-4 max-h-[300px] overflow-y-scroll">
          {renderListComment()}
        </div>
      </div>
    </div>
  );
}

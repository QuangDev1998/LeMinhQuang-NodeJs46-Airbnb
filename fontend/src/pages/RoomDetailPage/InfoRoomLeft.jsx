import React, { useState } from "react";
import { useSelector } from "react-redux";
import winner from "../../assets/image/winner.png";

export default function InfoRoomLeft() {
  const { infoRoom, listComment } = useSelector(
    (state) => state.detailRoomSlice
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const calculateAverageRating = () => {
    if (!listComment?.length) return 0;
    let total = listComment.reduce((sum, c) => sum + c.saoBinhLuan, 0);
    return parseFloat((total / listComment.length).toFixed(2));
  };

  const renderRatingAward = () => {
    let rating = calculateAverageRating();
    if (rating >= 4)
      return (
        <div className="text-cyan-400">
          Bạch kim <i className="fa fa-award" />
        </div>
      );
    if (rating >= 3)
      return (
        <div className="text-yellow-300">
          Vàng <i className="fa fa-award" />
        </div>
      );
    return (
      <div className="text-gray-400">
        Bạc <i className="fa fa-award" />
      </div>
    );
  };

  const renderFavorite = () => {
    if (calculateAverageRating() >= 4) {
      return (
        <div className="container border-2 py-5 px-7 rounded-lg">
          <img src={winner} alt="winner" className="h-20 w-20 mx-auto" />
          <p className="text-center">Được yêu thích nhất trên Airbnb</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="basis-2/3 divide-y-2 space-y-5">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              Toàn bộ căn hộ. Chủ nhà{" "}
              <span className="underline uppercase">nnhatsang</span>
            </h1>
            <p>
              {infoRoom.khach} Khách - {infoRoom.phongNgu} Phòng ngủ -{" "}
              {infoRoom.giuong} Giường - {infoRoom.phongTam} Phòng tắm
            </p>
          </div>
          <div className="flex items-center gap-3">
            <img
              className="w-12 h-12 rounded-full"
              src="https://avatars.githubusercontent.com/u/93591100?v=4"
              alt="avatar"
            />
            {renderRatingAward()}
          </div>
        </div>
        {renderFavorite()}
      </div>

      <div className="py-5 space-y-3">
        {[
          "Toàn bộ nhà",
          "Vệ sinh tăng cường",
          "Chủ nhà siêu cấp",
          "Miễn phí hủy trong 48 giờ",
        ].map((item, i) => (
          <div className="flex gap-2" key={i}>
            <i className="fa fa-check-circle" />
            <p>{item}</p>
          </div>
        ))}
      </div>

      <div className="py-5">
        <p>
          {isExpanded ? infoRoom.moTa : `${infoRoom.moTa?.slice(0, 100)}...`}
        </p>
        <button onClick={toggleReadMore} className="font-bold">
          {isExpanded ? "Thu gọn" : "Hiển thị thêm"}
        </button>
      </div>
    </div>
  );
}

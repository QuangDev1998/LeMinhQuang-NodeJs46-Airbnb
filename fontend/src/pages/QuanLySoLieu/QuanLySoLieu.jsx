import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchListBinhLuanAction,
  fetchListDatPhongAction,
  fetchListPhongAction,
} from "../../redux/thunks/quanLySoLieuThunks";
import GiaPhong from "./GiaPhong";
import Rating from "./Rating";
import RatingPercentage from "./RatingPercentage";
import DoanhThu from "./DoanhThu";
import TopPhong from "./TopPhong";

export default function QuanLySoLieu() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchListPhongAction());
    dispatch(fetchListBinhLuanAction());
    dispatch(fetchListDatPhongAction());
  }, []);

  return (
    <div className="space-y-5">
      <div className="md:grid grid-cols-2 gap-3">
        <RatingPercentage />
        <div className="space-y-2">
          <Rating />
          <GiaPhong />
        </div>
      </div>
      <div className="md:grid grid-cols-2 gap-3">
        <DoanhThu />
        <TopPhong />
      </div>
    </div>
  );
}

import { createAsyncThunk } from "@reduxjs/toolkit";
import { phongServices } from "../../services/phongServices";
import { binhLuanServices } from "../../services/binhLuanServices";
import { bookingServices } from "../../services/bookingServices";

export const fetchListPhongAction = createAsyncThunk(
  "quanLySoLieuSlice/fetchListPhongAction",
  async () => {
    const result = await phongServices.getListPhong();
    const listPhong = result.data.content;
    let listGiaTienTemp = [];
    for (let i = 0; i < listPhong.length; i++) {
      let giaTien = listPhong[i].giaTien;
      if (giaTien > 0) {
        listGiaTienTemp.push(giaTien);
      }
    }
    let listIdGiaTien = [];
    for (let i = 0; i < listPhong.length; i++) {
      listIdGiaTien.push({
        id: listPhong[i].id,
        giaTien: listPhong[i].giaTien,
      });
    }
    return {
      listPhong,
      listGiaTien: listGiaTienTemp,
      listIdGiaTien,
    };
  }
);

export const fetchListBinhLuanAction = createAsyncThunk(
  "quanLySoLieuSlice/fetchListBinhLuanAction",
  async () => {
    const result = await binhLuanServices.getListComment();
    const listBinhLuan = result.data.content;
    let listRating = [];
    for (let i = 0; i < listBinhLuan.length; i++) {
      listRating.push(listBinhLuan[i].saoBinhLuan);
    }
    let oneStar = [];
    let twoStar = [];
    let threeStar = [];
    let fourStar = [];
    let fiveStar = [];
    for (let i = 0; i < listRating.length; i++) {
      let star = listRating[i];
      if (star === 5) {
        fiveStar.push(star);
      } else if (4 <= star && star < 5) {
        fourStar.push(star);
      } else if (3 <= star && star < 4) {
        threeStar.push(star);
      } else if (2 <= star && star < 3) {
        twoStar.push(star);
      } else if (star < 2) {
        oneStar.push(star);
      }
    }
    return {
      listRating,
      oneStar,
      twoStar,
      threeStar,
      fourStar,
      fiveStar,
    };
  }
);

export const fetchListDatPhongAction = createAsyncThunk(
  "quanLySoLieuSlice/fetchListDatPhongAction",
  async () => {
    const result = await bookingServices.getListBooking();
    return result.data.content;
  }
);

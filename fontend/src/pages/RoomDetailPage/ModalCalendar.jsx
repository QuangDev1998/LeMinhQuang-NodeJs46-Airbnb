import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsModalCalendarOpen,
  setNgayDen,
  setNgayDi,
  setTotalDay,
} from "../../redux/slices/bookingSlice";
import { Modal } from "antd";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import { addDays } from "date-fns";

export default function ModalCalendar() {
  const { totalDay, isModalCalendarOpen, ngayDen, ngayDi } = useSelector(
    (state) => state.bookingSlice
  );
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState([
    {
      startDate: ngayDen,
      endDate: ngayDi,
      key: "selection",
    },
  ]);

  useEffect(() => {
    setDateRange([
      {
        startDate: ngayDen,
        endDate: ngayDi,
        key: "selection",
      },
    ]);
  }, [ngayDen, ngayDi]);

  const onchangeDate = (item) => {
    setDateRange([item.selection]);
    const { startDate, endDate } = item.selection;
    dispatch(setNgayDen(startDate));
    dispatch(setNgayDi(endDate));
    const days = Math.round((endDate - startDate) / (1000 * 3600 * 24));
    dispatch(setTotalDay(days));
  };

  const handleOk = () => {
    dispatch(setIsModalCalendarOpen(false));
  };

  const handleCancel = () => {
    dispatch(setIsModalCalendarOpen(false));
  };

  return (
    <Modal
      title={`${totalDay} đêm`}
      open={isModalCalendarOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <DateRange
        className="w-full"
        onChange={onchangeDate}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        rangeColors={["rgb(254, 107, 110)"]}
        ranges={dateRange}
        minDate={new Date()}
        locale={vi}
        maxDate={addDays(new Date(), 180)}
      />
    </Modal>
  );
}

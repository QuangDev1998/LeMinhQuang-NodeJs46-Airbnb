import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

/**
 * Thanh loading mảnh ở đỉnh trang (kiểu Airbnb / NProgress).
 * Thay cho overlay trắng full màn hình trước đây vốn gây "chớp trắng" khó chịu
 * mỗi khi có request API. Có delay nhẹ để request siêu nhanh không nhấp nháy.
 */
export default function Spinner() {
  const { isLoading } = useSelector((state) => state.spinnerSlice);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef({});

  useEffect(() => {
    const t = timers.current;
    // Dọn các timer cũ trước khi xử lý trạng thái mới
    clearTimeout(t.show);
    clearTimeout(t.hide);
    clearInterval(t.tick);

    if (isLoading) {
      // Chờ 80ms: request xong trước mốc này thì không hiện -> hết nhấp nháy
      t.show = setTimeout(() => {
        setVisible(true);
        setProgress(12);
        // Tăng dần tới ~90% theo kiểu "ease-out" để cảm giác đang chạy
        t.tick = setInterval(() => {
          setProgress((p) => (p < 90 ? p + (90 - p) * 0.12 : p));
        }, 200);
      }, 80);
    } else {
      clearInterval(t.tick);
      // Đẩy nhanh tới 100% rồi mới ẩn -> chuyển động mượt, không cắt đột ngột
      setProgress((p) => (p > 0 ? 100 : 0));
      t.hide = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 280);
    }

    return () => {
      clearTimeout(t.show);
      clearTimeout(t.hide);
      clearInterval(t.tick);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] w-full bg-transparent">
      <div
        className="h-full rounded-r-full transition-[width] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, rgb(254,107,110), rgb(225,72,108))",
          boxShadow: "0 0 10px rgba(225,72,108,0.7), 0 0 4px rgba(225,72,108,0.5)",
        }}
      />
    </div>
  );
}

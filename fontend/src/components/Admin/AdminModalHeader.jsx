import React from "react";

/**
 * Header dùng chung cho modal thêm/sửa ở trang quản trị:
 * icon tròn + tiêu đề + mô tả ngắn, có gạch chân ngăn cách.
 */
export default function AdminModalHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
      {icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff385c]/10 text-xl text-[#ff385c]">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

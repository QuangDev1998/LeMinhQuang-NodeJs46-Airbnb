import React, { useEffect } from "react";
import { Switch } from "antd";
import { setThemeMode } from "../../redux/slices/darkModeSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DarkLightToggle() {
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const dispatch = useDispatch();
  const isDark = themeMode === "dark";

  // Lưu lựa chọn vào localStorage
  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  const onChangeTheme = (checked) => {
    dispatch(setThemeMode(checked ? "dark" : "light"));
  };

  return (
    <Switch
      onChange={onChangeTheme}
      checked={isDark}
      aria-label="Chuyển chế độ sáng/tối"
      checkedChildren={<i className="fas fa-moon" />}
      unCheckedChildren={<i className="fas fa-sun" />}
    />
  );
}

import React from "react";
import { Switch } from "antd";
import { setThemeMode } from "../../redux/slices/darkModeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function DarkLightToggle() {
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const [switchState, setSwitchState] = useState(() => {
    if (themeMode === "light") {
      return false;
    } else {
      return true;
    }
  });
  const dispatch = useDispatch();
  // set localStorage cho dark mode
  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);
  const handleGohome = () => {
    window.location.href = "/";
  };
  // onChange dark mode
  const onChangeTheme = (checked) => {
    if (checked === true) {
      setSwitchState(true);
      dispatch(setThemeMode("dark"));
    } else {
      setSwitchState(false);
      dispatch(setThemeMode("light"));
    }
  };
  return (
    <Switch
      onChange={onChangeTheme}
      checkedChildren={<i class="fas fa-moon"></i>}
      unCheckedChildren={<i class="fas fa-sun"></i>}
      value={switchState}
    />
  );
}

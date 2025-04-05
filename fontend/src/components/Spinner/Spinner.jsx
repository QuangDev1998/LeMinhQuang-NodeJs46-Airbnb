import React from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";

export default function Spinner() {
  let { isLoading } = useSelector((state) => state.spinnerSlice);
  return isLoading ? (
    <div className="fixed h-screen w-screen top-0 left-0 bg-white bg-opacity-90 z-20 flex justify-center items-center">
      <HashLoader color="#48dd27" size={50} speedMultiplier={1} />
    </div>
  ) : (
    <></>
  );
}

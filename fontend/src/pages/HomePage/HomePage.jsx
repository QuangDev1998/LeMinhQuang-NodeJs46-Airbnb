import React from "react";
import Carousel from "./Carousel";

import List from "./List";
import Locations from "./Location";
import SelectForm from "./SelectForm";
import { useSelector } from "react-redux";
export default function HomePage() {
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  return (
    <div className={`${themeMode}`}>
      <Carousel />
      <SelectForm />
      <List />
      <Locations />
    </div>
  );
}

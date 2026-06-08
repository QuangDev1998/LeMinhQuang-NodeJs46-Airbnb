import React from "react";
import Carousel from "./Carousel";
import List from "./List";
import Locations from "./Location";
import SelectForm from "./SelectForm";
import RoomCategorySection from "../../components/RoomCategorySection/RoomCategorySection";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  return (
    <div className={`${themeMode} pt-24 pb-10`}>
      <Carousel />
      <SelectForm />
      <RoomCategorySection />
      <List />
      <Locations />
    </div>
  );
}

import React from "react";
import Carousel from "./Carousel";
import List from "./List";
import Locations from "./Location";
import RoomCategorySection from "../../components/RoomCategorySection/RoomCategorySection";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  return (
    <div className={`${themeMode} pt-24 pb-10 md:pt-40`}>
      <Carousel />
      <RoomCategorySection />
      <List />
      <Locations />
    </div>
  );
}

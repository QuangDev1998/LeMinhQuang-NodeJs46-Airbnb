import React from "react";
import videoBanner from "../../assets/image/videoBanner.mp4";

export default function Carousel() {
  return (
    <div className="container">
      <div className="relative h-[420px] w-full overflow-hidden rounded-3xl sm:h-[520px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoBanner} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-10 left-6 right-6 text-white sm:left-12">
          <p
            className="text-sm font-semibold uppercase tracking-widest text-white/80"
            data-aos="fade-up"
          >
            Airbnb
          </p>
          <h1
            className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Tìm chỗ nghỉ tiếp theo của bạn
          </h1>
          <p
            className="mt-3 max-w-xl text-base text-white/90 sm:text-lg"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            Khám phá những căn hộ, biệt thự và trải nghiệm độc đáo trên khắp Việt
            Nam.
          </p>
        </div>
      </div>
    </div>
  );
}

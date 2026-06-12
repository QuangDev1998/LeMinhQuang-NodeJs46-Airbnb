import React from "react";
import bannerVideo from "../../assets/image/banner.mp4";
import bannerPoster from "../../assets/image/banner-poster.jpg";

export default function Carousel() {
  return (
    <div className="container">
      <div className="relative h-[60vh] max-h-[560px] min-h-[360px] w-full overflow-hidden rounded-3xl bg-gray-900">
        {/* Video đã nén 77MB -> 3.3MB. poster hiện ngay lập tức (84KB) trong khi
            video tải, và là ảnh dự phòng nếu trình duyệt chặn autoplay. */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={bannerPoster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={bannerVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

        <div className="absolute bottom-8 left-5 right-5 text-white sm:bottom-10 sm:left-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80 sm:text-sm">
            Airbnb
          </p>
          <h1 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight sm:text-5xl">
            Tìm chỗ nghỉ tiếp theo của bạn
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/90 sm:mt-3 sm:text-lg">
            Khám phá những căn hộ, biệt thự và trải nghiệm độc đáo trên khắp Việt
            Nam.
          </p>
        </div>
      </div>
    </div>
  );
}

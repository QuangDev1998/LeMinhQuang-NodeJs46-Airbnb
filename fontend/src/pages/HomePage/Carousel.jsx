import React, { useState } from "react";
import bannerHD from "../../assets/image/banner-hd.mp4";
import bannerPoster from "../../assets/image/banner-poster.jpg";
import bannerMobile from "../../assets/image/banner-mobile.jpg";

export default function Carousel() {
  // Desktop (>=768px): video nét 1080p. Mobile: ảnh tĩnh (nhẹ, không lỗi autoplay
  // trong webview Zalo/Messenger).
  const [isDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches
  );

  return (
    <div className="container">
      <div className="relative h-[38vh] max-h-[360px] min-h-[230px] w-full overflow-hidden rounded-3xl bg-gray-900 md:h-[60vh] md:max-h-[560px] md:min-h-[360px]">
        {isDesktop ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={bannerPoster}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={bannerHD} type="video/mp4" />
          </video>
        ) : (
          <img
            src={bannerMobile}
            alt="Không gian nghỉ dưỡng"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

        <div className="absolute bottom-6 left-5 right-5 text-white sm:bottom-10 sm:left-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80 sm:text-sm">
            Airbnb
          </p>
          <h1 className="mt-1.5 max-w-2xl text-xl font-extrabold leading-tight sm:mt-2 sm:text-5xl">
            Tìm chỗ nghỉ tiếp theo của bạn
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-white/90 sm:mt-3 sm:text-lg">
            Khám phá những căn hộ, biệt thự và trải nghiệm độc đáo trên khắp Việt
            Nam.
          </p>
        </div>
      </div>
    </div>
  );
}

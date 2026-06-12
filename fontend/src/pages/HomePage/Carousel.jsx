import React, { useEffect, useRef, useState } from "react";
import bannerSD from "../../assets/image/banner.mp4";
import bannerHD from "../../assets/image/banner-hd.mp4";
import bannerPoster from "../../assets/image/banner-poster.jpg";

export default function Carousel() {
  // Desktop (>=768px) tải bản nét 1080p (~12MB); mobile tải bản nhẹ 720p (~3.3MB).
  const [src] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches
      ? bannerHD
      : bannerSD
  );
  const videoRef = useRef(null);

  // React không phải lúc nào cũng set thật thuộc tính `muted` lên DOM -> mobile
  // (iOS/Android) chặn autoplay. Ép muted + gọi play() để banner tự chạy.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    // Một số máy cần play lại khi đã có dữ liệu / khi quay lại tab
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [src]);

  return (
    <div className="container">
      <div className="relative h-[60vh] max-h-[560px] min-h-[360px] w-full overflow-hidden rounded-3xl bg-gray-900">
        <video
          ref={videoRef}
          key={src}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={bannerPoster}
          className="absolute inset-0 h-full w-full object-cover"
        />
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

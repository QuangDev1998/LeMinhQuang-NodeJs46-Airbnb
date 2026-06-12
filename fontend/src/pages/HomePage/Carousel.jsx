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

  // Set muted NGAY khi <video> gắn vào DOM (trước khi iOS xét quyền autoplay).
  const attachVideo = (el) => {
    videoRef.current = el;
    if (el) {
      el.muted = true;
      el.defaultMuted = true;
      el.setAttribute("muted", "");
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;

    const play = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    play();
    v.addEventListener("loadeddata", play);
    v.addEventListener("canplay", play);

    // Fallback iOS: chạm/bấm màn hình lần đầu -> phát (cử chỉ người dùng luôn được phép)
    const onGesture = () => play();
    document.addEventListener("touchstart", onGesture, { passive: true });
    document.addEventListener("click", onGesture);

    return () => {
      v.removeEventListener("loadeddata", play);
      v.removeEventListener("canplay", play);
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    };
  }, [src]);

  return (
    <div className="container">
      <div className="relative h-[60vh] max-h-[560px] min-h-[360px] w-full overflow-hidden rounded-3xl bg-gray-900">
        <video
          ref={attachVideo}
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

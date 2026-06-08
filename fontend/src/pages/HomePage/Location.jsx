import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Locations() {
  const navigate = useNavigate();
  const { themeMode } = useSelector((state) => state.darkModeSlice);
  const cards = [
    {
      id: 1,
      title: "Toàn bộ nhà",
      image:
        "https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329222%2Fmjwqhra4wbzlvoo2pe27.jpg&w=1920&q=75",
    },
    {
      id: 3,
      title: "Chỗ ở độc đáo",
      image:
        "https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329186%2Ffmoml05qcd0yk2stvl9r.jpg&w=1920&q=75",
    },
    {
      id: 7,
      title: "Trang trại và thiên nhiên",
      image:
        "https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329121%2Fguagj5r2bkccgr1paez3.jpg&w=1920&q=75",
    },
    {
      id: 6,
      title: "Cho phép mang theo thú cưng",
      image:
        "https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329252%2Fgqhtg9ua6jdrffhbrfv1.jpg&w=1920&q=75",
    },
  ];

  const handleNavigate = (id) => {
    navigate(`/rooms/${id}`);
  };

  return (
    <div id="locationSection" className={`${themeMode} container py-10`}>
      <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Ở bất cứ đâu</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            data-aos="flip-right"
            data-aos-duration="1000"
            key={card.id}
            className="group cursor-pointer"
            onClick={() => handleNavigate(card.id)}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <h3 className="absolute bottom-4 left-4 right-4 text-lg font-bold leading-tight text-white">
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

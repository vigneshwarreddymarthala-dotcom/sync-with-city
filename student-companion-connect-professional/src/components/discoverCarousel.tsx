"use client";

import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DiscoverCarousel = ({
  hImages,
  disName,
}: {
  hImages: string[];
  disName: string;
}) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const getImgPath = (img: string) => {
    return `${process.env.NEXT_PUBLIC_API_PATH}uploads/${img}`;
  };

  return (
    <Slider {...settings} className="mb-8">
      {hImages.map((tImg: string, i: number) => {
        return (
          <div key={i}>
            <Image
              src={getImgPath(tImg)}
              alt={disName}
              width={350}
              height={300}
              loading="lazy"
              itemProp="image"
              className="w-full h-auto"
            />
          </div>
        );
      })}
    </Slider>
  );
};

export default DiscoverCarousel;

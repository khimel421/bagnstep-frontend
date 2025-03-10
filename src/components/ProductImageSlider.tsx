'use client';

import { useState, useRef } from 'react';
import NextImage from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Image } from "antd";
interface Product {
  product_name: string;
  images: string[];
}

export default function ProductImageSlider({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const swiperRef = useRef<SwiperType>(null); // Reference for Swiper

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(product.images[index]);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index); // ✅ Type-safe method call
    }
  };


  return (
    <div className=" w-full max-w-lg md:p-4 rounded-2xl">
      {/* Swiper Image Display */}
      <Swiper
        ref={(instance) => {
          if (instance) swiperRef.current = instance.swiper; // ✅ Correctly assigns the Swiper instance
        }}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setSelectedImage(product.images[swiper.activeIndex])}
        className="rounded-lg"
        modules={[Navigation, Pagination]}
      >
        {product.images.map((img, index) => (
          <SwiperSlide key={index} className=''  >
            <Image
              src={img}
              alt={`Product image ${index + 1}`}
              className="rounded-lg  object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Images */}
      <div className="mt-4 flex gap-2 justify-center ">
        {product.images.map((img, index) => (
          <button
            key={index}
            className={`w-16 h-16 border rounded-lg p-1 transition-all duration-200 ${selectedImage === img ? 'border-black' : 'hover:border-gray-400'
              }`}
            onClick={() => handleThumbnailClick(index)} // Call function on click
          >
            <NextImage
              src={img}
              alt={`Thumbnail ${index + 1}`}
              width={50}
              height={50}
              className="rounded-lg w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div >
  );
}

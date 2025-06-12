import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full object-cover"
      />

      {/* Overlay for desktop, normal flow for mobile */}
      <div
        className="absolute inset-0 hidden md:flex flex-col justify-center items-start px-4 md:px-16 lg:px-24"
      >
        <BannerContent />
      </div>

      <div className="block md:hidden px-6 py-6">
        <BannerContent />
      </div>
    </div>
  )
}

// Extracted content for reuse
const BannerContent = () => {
  return (
    <>
      <h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold
        text-center md:text-left max-w-[20rem] md:max-w-[25rem] lg:max-w-[32rem]
        leading-tight lg:leading-[3rem] text-black"
      >
        Freshness You Can Trust, Savings You Will Love!
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 font-medium">
        <Link
          to="/products"
          className="group flex items-center gap-2 px-7 md:px-9 py-3
            bg-primary hover:bg-primary-dull transition rounded text-white"
        >
          Shop Now
          <img
            className="transition group-hover:translate-x-1"
            src={assets.white_arrow_icon}
            alt="arrow"
          />
        </Link>

        <Link
          to="/products"
          className="group flex items-center gap-2 px-7 py-3 md:flex cursor-pointer"
        >
          Explore Deals
          <img
            className="transition group-hover:translate-x-1"
            src={assets.black_arrow_icon}
            alt="arrow"
          />
        </Link>
      </div>
    </>
  )
}

export default MainBanner


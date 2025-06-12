import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='mt-24'>
      {/* Container */}
      <div className='relative md:flex md:items-center'>

        {/* Image Section */}
        <div className='w-full md:w-1/2'>
          <img
            src={assets.bottom_banner_image}
            alt="banner"
            className='w-full object-cover'
          />
        </div>

        {/* Text Section */}
        <div className='w-full md:w-1/2 px-6 py-8 md:absolute md:top-1/2 md:right-0 md:-translate-y-1/2 md:pr-24'>
          <div className="bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-0 rounded-lg p-4">
            <h1 className='text-2xl md:text-3xl font-semibold text-primary mb-6 text-center md:text-right'>
              Why We Are The Best?
            </h1>

            {features.map((feature, index) => (
              <div key={index} className='flex items-center gap-4 mt-2'>
                <img src={feature.icon} alt={feature.title} className='md:w-11 w-9' />
                <div>
                  <h3 className='text-lg md:text-xl font-semibold'>{feature.title}</h3>
                  <p className='text-gray-500/70 text-xs md:text-sm'>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default BottomBanner


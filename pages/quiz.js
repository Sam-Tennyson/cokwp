/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */
import React, { useEffect, useState } from 'react'
import ActiveQuizzes from '../components/ActiveQuizzes'

const Quiz = () => {
  return (
    <div style={{ fontFamily: '"Fredoka", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
      {/* Kids-friendly top banner with simple cheerful look */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap" rel="stylesheet" />
      <div
        className='w-full bg-gradient-to-r from-yellow-50 to-pink-50 p-4 rounded-b-2xl shadow-lg'
      >
        <div className='flex flex-col md:flex-row items-center gap-8'>
          <img src="/study.svg" alt="Colorful banner" className=' h-48 object-contain' />
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>Let’s Play a Quiz!</h1>
            <div className='mt-2 text-lg text-gray-500'>Pick a quiz and have fun learning.</div>
          </div>
        </div>
      </div>
      <div className='common-padding my-10'>
        <ActiveQuizzes />
      </div>
    </div>
  )
}

export default Quiz
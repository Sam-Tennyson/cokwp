/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */
import React, { useEffect, useState } from 'react'
import ActiveQuizzes from '../components/ActiveQuizzes'
import { useProfileStore } from '../stores/profile'

const Quiz = () => {
  const profile = useProfileStore((state) => state.profile)
  const isAdmin = useProfileStore((state) => state.isAdmin)
  
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
          <div className="flex-1">
            <h1 className='text-4xl font-bold text-gray-900'>Let&apos;s Play a Quiz!</h1>
            <div className='mt-2 text-lg text-gray-500'>Pick a quiz and have fun learning.</div>
            {profile && (
              <div className="mt-4 flex items-center gap-3">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {profile.first_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {profile.first_name && profile.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile.email || "User"}
                  </div>
                  {isAdmin && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            )}
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
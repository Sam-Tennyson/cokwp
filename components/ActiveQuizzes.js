import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchQuizzes } from '../services/quizzes'
import { useRouter } from 'next/router'
// import { showErrorToast } from '@/utils/toast'

const ActiveQuizzes = () => {
    const [quizzes, setQuizzes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    async function loadQuizzes() {
      try {
        setIsLoading(true)
        const data = await fetchQuizzes()
        setQuizzes(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load quizzes'
        // showErrorToast(message)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
        loadQuizzes()
    }, [])

  return (
    <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Active Quizzes</h2>
        {isLoading && <div className='text-lg text-gray-500'>Loading...</div>}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {quizzes.map((quiz) => (
            <div key={quiz.id} 
              onClick={() => router.push(`/quiz/${quiz.id}`)}
            style={{
                background: 'linear-gradient(180deg, #cffafe, #e9d5ff)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
            }}
            className='p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow'
            >
                <div className='font-bold text-xl text-gray-900 mb-2'>{quiz.title}</div>
                <div className='text-gray-700 text-sm mb-3'>{quiz.description ?? ''}</div>
                {/* lets add button here */}
                <button className='px-4 py-2 w-full bg-pink-500 text-white rounded-full font-bold shadow-sm hover:bg-pink-600 transition-colors'>Play</button>
            </div>
        ))}
        </div>
    </div>
  )
}

export default ActiveQuizzes
import React, { useEffect, useState } from 'react'
import { fetchQuizzes, fetchQuizzesWithUserAttempts } from '../services/quizzes'
import { useSessionStore } from '../stores/session'
import { useRouter } from 'next/router'
// import { showErrorToast } from '@/utils/toast'

const ActiveQuizzes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [attemptsByQuizId, setAttemptsByQuizId] = useState({})
  const userSession = useSessionStore((s) => s.userSession)
  const hasHydrated = useSessionStore((s) => s.hasHydrated)
  const router = useRouter()

  useEffect(() => {
    if (!hasHydrated) return

    async function load() {
      try {
        setIsLoading(true)
        if (userSession?.id) {
          const data = await fetchQuizzesWithUserAttempts(userSession.id)
          console.log('Quizzes with attempts:', data)
          setQuizzes(data)
          const latestByQuiz = data.reduce((acc, quiz) => {
            const attempts = (quiz.user_attempts || [])
              .filter((a) => !!a.completed_at)
              .sort((a, b) => {
                const timeA = new Date(a.completed_at || a.started_at).getTime()
                const timeB = new Date(b.completed_at || b.started_at).getTime()
                return timeB - timeA
              })
            console.log(`Quiz ${quiz.id} (${quiz.title}):`, {
              totalAttempts: quiz.user_attempts?.length || 0,
              completedAttempts: attempts.length,
              latestAttempt: attempts[0]
            })
            if (attempts[0]) {
              acc[quiz.id] = attempts[0]
            }
            return acc
          }, {})
          console.log('Latest attempts by quiz:', latestByQuiz)
          setAttemptsByQuizId(latestByQuiz)
        } else {
          const data = await fetchQuizzes()
          setQuizzes(data)
          setAttemptsByQuizId({})
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load quizzes'
        // showErrorToast(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [userSession, hasHydrated])

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>Active Quizzes</h2>
      {isLoading && <div className='text-lg text-gray-500'>Loading...</div>}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {quizzes.map((quiz) => (
          <div key={quiz.id}

            style={{
              background: 'linear-gradient(180deg, #cffafe, #e9d5ff)',
              boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
            }}
            className='p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow'
          >
            <div className='font-bold text-xl text-gray-900 mb-2'>{quiz.title}</div>
            <div className='text-gray-700 text-sm mb-3'>{quiz.description ?? ''}</div>
            {/* CTA: Play for new users or View Result for users with attempts */}
            {userSession?.id && attemptsByQuizId[quiz.id] ? (
              <button
                onClick={() => router.push(`/quiz/${quiz.id}/result?attemptId=${attemptsByQuizId[quiz.id].id}`)}
                className='px-4 py-2 w-full bg-indigo-600 text-white rounded-full font-bold shadow-sm hover:bg-indigo-700 transition-colors'
              >
                View Result
              </button>
            ) : (
              <button
                onClick={() => router.push(`/quiz/${quiz.id}`)}
                className='px-4 py-2 w-full bg-pink-500 text-white rounded-full font-bold shadow-sm hover:bg-pink-600 transition-colors'
              >
                Play
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActiveQuizzes
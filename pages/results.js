import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { fetchAttemptsByUserId } from '../services/attempts'
import { useSessionStore } from '../stores/session'

const Results = () => {
  const router = useRouter()
  const userSession = useSessionStore((s) => s.userSession)
  const [attempts, setAttempts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAttempts() {
      if (!userSession?.id) {
        router.push('/login')
        return
      }
      
      try {
        setIsLoading(true)
        setError('')
        const data = await fetchAttemptsByUserId(userSession.id)
        setAttempts(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load results'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadAttempts()
  }, [userSession, router])

  function getPerformanceBadge(score, total) {
    if (!total) return { emoji: '📝', color: 'bg-gray-100 text-gray-600' }
    const percentage = (score / total) * 100
    
    if (percentage === 100) {
      return { emoji: '🏆', color: 'bg-yellow-100 text-yellow-700' }
    } else if (percentage >= 80) {
      return { emoji: '⭐', color: 'bg-green-100 text-green-700' }
    } else if (percentage >= 60) {
      return { emoji: '👍', color: 'bg-blue-100 text-blue-700' }
    } else if (percentage >= 40) {
      return { emoji: '💪', color: 'bg-orange-100 text-orange-700' }
    } else {
      return { emoji: '📚', color: 'bg-purple-100 text-purple-700' }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center flex-col gap-5">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        <div className="text-lg text-gray-600 font-semibold">
          Loading Your Results...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                📊 My Results
              </h1>
              <p className="text-gray-600">
                Track your quiz performance and progress
              </p>
            </div>
            <Link href="/quiz">
              <a className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
                Take a Quiz
              </a>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 px-6 py-4 rounded-xl mb-6 font-semibold">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        {attempts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {attempts.length}
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Total Quizzes Taken
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {attempts.filter(a => {
                  const total = a.snapshot_quiz?.questions?.length || 0
                  const percentage = total > 0 ? (a.score / total) * 100 : 0
                  return percentage >= 80
                }).length}
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Excellent Scores (80%+)
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {attempts.filter(a => {
                  const total = a.snapshot_quiz?.questions?.length || 0
                  const percentage = total > 0 ? (a.score / total) * 100 : 0
                  return percentage === 100
                }).length}
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Perfect Scores
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {attempts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Results Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start taking quizzes to see your results here!
            </p>
            <Link href="/quiz">
              <a className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
                Browse Quizzes
              </a>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const quiz = attempt.snapshot_quiz
              const totalQuestions = quiz?.questions?.length || 0
              const score = attempt.score || 0
              const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
              const badge = getPerformanceBadge(score, totalQuestions)
              
              return (
                <Link key={attempt.id} href={`/quiz/${attempt.quiz_id}/result?attemptId=${attempt.id}`}>
                  <a className="block bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                    <div className="flex items-start gap-4 flex-wrap">
                      {/* Badge */}
                      <div className={`${badge.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>
                        {badge.emoji}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                          {quiz?.title || 'Quiz'}
                        </h3>
                        <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600 mb-3">
                          <span>
                            📅 {new Date(attempt.completed_at || attempt.started_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span>⏱️ {new Date(attempt.completed_at || attempt.started_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                        
                        {/* Score Bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-700">
                              Score: {score}/{totalQuestions}
                            </span>
                            <span className="text-sm font-bold text-gray-700">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                percentage === 100 
                                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                                  : percentage >= 80
                                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                                  : percentage >= 60
                                  ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                                  : 'bg-gradient-to-r from-orange-400 to-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="text-gray-400 text-2xl flex-shrink-0">
                        →
                      </div>
                    </div>
                  </a>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Results


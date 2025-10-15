import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { fetchAttemptById } from '../../../services/attempts'
import { fetchAnswersByAttemptId } from '../../../services/answers'
import ResultBadge from '../../../components/ResultBadge'
import Confetti from '../../../components/Confetti'
import AuthGuard from '../../../components/AuthGuard'

const QuizResult = () => {
  const router = useRouter()
  const { id, attemptId } = router.query
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadResultData() {
      if (!attemptId) return
      
      try {
        setIsLoading(true)
        setError('')
        const [attemptData, answersData] = await Promise.all([
          fetchAttemptById(attemptId),
          fetchAnswersByAttemptId(attemptId)
        ])
        setAttempt(attemptData)
        setAnswers(answersData)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load results'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadResultData()
  }, [attemptId])

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center flex-col gap-5">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
          <div className="text-lg text-gray-600 font-semibold">
            Loading Results...
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/quiz">
              <a className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Back to Quizzes
              </a>
            </Link>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!attempt) {
    return null
  }

  const quiz = attempt.snapshot_quiz
  const totalQuestions = quiz?.questions?.length || answers.length
  const score = attempt.score || 0
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
  const showConfetti = percentage >= 80

  return (
    <AuthGuard>
      <div className="min-h-screen  py-8 px-4 md:px-6 lg:px-8">
      {showConfetti && <Confetti duration={4000} />}
      
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/quiz">
            <a className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              <span>←</span>
              <span>Back to Quizzes</span>
            </a>
          </Link>
        </div>

        {/* Quiz Title */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-lg text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {quiz?.title || 'Quiz Results'}
          </h1>
          <p className="text-gray-500">
            Completed on {new Date(attempt.completed_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Result Badge */}
        <div className="mb-6">
          <ResultBadge score={score} total={totalQuestions} />
        </div>

        {/* Detailed Stats */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📊 Your Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {score}
              </div>
              <div className="text-sm font-semibold text-green-700">
                Correct Answers
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center border-2 border-red-200">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {totalQuestions - score}
              </div>
              <div className="text-sm font-semibold text-red-700">
                Incorrect Answers
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {totalQuestions}
              </div>
              <div className="text-sm font-semibold text-blue-700">
                Total Questions
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        {answers.length > 0 && quiz?.questions && (
          <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📝 Answer Review
            </h2>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const answer = answers.find(a => a.question_id === question.id)
                const isCorrect = answer?.is_correct
                
                return (
                  <div 
                    key={question.id} 
                    className={`rounded-xl p-5 border-2 ${
                      isCorrect 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {question.question_text}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl ${isCorrect ? '' : 'opacity-50'}`}>
                              {isCorrect ? '✓' : '✗'}
                            </span>
                            <span className="text-sm">
                              <span className="font-semibold">Your answer: </span>
                              <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                {answer?.selected_option || 'Not answered'}
                              </span>
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="flex items-center gap-2 pl-8">
                              <span className="text-sm">
                                <span className="font-semibold">Correct answer: </span>
                                <span className="text-green-700">
                                  {question.correct_answer}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* <Link href={`/quiz/${id}`}>
            <a className="flex-1 min-w-[200px] px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
              🔄 Try Again
            </a>
          </Link> */}
          <Link href="/quiz">
            <a className="flex-1 min-w-[200px] px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
              📚 More Quizzes
            </a>
          </Link>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}

export default QuizResult


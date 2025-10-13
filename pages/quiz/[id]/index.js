import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchQuizById, fetchQuizQuestions } from '../../../services/quizzes'
import { createQuizAttempt, completeQuizAttempt } from '../../../services/attempts'
import { createAnswersBatch, calculateAttemptScore } from '../../../services/answers'
import { useSessionStore } from '../../../stores/session'
import QuizInstructions from '../../../components/QuizInstructions'
import QuizQuestion from '../../../components/QuizQuestion'
import QuizProgress from '../../../components/QuizProgress'

const QUIZ_STAGES = {
  LOADING: 'loading',
  INSTRUCTIONS: 'instructions',
  ACTIVE: 'active',
  SUBMITTING: 'submitting'
}

const QuizDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(null)
  const [stage, setStage] = useState(QUIZ_STAGES.LOADING)
  const userSession = useSessionStore((s) => s.userSession)

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  async function loadQuizDetail(quizId) {
    try {
      setIsLoading(true)
      setError('')
      const [quizData, questionData] = await Promise.all([
        fetchQuizById(quizId),
        fetchQuizQuestions(quizId)
      ])
      const quizWithCount = { ...quizData, question_count: questionData.length }
      setQuiz(quizWithCount)
      setQuestions(questionData)
      setStage(QUIZ_STAGES.INSTRUCTIONS)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load quiz'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    loadQuizDetail(id)
  }, [id])

  useEffect(() => {
    if (stage !== QUIZ_STAGES.ACTIVE) return

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = 'You have an active quiz! Are you sure you want to leave?'
      return e.returnValue
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [stage])

  function selectAnswer(questionId, option) {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  async function handleStartAttempt() {
    if (!userSession?.id || !id) {
      setError('Please sign in to start the quiz')
      router.push('/login')
      return
    }
    try {
      setStage(QUIZ_STAGES.ACTIVE)
      const created = await createQuizAttempt({ quiz_id: id, user_id: userSession.id })
      setAttempt(created)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start quiz'
      setError(message)
      setStage(QUIZ_STAGES.INSTRUCTIONS)
    }
  }

  async function handleSubmitAttempt() {
    if (!attempt) {
      setError('Start the quiz first')
      return
    }
    if (Object.keys(answers).length === 0) {
      setError('Please answer at least one question')
      return
    }
    try {
      setStage(QUIZ_STAGES.SUBMITTING)
      const answerInputs = Object.entries(answers).map(([questionId, selectedOption]) => {
        const question = questions.find((q) => q.id === questionId)
        if (!question) {
          throw new Error(`Question not found: ${questionId}`)
        }
        return {
          attempt_id: attempt.id,
          question_id: questionId,
          selected_option: selectedOption,
          correct_option: question.correct_answer,
        }
      })
      await createAnswersBatch(answerInputs)
      const score = await calculateAttemptScore(attempt.id)
      await completeQuizAttempt(attempt.id, { score })
      
      router.push(`/quiz/${id}/result?attemptId=${attempt.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit quiz'
      setError(message)
      setStage(QUIZ_STAGES.ACTIVE)
    }
  }

  if (stage === QUIZ_STAGES.LOADING || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center flex-col gap-5">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        <div className="text-lg text-gray-600 font-semibold">
          Loading Quiz...
        </div>
      </div>
    )
  }

  if (stage === QUIZ_STAGES.INSTRUCTIONS && quiz) {
    return (
      <div className="min-h-screen ">
        {error && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-6 py-3 rounded-lg font-semibold z-50 shadow-lg">
            {error}
          </div>
        )}
        <QuizInstructions 
          quiz={quiz} 
          onStart={handleStartAttempt}
          isStarting={false}
        />
      </div>
    )
  }

  if (stage === QUIZ_STAGES.ACTIVE && quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 md:px-6 lg:px-8">
        {error && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-6 py-3 rounded-lg font-semibold z-50 shadow-lg">
            {error}
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {quiz.title}
            </h1>
            {quiz.created_by && (
              <p className="text-sm text-gray-500">
                By {quiz.created_by.first_name} {quiz.created_by.last_name}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <QuizProgress 
            current={answeredCount}
            total={questions.length}
            answeredCount={answeredCount}
          />

          {/* Questions */}
          <div>
            {questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                totalQuestions={questions.length}
                selectedAnswer={answers[question.id]}
                onSelectAnswer={(option) => selectAnswer(question.id, option)}
                isDisabled={false}
              />
            ))}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 mt-6 mb-8 shadow-lg flex flex-wrap gap-4 items-center">
            <button
              onClick={handleSubmitAttempt}
              disabled={answeredCount === 0}
              className={`
                flex-1 min-w-[200px] py-4 px-8 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-200
                ${answeredCount === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:-translate-y-1 hover:shadow-xl active:translate-y-0'
                }
              `}
            >
              🎯 Submit Quiz
            </button>
            <div className="text-base md:text-lg text-gray-600 font-semibold">
              {answeredCount} of {questions.length} answered
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === QUIZ_STAGES.SUBMITTING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center flex-col gap-6 px-4">
        <div className="w-20 h-20 border-8 border-gray-200 border-t-green-500 rounded-full animate-spin" />
        <div className="text-2xl md:text-3xl text-gray-800 font-bold text-center">
          📝 Submitting Your Quiz...
        </div>
        <div className="text-base md:text-lg text-gray-600 text-center">
          Please wait while we calculate your score
        </div>
      </div>
    )
  }

  return null
}

export default QuizDetail


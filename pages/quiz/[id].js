import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchQuizById, fetchQuizQuestions } from '../../services/quizzes'
import { createQuizAttempt, completeQuizAttempt } from '../../services/attempts'
import { createAnswersBatch, calculateAttemptScore } from '../../services/answers'
import { useSessionStore } from '../../stores/session'

const QuizDetail = () => {
    const router = useRouter()
    const { id } = router.query
    const [quiz, setQuiz] = useState(null)
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [attempt, setAttempt] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
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
            setQuiz(quizData)
            setQuestions(questionData)
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

    function selectAnswer(questionId, option) {
        setAnswers(prev => ({ ...prev, [questionId]: option }))
    }

    async function handleStartAttempt() {
        if (!userSession?.id || !id) {
            setError('Please sign in to start the quiz')
            return
        }
        try {
            const created = await createQuizAttempt({ quiz_id: id, user_id: userSession.id })
            setAttempt(created)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to start quiz'
            setError(message)
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
            setIsSubmitting(true)
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
            const updated = await completeQuizAttempt(attempt.id, { score })
            setAttempt(updated)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to submit quiz'
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    function renderQuestion(question) {
        return (
            <div key={question.id} style={{ marginBottom: 24, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>{question.question_text}</div>
                <div>
                    {question.options?.map((option) => {
                        const isSelected = answers[question.id] === option
                        return (
                            <button
                                key={option}
                                onClick={() => selectAnswer(question.id, option)}
                                style={{
                                    display: 'block',
                                    textAlign: 'left',
                                    width: '100%',
                                    marginBottom: 8,
                                    padding: '10px 12px',
                                    borderRadius: 6,
                                    border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                    background: isSelected ? '#eff6ff' : '#ffffff',
                                    cursor: 'pointer'
                                }}
                            >
                                {option}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
            {isLoading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {quiz && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        marginBottom: 16,
                        padding: 16,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #eef2ff, #eff6ff)'
                    }}>
                        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{quiz.title}</h1>
                        {quiz.created_by && (
                            <div style={{ color: '#6b7280' }}>By {quiz.created_by.first_name} {quiz.created_by.last_name}</div>
                        )}
                        <div style={{ marginTop: 8, color: '#6b7280' }}>Answered: {answeredCount}/{questions.length}</div>
                        <div style={{ marginTop: 12 }}>
                            <button
                                onClick={handleStartAttempt}
                                disabled={!!attempt}
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: 8,
                                    background: '#2563eb',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    opacity: attempt ? 0.6 : 1
                                }}
                            >
                                {attempt ? 'Attempt Started' : 'Start Quiz'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div>
                {questions.map(renderQuestion)}
            </div>
            <div style={{ marginTop: 16 }}>
                <button
                    onClick={handleSubmitAttempt}
                    disabled={!attempt || isSubmitting}
                    style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: !attempt || isSubmitting ? 0.6 : 1
                    }}
                >
                    Submit
                </button>
                {attempt && (
                    <span style={{ marginLeft: 12, color: '#6b7280' }}>Selected: {Object.keys(answers).length}/{questions.length}</span>
                )}
            </div>
        </div>
    )
}

export default QuizDetail



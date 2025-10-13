import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchQuizzes } from '../services/quizzes'
// import { showErrorToast } from '@/utils/toast'

const ActiveQuizzes = () => {
    const [quizzes, setQuizzes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    
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
        <h1>Active Quizzes</h1>
        {isLoading && <div>Loading...</div>}
        {quizzes.map((quiz) => (
            <div key={quiz.id} style={{
                marginBottom: 16,
                padding: 16,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)'
            }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{quiz.title}</div>
                <div style={{ color: '#6b7280', marginBottom: 12 }}>{quiz.description ?? ''}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/quiz/${quiz.id}`} style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: '#2563eb',
                        color: '#fff'
                    }}>Start Quiz</Link>
                    <Link href={`/quiz/${quiz.id}`} style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: '#e5e7eb',
                        color: '#111827'
                    }}>View Details</Link>
                </div>
            </div>
        ))}
    </div>
  )
}

export default ActiveQuizzes
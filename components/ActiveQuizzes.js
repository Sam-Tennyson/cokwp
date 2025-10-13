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
        <h2 style={{
            // margin: '12px 0 20px',
            fontSize: 28,
            lineHeight: '32px',
            fontWeight: 700,
            color: '#0f172a'
        }}>Active Quizzes</h2>
        {isLoading && <div style={{ fontSize: 18 }}>Loading...</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {quizzes.map((quiz) => (
            <div key={quiz.id} style={{
                padding: 18,
                borderRadius: 20,
                background: 'linear-gradient(180deg, #cffafe, #e9d5ff)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
            }}>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 22, color: '#0f172a' }}>{quiz.title}</div>
                <div style={{ color: '#475569', marginBottom: 12, fontSize: 14 }}>{quiz.description ?? ''}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Link href={`/quiz/${quiz.id}`} style={{
                        padding: '10px 14px',
                        borderRadius: 9999,
                        background: '#22c55e',
                        color: '#ffffff',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 3px 0 #16a34a'
                    }}>Play</Link>
                    <Link href={`/quiz/${quiz.id}`} style={{
                        padding: '10px 14px',
                        borderRadius: 9999,
                        background: '#fcd34d',
                        color: '#0f172a',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 3px 0 #f59e0b'
                    }}>Details</Link>
                </div>
            </div>
        ))}
        </div>
    </div>
  )
}

export default ActiveQuizzes
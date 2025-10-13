import React, { useEffect, useState } from 'react'

const Confetti = ({ duration = 3000 }) => {
  const [pieces, setPieces] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Generate random confetti pieces
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 0.5,
      animationDuration: 2 + Math.random() * 2,
      color: ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'][Math.floor(Math.random() * 8)],
      rotation: Math.random() * 360
    }))
    setPieces(confettiPieces)

    // Hide confetti after duration
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} opacity-80`}
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `fall ${piece.animationDuration}s linear ${piece.animationDelay}s`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  )
}

export default Confetti


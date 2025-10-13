import React from 'react'

const ResultBadge = ({ score, total }) => {
  const percentage = (score / total) * 100
  
  const getBadgeInfo = () => {
    if (percentage === 100) {
      return {
        emoji: '🏆',
        title: 'Perfect Score!',
        subtitle: 'You\'re a Champion!',
        bgGradient: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
        message: 'Incredible! You got every question right!'
      }
    } else if (percentage >= 80) {
      return {
        emoji: '⭐',
        title: 'Excellent!',
        subtitle: 'Super Star!',
        bgGradient: 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600',
        message: 'Amazing work! You did great!'
      }
    } else if (percentage >= 60) {
      return {
        emoji: '👍',
        title: 'Good Job!',
        subtitle: 'Well Done!',
        bgGradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500',
        message: 'Nice effort! Keep practicing!'
      }
    } else if (percentage >= 40) {
      return {
        emoji: '💪',
        title: 'Keep Trying!',
        subtitle: 'You Can Do It!',
        bgGradient: 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-400',
        message: 'Don\'t give up! Practice makes perfect!'
      }
    } else {
      return {
        emoji: '📚',
        title: 'Keep Learning!',
        subtitle: 'Practice More!',
        bgGradient: 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500',
        message: 'Every expert was once a beginner!'
      }
    }
  }

  const badgeInfo = getBadgeInfo()

  return (
    <div className={`${badgeInfo.bgGradient} rounded-3xl p-8 md:p-10 text-white text-center shadow-2xl transform transition-all hover:scale-105`}>
      <div className="text-8xl mb-4 animate-bounce">
        {badgeInfo.emoji}
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-2">
        {badgeInfo.title}
      </h2>
      <p className="text-xl md:text-2xl font-semibold opacity-90 mb-6">
        {badgeInfo.subtitle}
      </p>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 mb-4">
        <div className="text-6xl md:text-7xl font-bold mb-2">
          {score}/{total}
        </div>
        <div className="text-xl font-semibold">
          {percentage.toFixed(0)}% Correct
        </div>
      </div>
      <p className="text-lg opacity-90">
        {badgeInfo.message}
      </p>
    </div>
  )
}

export default ResultBadge


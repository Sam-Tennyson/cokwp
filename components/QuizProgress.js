import React from 'react'

const QuizProgress = ({ current, total, answeredCount }) => {
  const progressPercentage = (answeredCount / total) * 100
  const isComplete = progressPercentage === 100

  return (
    <div className="sticky top-20 z-10 bg-white p-5 md:p-6 rounded-2xl shadow-lg mb-6">
      
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-semibold text-gray-500">
          Quiz Progress
        </div>
        <div className={`text-base md:text-lg font-bold ${isComplete ? 'text-green-600' : 'text-indigo-600'}`}>
          {answeredCount}/{total} answered
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
        <div 
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-xl text-sm font-semibold text-center animate-pulse">
          🎉 All questions answered! Ready to submit?
        </div>
      )}
    </div>
  )
}

export default QuizProgress


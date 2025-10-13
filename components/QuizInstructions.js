import React from 'react'

const QuizInstructions = ({ quiz, onStart, isStarting }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-3xl p-8 md:p-10 lg:p-12 shadow-2xl text-white">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">
            🎯
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            {quiz.title}
          </h1>
          {quiz.created_by && (
            <p className="text-base md:text-lg opacity-90">
              By {quiz.created_by.first_name} {quiz.created_by.last_name}
            </p>
          )}
        </div>

        {/* Instructions Box */}
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            📋 Instructions
          </h2>
          <ul className="space-y-3 text-base leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">✓</span>
              <span>Read each question carefully before answering</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">✓</span>
              <span>Select the option you think is correct</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">✓</span>
              <span>You can change your answer before submitting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">✓</span>
              <span>Don&apos;t refresh the page during the quiz!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">✓</span>
              <span>Click submit when you&apos;re done</span>
            </li>
          </ul>
        </div>

        {/* Question Count Box */}
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 mb-8 text-center">
          <div className="text-5xl md:text-6xl font-bold mb-2">
            {quiz.question_count || '?'}
          </div>
          <div className="text-base md:text-lg opacity-90">
            Total Questions
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={isStarting}
          className={`w-full py-4 px-8 text-lg md:text-xl font-bold bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-xl shadow-lg transition-all duration-200 ${
            isStarting 
              ? 'opacity-70 cursor-not-allowed' 
              : 'hover:-translate-y-1 hover:shadow-2xl active:translate-y-0'
          }`}
        >
          {isStarting ? '⏳ Starting...' : '🚀 Start Quiz'}
        </button>
      </div>
    </div>
  )
}

export default QuizInstructions


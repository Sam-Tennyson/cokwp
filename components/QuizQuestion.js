import React from 'react'

const QuizQuestion = ({ question, questionNumber, totalQuestions, selectedAnswer, onSelectAnswer, isDisabled }) => {
  const colorSchemes = [
    { bg: 'bg-gradient-to-br from-red-400 to-red-500', border: 'border-red-400', bgLight: 'bg-red-50', hoverBorder: 'hover:border-red-400', hoverBg: 'hover:bg-red-50' },
    { bg: 'bg-gradient-to-br from-teal-400 to-teal-500', border: 'border-teal-400', bgLight: 'bg-teal-50', hoverBorder: 'hover:border-teal-400', hoverBg: 'hover:bg-teal-50' },
    { bg: 'bg-gradient-to-br from-blue-400 to-blue-500', border: 'border-blue-400', bgLight: 'bg-blue-50', hoverBorder: 'hover:border-blue-400', hoverBg: 'hover:bg-blue-50' },
    { bg: 'bg-gradient-to-br from-orange-400 to-orange-500', border: 'border-orange-400', bgLight: 'bg-orange-50', hoverBorder: 'hover:border-orange-400', hoverBg: 'hover:bg-orange-50' },
    { bg: 'bg-gradient-to-br from-green-400 to-green-500', border: 'border-green-400', bgLight: 'bg-green-50', hoverBorder: 'hover:border-green-400', hoverBg: 'hover:bg-green-50' },
    { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500', border: 'border-yellow-400', bgLight: 'bg-yellow-50', hoverBorder: 'hover:border-yellow-400', hoverBg: 'hover:bg-yellow-50' },
    { bg: 'bg-gradient-to-br from-purple-400 to-purple-500', border: 'border-purple-400', bgLight: 'bg-purple-50', hoverBorder: 'hover:border-purple-400', hoverBg: 'hover:bg-purple-50' },
    { bg: 'bg-gradient-to-br from-indigo-400 to-indigo-500', border: 'border-indigo-400', bgLight: 'bg-indigo-50', hoverBorder: 'hover:border-indigo-400', hoverBg: 'hover:bg-indigo-50' },
  ]
  
  const colorScheme = colorSchemes[questionNumber % colorSchemes.length]
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-lg border-3 border-gray-100 transition-transform hover:shadow-xl">
      
      {/* Question Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`${colorScheme.bg} text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-md flex-shrink-0`}>
          {questionNumber}
        </div>
        <div className="flex-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Question {questionNumber} of {totalQuestions}
        </div>
      </div>

      {/* Question Text */}
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
        {question.question_text}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const isSelected = selectedAnswer === option
          
          return (
            <button
              key={option}
              onClick={() => !isDisabled && onSelectAnswer(option)}
              disabled={isDisabled}
              className={`
                flex items-center gap-4 text-left w-full p-4 rounded-xl transition-all duration-200
                ${isSelected 
                  ? `border-3 ${colorScheme.border} ${colorScheme.bgLight} font-semibold` 
                  : `border-2 border-gray-200 bg-white ${!isDisabled && colorScheme.hoverBorder} ${!isDisabled && colorScheme.hoverBg} ${!isDisabled && 'hover:translate-x-1'}`
                }
                ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Option Label */}
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all
                ${isSelected 
                  ? `${colorScheme.bg} text-white` 
                  : 'bg-gray-100 text-gray-500'
                }
              `}>
                {optionLabels[index]}
              </div>
              
              {/* Option Text */}
              <span className="flex-1 text-base text-gray-700">
                {option}
              </span>
              
              {/* Check Mark */}
              {isSelected && (
                <div className={`w-6 h-6 rounded-full ${colorScheme.bg} text-white flex items-center justify-center text-xs flex-shrink-0`}>
                  ✓
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuizQuestion


import { useState } from 'react'
import QuestionScreen from './components/QuestionScreen'
import StartScreen from './components/StartScreen'

function App() {
  const [questions, setQuestions] = useState([])
  const [screen, setScreen] = useState('start') // 'start' | 'question'
  const [mode, setMode] = useState(null) // 'practice' | 'exam'

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: selectedOptionId }
  const [reviewFlags, setReviewFlags] = useState({}) // { questionId: boolean }

  // StartScreenから呼ばれる: データ読み込み完了時
  const handleQuestionsLoaded = (data) => {
    setQuestions(data)
  }

  // StartScreenから呼ばれる: モード選択・開始時
  const handleStart = (selectedMode) => {
    setMode(selectedMode)
    setScreen('question')
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setReviewFlags({})
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      alert("最後の問題です。後ほど結果画面を実装します。")
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleOptionSelect = (optionId) => {
    const currentQuestion = questions[currentQuestionIndex]
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }))
  }

  const handleFlagToggle = () => {
    const currentQuestion = questions[currentQuestionIndex]
    setReviewFlags(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }))
  }

  // 画面振り分け
  if (screen === 'start') {
    return (
      <StartScreen
        onQuestionsLoaded={handleQuestionsLoaded}
        onStart={handleStart}
      />
    )
  }

  if (screen === 'question') {
    const currentQuestion = questions[currentQuestionIndex]
    // データがない場合のガード（通常ありえないが念のため）
    if (!currentQuestion) return <div>Loading...</div>

    return (
      <QuestionScreen
        question={currentQuestion}
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onNext={handleNext}
        onPrev={handlePrev}
        selectedOption={userAnswers[currentQuestion.id] || null}
        onOptionSelect={handleOptionSelect}
        isFlagged={!!reviewFlags[currentQuestion.id]}
        onFlagToggle={handleFlagToggle}
        mode={mode}
      />
    )
  }

  return <div>Unknown Error</div>
}

export default App

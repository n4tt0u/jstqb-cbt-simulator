import { useState } from 'react'
import QuestionScreen from './components/QuestionScreen'
import StartScreen from './components/StartScreen'
import ResultScreen from './components/ResultScreen'

function App() {
  const [questions, setQuestions] = useState([])
  const [screen, setScreen] = useState('start') // 'start' | 'question' | 'result'
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

  const handleFinish = () => {
    setScreen('result')
  }

  const handleRestart = () => {
    setScreen('start')
    setMode(null)
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setReviewFlags({})
    setQuestions([])
  }

  const handleJump = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
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
        questions={questions} // 全問題データが必要（リスト表示のため）
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onJump={handleJump} // ジャンプ機能
        selectedOption={userAnswers[currentQuestion.id] || null}
        userAnswers={userAnswers} // 全回答データ（リスト表示判定用）
        reviewFlags={reviewFlags} // 全フラグデータ（リスト表示判定用）
        onOptionSelect={handleOptionSelect}
        isFlagged={!!reviewFlags[currentQuestion.id]}
        onFlagToggle={handleFlagToggle}
        mode={mode}
        onFinish={handleFinish}
      />
    )
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        questions={questions}
        userAnswers={userAnswers}
        onRestart={handleRestart}
      />
    )
  }

  return <div>Unknown Error</div>
}

export default App

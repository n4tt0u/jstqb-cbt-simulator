import { useState } from 'react'
import QuestionScreen from './components/QuestionScreen'
import StartScreen from './components/StartScreen'
import ResultScreen from './components/ResultScreen'
import { useExamTimer } from './hooks/useExamTimer'
import ConfirmModal from './components/ConfirmModal'

function App() {
  const [questions, setQuestions] = useState([])
  const [screen, setScreen] = useState('start') // 'start' | 'question' | 'result'
  const [mode, setMode] = useState(null) // 'practice' | 'exam'

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: selectedOptionId }
  const [reviewFlags, setReviewFlags] = useState({}) // { questionId: boolean }
  const [showTimeUpModal, setShowTimeUpModal] = useState(false) // 時間切れモーダル用
  const [finalTimerSeconds, setFinalTimerSeconds] = useState(null) // 結果画面に渡す固定時間

  const handleFinish = (forceZero = false) => {
    stopTimer()
    // 時間切れ即終了の場合は0(超過なし)扱い、それ以外は現在のタイマー値
    setFinalTimerSeconds(forceZero === true ? 0 : timerSeconds)
    setScreen('result')
    setShowTimeUpModal(false)
  }

  const handleTimeUp = () => {
    setShowTimeUpModal(true)
  }

  // Timer Hook
  const {
    timerSeconds,
    timeLimit,
    startTimer,
    stopTimer,
    togglePause
  } = useExamTimer(0, handleTimeUp)

  const handleQuestionsLoaded = (loadedQuestions) => {
    setQuestions(loadedQuestions)
  }

  const handleStart = (selectedMode, selectedTimeLimit) => {
    setMode(selectedMode)

    // タイマー開始 (Hook)
    startTimer(selectedTimeLimit)

    setScreen('question')
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setReviewFlags({})
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

  const handleFlagToggle = (questionId = null) => {
    // 引数でIDが渡された場合はそれを、なければ現在の問題のIDを使用
    let targetId = questionId
    if (typeof questionId !== 'number' && typeof questionId !== 'string') {
      const currentQuestion = questions[currentQuestionIndex]
      targetId = currentQuestion ? currentQuestion.id : null
    }

    if (targetId !== null) {
      setReviewFlags(prev => ({
        ...prev,
        [targetId]: !prev[targetId]
      }))
    }
  }

  // 画面振り分け
  return (
    <>
      {screen === 'start' && (
        <StartScreen
          onQuestionsLoaded={handleQuestionsLoaded}
          onStart={handleStart}
        />
      )}

      {screen === 'question' && questions[currentQuestionIndex] && (
        <QuestionScreen
          question={questions[currentQuestionIndex]}
          questions={questions}
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onJump={handleJump}
          selectedOption={userAnswers[questions[currentQuestionIndex].id] || null}
          userAnswers={userAnswers}
          reviewFlags={reviewFlags}
          onOptionSelect={handleOptionSelect}
          isFlagged={!!reviewFlags[questions[currentQuestionIndex].id]}
          onFlagToggle={handleFlagToggle}
          mode={mode}
          onFinish={handleFinish}
          timerSeconds={timerSeconds}
          timeLimit={timeLimit}
          onPauseTimer={togglePause}
          isExternalModalOpen={showTimeUpModal} // 外部モーダル（時間切れ）の状態を渡す
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          questions={questions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
          timeLimit={timeLimit}
          timerSeconds={finalTimerSeconds}
          reviewFlags={reviewFlags}
          toggleReviewFlag={handleFlagToggle}
        />
      )}

      {/* 時間切れモーダル (Appレベルで管理) */}
      <ConfirmModal
        isOpen={showTimeUpModal}
        message={"試験時間が終了しました。\n終了しますか？\n（キャンセルで継続し、超過時間を記録します）"}
        onConfirm={() => handleFinish(true)}
        onCancel={() => setShowTimeUpModal(false)}
        confirmText="終了する"
        cancelText="継続する"
        isAlert={false}
      />
    </>
  )
}

export default App

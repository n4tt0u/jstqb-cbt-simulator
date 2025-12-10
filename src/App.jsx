import { useState } from 'react'
import QuestionScreen from './components/QuestionScreen'
import StartScreen from './components/StartScreen'
import ResultScreen from './components/ResultScreen'
import { useEffect } from 'react'

function App() {
  const [questions, setQuestions] = useState([])
  const [screen, setScreen] = useState('start') // 'start' | 'question' | 'result'
  const [mode, setMode] = useState(null) // 'practice' | 'exam'
  const [timeLimit, setTimeLimit] = useState(0) // 0:無制限(CountUp), >0:制限あり(CountDown)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerPaused, setIsTimerPaused] = useState(false)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: selectedOptionId }
  const [reviewFlags, setReviewFlags] = useState({}) // { questionId: boolean }

  const handleQuestionsLoaded = (loadedQuestions) => {
    setQuestions(loadedQuestions)
  }

  const handleStart = (selectedMode, selectedTimeLimit) => {
    setMode(selectedMode)
    setTimeLimit(selectedTimeLimit)

    // タイマー初期化
    if (selectedTimeLimit > 0) {
      setTimerSeconds(selectedTimeLimit * 60) // 分 -> 秒
    } else {
      setTimerSeconds(0) // 0からカウントアップ
    }
    setIsTimerPaused(false)

    setScreen('question')
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setReviewFlags({})
  }

  // タイマー更新ループ
  useEffect(() => {
    if (screen !== 'question' || isTimerPaused) return

    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (timeLimit > 0) {
          return prev - 1
        } else {
          return prev + 1
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [screen, isTimerPaused, timeLimit])

  // 時間切れ判定 (サイドエフェクト)
  useEffect(() => {
    // 制限時間なし、またはまだ時間がある、または画面が違う場合は何もしない
    if (timeLimit === 0 || timerSeconds !== 0 || screen !== 'question') return

    // 0になった瞬間にアラート
    const timerId = setTimeout(() => {
      const continueExam = window.confirm("試験時間が終了しました。\n終了しますか？\n（キャンセルで継続し、超過時間を記録します）")
      if (continueExam) {
        handleFinish()
      }
    }, 10) // 少し遅延させてレンダリング完了を待つ

    return () => clearTimeout(timerId)
  }, [timerSeconds, timeLimit, screen])

  const handlePauseTimer = (shouldPause) => {
    setIsTimerPaused(shouldPause)
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
        timerSeconds={timerSeconds}
        timeLimit={timeLimit}
        onPauseTimer={handlePauseTimer}
      />
    )
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        questions={questions}
        userAnswers={userAnswers}
        onRestart={handleRestart}
        timeLimit={timeLimit}
        timerSeconds={timerSeconds}
      />
    )
  }

  return <div>Unknown Error</div>
}

export default App

import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import QuestionScreen from './components/QuestionScreen'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: selectedOptionId }
  const [reviewFlags, setReviewFlags] = useState({}) // { questionId: boolean }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/questions.csv')
        const reader = response.body.getReader()
        const result = await reader.read()
        const decoder = new TextDecoder('utf-8')
        const csv = decoder.decode(result.value)

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // IDなどを数値型に変換しておく
            const formattedData = results.data.map(q => ({
              ...q,
              id: Number(q.id),
              correct_option: Number(q.correct_option)
            }))
            setQuestions(formattedData)
            setLoading(false)
          },
          error: (error) => {
            console.error('Error parsing CSV:', error)
            setLoading(false)
          }
        })
      } catch (error) {
        console.error('Error fetching CSV:', error)
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      alert("最後の問題です")
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

  if (loading) return <div style={{ padding: 20 }}>Loading questions...</div>
  if (questions.length === 0) return <div style={{ padding: 20 }}>No questions found.</div>

  const currentQuestion = questions[currentQuestionIndex]

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
    />
  )
}

export default App

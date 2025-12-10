import React, { useState, useEffect } from 'react'
import '../index.css'

const QuestionScreen = ({
    question,
    questions, // 全問題リスト (ID参照用)
    currentIndex,
    totalQuestions,
    onNext,
    onPrev,
    onJump,
    selectedOption,
    userAnswers, // 全回答状況
    reviewFlags, // 全フラグ状況
    onOptionSelect,
    isFlagged,
    onFlagToggle,
    mode, // 'practice' or 'exam'
    onFinish,
    timerSeconds,
    timeLimit,
    onPauseTimer
}) => {
    const [showFeedback, setShowFeedback] = useState(false)
    const [showQuestionsList, setShowQuestionsList] = useState(false)

    // 問題が変わったら解説表示をリセット
    useEffect(() => {
        setShowFeedback(false)
    }, [question.id])

    // 一問一答モード: 解説表示中はタイマー停止
    useEffect(() => {
        if (mode === 'practice') {
            onPauseTimer(showFeedback)
        }
    }, [showFeedback, mode])

    const formatTime = (seconds) => {
        const absSeconds = Math.abs(seconds)
        const m = Math.floor(absSeconds / 60)
        const s = absSeconds % 60
        const text = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        return seconds < 0 ? `-${text}` : text
    }

    const options = [
        { id: 1, text: question.option_1 },
        { id: 2, text: question.option_2 },
        { id: 3, text: question.option_3 },
        { id: 4, text: question.option_4 },
    ]

    const handleNextClick = () => {
        // 一問一答モード かつ まだ解説を表示していない場合
        if (mode === 'practice' && !showFeedback) {
            if (selectedOption === null) {
                const confirmShow = window.confirm("解答が選択されていません。\nこのまま解説を表示しますか？")
                if (!confirmShow) return
            }
            setShowFeedback(true)
        } else {
            // それ以外（解説表示済み、または模試モード）は次の問題へ
            if (currentIndex === totalQuestions - 1) {
                onFinish()
            } else {
                onNext()
            }
        }
    }

    const handleJumpTo = (index) => {
        onJump(index)
        setShowQuestionsList(false)
    }

    // 正誤判定
    const isCorrect = selectedOption === question.correct_option

    return (
        <div className="cbt-container">
            {/* ヘッダー */}
            <header className="cbt-header">
                <div className="header-info">
                    <div className="info-row">
                        <span className="info-icon">🕒</span>
                        <span style={{
                            color: timerSeconds < 0 ? 'red' : 'inherit',
                            fontWeight: 'bold'
                        }}>
                            {timeLimit === 0 ? `経過時間 ${formatTime(timerSeconds)}` : `残り時間 ${formatTime(timerSeconds)}`}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-icon">📑</span>
                        <span>{currentIndex + 1} / {totalQuestions} 問</span>
                    </div>
                </div>
            </header>

            {/* サブヘッダー (見直しフラグ) */}
            <div className="cbt-sub-header">
                {mode === 'exam' && (
                    <div className="review-flag" onClick={onFlagToggle}>
                        <span className={`flag-icon ${isFlagged ? 'active' : ''}`}>⚑</span>
                        <span>後で見直す</span>
                    </div>
                )}
            </div>

            {/* メインエリア */}
            <main className="cbt-main">
                <div className="question-area">
                    <p className="question-text">{question.question_text}</p>
                </div>

                <div className="options-area">
                    {options.map((opt) => (
                        <label key={opt.id} className="option-label" style={{
                            cursor: showFeedback ? 'default' : 'pointer',
                            background: showFeedback && opt.id === question.correct_option ? '#e6ffe6' :
                                showFeedback && opt.id === selectedOption && opt.id !== question.correct_option ? '#ffe6e6' :
                                    'white'
                        }}>
                            <input
                                type="radio"
                                name="option"
                                value={opt.id}
                                checked={selectedOption === opt.id}
                                onChange={() => !showFeedback && onOptionSelect(opt.id)}
                                disabled={showFeedback}
                            />
                            <span className="option-text">
                                {String.fromCharCode(96 + opt.id)}) {opt.text}
                            </span>
                        </label>
                    ))}
                </div>

                {/* 解説エリア */}
                {showFeedback && (
                    <div className="feedback-area" style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: isCorrect ? 'green' : 'red' }}>
                            {isCorrect ? '✅ 正解' : '❌ 不正解'}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>正解の選択肢:</strong> {String.fromCharCode(96 + question.correct_option)})
                        </div>
                        <div>
                            <strong>解説:</strong>
                            <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{question.explanation}</p>
                        </div>
                    </div>
                )}
            </main>

            {/* フッター */}
            <footer className="cbt-footer">
                <div className="footer-buttons">
                    <button
                        className="nav-button"
                        onClick={onPrev}
                        disabled={currentIndex === 0 || showFeedback}
                        style={{ opacity: (currentIndex === 0 || showFeedback) ? 0.5 : 1 }}
                    >
                        <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>←</span> 前へ
                    </button>

                    <button
                        className="nav-button secondary"
                        onClick={() => setShowQuestionsList(true)}
                        disabled={mode === 'practice'} // 一問一答モードでは無効化
                        style={{ opacity: mode === 'practice' ? 0.3 : 1, cursor: mode === 'practice' ? 'default' : 'pointer' }}
                    >
                        <span style={{ fontSize: '1.2em' }}>❖</span> 問題の選択
                    </button>

                    <button
                        className="nav-button"
                        onClick={handleNextClick}
                    >
                        {currentIndex === totalQuestions - 1 && (!showFeedback || mode === 'exam') ? '終了' : '次へ'} <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>→</span>
                    </button>
                </div>
            </footer>

            {/* 問題一覧ポップアップ */}
            {showQuestionsList && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000
                }} onClick={() => setShowQuestionsList(false)}>
                    <div style={{
                        background: 'white',
                        width: '600px',
                        maxWidth: '90%',
                        borderRadius: '8px',
                        padding: '20px',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ textAlign: 'center', color: '#006daa', marginBottom: '20px' }}>問題一覧</h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                            gap: '10px',
                            marginBottom: '20px'
                        }}>
                            {questions.map((q, idx) => {
                                const isAnswered = userAnswers[q.id] !== undefined
                                const isCurrent = idx === currentIndex
                                const hasFlag = reviewFlags[q.id]

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => handleJumpTo(idx)}
                                        style={{
                                            padding: '10px',
                                            border: isCurrent ? '2px solid #006daa' : '1px solid #ccc',
                                            background: isAnswered ? '#eee' : 'white',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: isCurrent ? 'bold' : 'normal',
                                            position: 'relative'
                                        }}
                                    >
                                        {idx + 1}
                                        {hasFlag && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-5px',
                                                color: '#ffc107',
                                                fontSize: '1.2rem',
                                                textShadow: '0 0 2px black'
                                            }}>⚑</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={() => setShowQuestionsList(false)}
                                style={{
                                    padding: '8px 20px',
                                    background: '#666',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionScreen

import React, { useState, useEffect } from 'react'
import '../index.css'

const QuestionScreen = ({
    question,
    currentIndex,
    totalQuestions,
    onNext,
    onPrev,
    selectedOption,
    onOptionSelect,
    isFlagged,
    onFlagToggle,
    mode, // 'practice' or 'exam'
    onFinish
}) => {
    const [showFeedback, setShowFeedback] = useState(false)

    // 問題が変わったら解説表示をリセット
    useEffect(() => {
        setShowFeedback(false)
    }, [question.id])

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
                const confirmShow = window.confirm("回答が選択されていません。\nこのまま解説を表示しますか？")
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

    // 正誤判定
    const isCorrect = selectedOption === question.correct_option

    return (
        <div className="cbt-container">
            {/* ヘッダー */}
            <header className="cbt-header">
                <div className="header-info">
                    <div className="info-row">
                        <span className="info-icon">🕒</span>
                        <span>残り時間 29:59</span>
                    </div>
                    <div className="info-row">
                        <span className="info-icon">📑</span>
                        <span>{currentIndex + 1} / {totalQuestions} 問</span>
                    </div>
                </div>
            </header>

            {/* サブヘッダー（見直しフラグ） */}
            <div className="cbt-sub-header">
                <div className="review-flag" onClick={onFlagToggle}>
                    <span className={`flag-icon ${isFlagged ? 'active' : ''}`}>⚑</span>
                    <span>後で見直す</span>
                </div>
            </div>

            {/* メインエリア */}
            <main className="cbt-main">
                <div className="question-area">
                    <p className="question-text">{question.question_text}</p>
                </div>

                <div className="options-area">
                    {options.map((opt) => {
                        // 解説表示中は、正解・不正解の色付けなどを行っても良いが
                        // シンプルに「選択したものがどれか」はわかるようにしておく
                        return (
                            <label key={opt.id} className="option-label" style={{
                                cursor: showFeedback ? 'default' : 'pointer',
                                background: showFeedback && opt.id === question.correct_option ? '#e6ffe6' : // 正解の選択肢を少し緑に
                                    showFeedback && opt.id === selectedOption && opt.id !== question.correct_option ? '#ffe6e6' : // 間違えた選択肢を少し赤に
                                        'white'
                            }}>
                                <input
                                    type="radio"
                                    name="option"
                                    value={opt.id}
                                    checked={selectedOption === opt.id}
                                    onChange={() => !showFeedback && onOptionSelect(opt.id)}
                                    disabled={showFeedback} // 解説中は変更不可
                                />
                                <span className="option-text">
                                    {String.fromCharCode(96 + opt.id)}) {opt.text}
                                </span>
                            </label>
                        )
                    })}
                </div>

                {/* 解説エリア (一問一答モードのみ表示) */}
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
                        disabled={currentIndex === 0 || showFeedback} // 解説中も戻れるようにするかは要件次第だが、一旦戻るの禁止にしてみる（整合性のため）
                        style={{ opacity: (currentIndex === 0 || showFeedback) ? 0.5 : 1 }}
                    >
                        <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>←</span> 前へ
                    </button>

                    <button className="nav-button secondary">
                        <span style={{ fontSize: '1.2em' }}>❖</span> 問題の選択
                    </button>

                    <button
                        className="nav-button"
                        onClick={handleNextClick}
                    >
                        {/* 一問一答モードで解説未表示なら「回答」ボタンに見せかけるのもありだが、統一して「次へ」 */}
                        {currentIndex === totalQuestions - 1 && (!showFeedback || mode === 'exam') ? '終了' : '次へ'} <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>→</span>
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default QuestionScreen

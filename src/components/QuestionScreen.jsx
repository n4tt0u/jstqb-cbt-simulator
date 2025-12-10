import React from 'react'
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
    onFlagToggle
}) => {
    const options = [
        { id: 1, text: question.option_1 },
        { id: 2, text: question.option_2 },
        { id: 3, text: question.option_3 },
        { id: 4, text: question.option_4 },
    ]

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
                    {options.map((opt) => (
                        <label key={opt.id} className="option-label">
                            <input
                                type="radio"
                                name="option"
                                value={opt.id}
                                checked={selectedOption === opt.id}
                                onChange={() => onOptionSelect(opt.id)}
                            />
                            <span className="option-text">
                                {String.fromCharCode(96 + opt.id)}) {opt.text}
                            </span>
                        </label>
                    ))}
                </div>
            </main>

            {/* フッター */}
            <footer className="cbt-footer">
                <div className="footer-buttons">
                    <button
                        className="nav-button"
                        onClick={onPrev}
                        disabled={currentIndex === 0}
                    >
                        <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>←</span> 前へ
                    </button>

                    <button className="nav-button secondary">
                        <span style={{ fontSize: '1.2em' }}>❖</span> 問題の選択
                    </button>

                    <button
                        className="nav-button"
                        onClick={onNext}
                    >
                        {currentIndex === totalQuestions - 1 ? '終了' : '次へ'} <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>→</span>
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default QuestionScreen

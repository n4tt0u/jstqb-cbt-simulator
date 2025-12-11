import React, { useState } from 'react'
import { COLORS } from '../constants/theme'
import ExplanationModal from './ExplanationModal'

const ResultScreen = ({ questions, userAnswers, onRestart, timeLimit, timerSeconds, reviewFlags }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(null)

    // 正答数の計算
    const correctCount = questions.reduce((count, q) => {
        return count + (userAnswers[q.id] === q.correct_option ? 1 : 0)
    }, 0)

    const totalCount = questions.length
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

    // 経過時間の計算
    const calculateElapsedTime = () => {
        if (timeLimit === 0) {
            return timerSeconds
        } else {
            return (timeLimit * 60) - timerSeconds
        }
    }
    const elapsedSeconds = calculateElapsedTime()

    // 時間フォーマット
    const formatTime = (seconds) => {
        const absSeconds = Math.abs(seconds)
        const m = Math.floor(absSeconds / 60)
        const s = absSeconds % 60
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    const handleRowClick = (question) => {
        setSelectedQuestion(question)
    }

    const handleClosePopup = () => {
        setSelectedQuestion(null)
    }

    return (
        <div className="cbt-container" style={{ background: COLORS.BACKGROUND, overflowY: 'auto' }}>
            <div style={{
                maxWidth: '800px',
                width: '95%',
                margin: '40px auto',
                background: COLORS.WHITE,
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: COLORS.PRIMARY,
                    borderBottom: '2px solid #eee',
                    paddingBottom: '20px',
                    marginBottom: '30px'
                }}>
                    試験結果
                </h1>

                {/* スコア表示エリア */}
                <div style={{
                    textAlign: 'center',
                    background: '#e3effd',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ fontSize: '1.2rem', color: COLORS.TEXT_SUB, marginBottom: '10px' }}>総合スコア</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: COLORS.PRIMARY }}>
                        {correctCount} / {totalCount} 問
                    </div>
                    <div style={{ fontSize: '1.5rem', marginTop: '5px', color: COLORS.TEXT_SUB }}>
                        正答率: {percentage}%
                    </div>
                    <div style={{ marginTop: '15px', fontSize: '1.2rem', color: COLORS.TEXT_MAIN }}>
                        経過時間: <strong>{formatTime(elapsedSeconds)}</strong>
                        {timeLimit > 0 && elapsedSeconds > (timeLimit * 60) && <span style={{ color: COLORS.ERROR, marginLeft: '10px', fontSize: '1rem' }}>(超過)</span>}
                    </div>
                </div>


                <h3 style={{ marginBottom: '15px', color: COLORS.TEXT_MAIN }}>正誤一覧 (クリックで解説)</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)', // 3列固定
                    borderTop: `1px solid ${COLORS.BORDER}`,
                    borderLeft: `1px solid ${COLORS.BORDER}`,
                    marginBottom: '30px',
                    maxHeight: '60vh',
                    overflowY: 'auto'
                }}>
                    {questions.map((q, index) => {
                        const isCorrect = userAnswers[q.id] === q.correct_option
                        const hasFlag = reviewFlags && reviewFlags[q.id]

                        return (
                            <div
                                key={q.id}
                                onClick={() => handleRowClick(q)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 15px',
                                    borderRight: `1px solid ${COLORS.BORDER}`,
                                    borderBottom: `1px solid ${COLORS.BORDER}`,
                                    background: COLORS.WHITE,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    fontSize: '0.95rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = COLORS.WHITE}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {/* フラグアイコン */}
                                    <span style={{
                                        marginRight: '10px',
                                        fontSize: '1.2rem',
                                        color: hasFlag ? COLORS.PRIMARY : 'transparent',
                                        WebkitTextStroke: hasFlag ? '0px' : `1.5px ${COLORS.SUB_HEADER}`,
                                        display: 'inline-block',
                                        width: '20px',
                                        textAlign: 'center'
                                    }}>
                                        ⚑
                                    </span>
                                    <span style={{ color: COLORS.TEXT_SUB }}>問題 {index + 1}</span>
                                </div>

                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isCorrect ? COLORS.SUCCESS : COLORS.ERROR }}>
                                    {isCorrect ? '✅' : '❌'}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* フッターアクション */}
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={onRestart}
                        style={{
                            padding: '12px 30px',
                            background: COLORS.PRIMARY,
                            color: COLORS.WHITE,
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        タイトルに戻る
                    </button>
                </div>

            </div>

            {/* 解説ポップアップ */}
            {selectedQuestion && (
                <ExplanationModal
                    question={selectedQuestion}
                    userAnswer={userAnswers[selectedQuestion.id]}
                    onClose={handleClosePopup}
                />
            )}

        </div>
    )
}

export default ResultScreen

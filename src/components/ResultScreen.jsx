import React, { useState } from 'react'
import { COLORS } from '../constants/theme'
import ExplanationModal from './ExplanationModal'

const ResultScreen = ({ questions, userAnswers, onRestart, timeLimit, timerSeconds }) => {
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
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '15px',
                    marginBottom: '30px'
                }}>
                    {questions.map((q, index) => {
                        const isCorrect = userAnswers[q.id] === q.correct_option

                        return (
                            <div
                                key={q.id}
                                onClick={() => handleRowClick(q)}
                                style={{
                                    border: `1px solid ${COLORS.BORDER}`,
                                    borderRadius: '8px',
                                    padding: '10px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: COLORS.WHITE,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
                                    e.currentTarget.style.borderColor = COLORS.PRIMARY
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none'
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                                    e.currentTarget.style.borderColor = COLORS.BORDER
                                }}
                            >
                                <div style={{ fontSize: '0.9rem', color: COLORS.TEXT_SUB, marginBottom: '5px' }}>
                                    No.{index + 1}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isCorrect ? COLORS.SUCCESS : COLORS.ERROR }}>
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

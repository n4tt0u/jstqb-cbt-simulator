import React from 'react'
import { COLORS } from '../constants/theme'

const ExplanationModal = ({ question, userAnswer, onClose }) => {
    return (
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
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: COLORS.WHITE,
                padding: '30px',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#999'
                    }}
                >
                    ×
                </button>

                <h2 style={{ fontSize: '1.2rem', color: COLORS.TEXT_MAIN, marginBottom: '20px', borderBottom: `1px solid ${COLORS.BORDER}`, paddingBottom: '10px' }}>
                    問題解説
                    <span style={{
                        marginLeft: '15px',
                        color: userAnswer === question.correct_option ? COLORS.SUCCESS : COLORS.ERROR,
                        fontWeight: 'bold'
                    }}>
                        {userAnswer === question.correct_option ? '✅ 正解' : '❌ 不正解'}
                    </span>
                </h2>

                <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>問題文:</p>
                    <p style={{ background: COLORS.HOVER_GRAY, padding: '10px', borderRadius: '4px' }}>{question.question_text}</p>
                </div>

                {/* 選択肢一覧 */}
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>選択肢:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[1, 2, 3, 4].map(optId => {
                            const isCorrect = optId === question.correct_option
                            const isSelected = userAnswer === optId
                            let bg = COLORS.WHITE
                            let border = `1px solid ${COLORS.BORDER}`

                            if (isCorrect) {
                                bg = COLORS.SUCCESS_BG
                                border = `1px solid ${COLORS.SUCCESS}`
                            } else if (isSelected) {
                                bg = COLORS.ERROR_BG
                                border = `1px solid ${COLORS.ERROR}`
                            }

                            return (
                                <div key={optId} style={{
                                    padding: '8px 12px',
                                    background: bg,
                                    border: border,
                                    borderRadius: '4px',
                                    fontSize: '0.95rem'
                                }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                        {String.fromCharCode(96 + optId)})
                                    </span>
                                    {question[`option_${optId}`]}
                                    {isCorrect && <span style={{ marginLeft: '10px', color: COLORS.SUCCESS, fontWeight: 'bold' }}>✅ 正解</span>}
                                    {isSelected && !isCorrect && <span style={{ marginLeft: '10px', color: COLORS.ERROR, fontWeight: 'bold' }}>❌ あなたの回答</span>}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 解説 */}
                <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>解説:</p>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{question.explanation}</p>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 25px',
                            background: COLORS.TEXT_SUB,
                            color: COLORS.WHITE,
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
    )
}

export default ExplanationModal

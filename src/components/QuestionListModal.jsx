import React from 'react'
import { COLORS } from '../constants/theme'

const QuestionListModal = ({
    questions,
    userAnswers,
    reviewFlags,
    currentIndex,
    onJump,
    onClose
}) => {
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
            zIndex: 2000
        }} onClick={onClose}>
            <div style={{
                background: COLORS.WHITE,
                width: '600px',
                maxWidth: '90%',
                borderRadius: '8px',
                padding: '20px',
                position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ textAlign: 'center', color: COLORS.PRIMARY, marginBottom: '20px' }}>問題一覧</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)', // 3列固定
                    borderTop: `1px solid ${COLORS.BORDER}`,
                    borderLeft: `1px solid ${COLORS.BORDER}`,
                    marginBottom: '20px',
                    maxHeight: '60vh', // スクロール可能に
                    overflowY: 'auto'
                }}>
                    {questions.map((q, idx) => {
                        const isAnswered = userAnswers[q.id] !== undefined
                        const isCurrent = idx === currentIndex
                        const hasFlag = reviewFlags[q.id]

                        return (
                            <div
                                key={q.id}
                                onClick={() => {
                                    onJump(idx)
                                    onClose()
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 15px',
                                    borderRight: `1px solid ${COLORS.BORDER}`,
                                    borderBottom: `1px solid ${COLORS.BORDER}`,
                                    background: isCurrent ? '#e3effd' : COLORS.WHITE, // カレントは薄い青背景
                                    cursor: 'pointer',
                                    color: isAnswered ? COLORS.TEXT_MAIN : COLORS.TEXT_MAIN,
                                    fontWeight: isCurrent ? 'bold' : 'normal',
                                    transition: 'background 0.2s',
                                    fontSize: '0.95rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isCurrent) e.currentTarget.style.background = '#f5f5f5'
                                }}
                                onMouseLeave={(e) => {
                                    if (!isCurrent) e.currentTarget.style.background = COLORS.WHITE
                                }}
                            >
                                {/* フラグアイコン */}
                                <span style={{
                                    marginRight: '10px',
                                    fontSize: '1.2rem',
                                    color: hasFlag ? COLORS.PRIMARY : 'transparent', // フラグありなら青、なしなら透明（枠線のみ）
                                    WebkitTextStroke: hasFlag ? '0px' : `1.5px ${COLORS.SUB_HEADER}`, // フラグなしなら水色の枠線
                                    display: 'inline-block',
                                    width: '20px',
                                    textAlign: 'center'
                                }}>
                                    ⚑
                                </span>

                                <span>問題 {idx + 1}</span>
                            </div>
                        )
                    })}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 20px',
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

export default QuestionListModal

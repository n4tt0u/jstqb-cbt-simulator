import React, { useState } from 'react'

const ResultScreen = ({ questions, userAnswers, onRestart }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(null)

    // 正答数の計算
    const correctCount = questions.reduce((count, q) => {
        return count + (userAnswers[q.id] === q.correct_option ? 1 : 0)
    }, 0)

    const totalCount = questions.length
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

    const handleRowClick = (question) => {
        setSelectedQuestion(question)
    }

    const handleClosePopup = () => {
        setSelectedQuestion(null)
    }

    return (
        <div className="cbt-container" style={{ background: '#f0f4f8', overflowY: 'auto' }}>
            <div style={{
                maxWidth: '800px',
                width: '95%',
                margin: '40px auto',
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: 'rgb(0, 109, 170)',
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
                    <h2 style={{ fontSize: '1.2rem', color: '#555', marginBottom: '10px' }}>総合スコア</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'rgb(0, 109, 170)' }}>
                        {correctCount} / {totalCount} 問
                    </div>
                    <div style={{ fontSize: '1.5rem', marginTop: '5px', color: '#666' }}>
                        正答率: {percentage}%
                    </div>
                </div>

                {/* 問題一覧テーブル */}
                <h3 style={{ marginBottom: '15px', color: '#333' }}>正誤一覧 (クリックで解説)</h3>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '30px',
                    fontSize: '0.95rem'
                }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '10px', textAlign: 'center', width: '60px' }}>No.</th>
                            <th style={{ padding: '10px', textAlign: 'center', width: '80px' }}>結果</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>問題文（抜粋）</th>
                            <th style={{ padding: '10px', textAlign: 'center', width: '80px' }}>あなたの回答</th>
                            <th style={{ padding: '10px', textAlign: 'center', width: '80px' }}>正解</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q, index) => {
                            const isCorrect = userAnswers[q.id] === q.correct_option
                            const userAnswer = userAnswers[q.id] ? String.fromCharCode(96 + userAnswers[q.id]) : '-'
                            const correctAnswer = String.fromCharCode(96 + q.correct_option)

                            return (
                                <tr
                                    key={q.id}
                                    onClick={() => handleRowClick(q)}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                    <td style={{ padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                                    <td style={{ padding: '10px', textAlign: 'center', color: isCorrect ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {isCorrect ? '✅' : '❌'}
                                    </td>
                                    <td style={{ padding: '10px', color: '#555' }}>
                                        {q.question_text.length > 30 ? q.question_text.substring(0, 30) + '...' : q.question_text}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>{userAnswer}</td>
                                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{correctAnswer}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* フッターアクション */}
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={onRestart}
                        style={{
                            padding: '12px 30px',
                            background: 'rgb(0, 109, 170)',
                            color: 'white',
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
                }} onClick={handleClosePopup}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={handleClosePopup}
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

                        <h2 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            問題解説
                            <span style={{
                                marginLeft: '15px',
                                color: userAnswers[selectedQuestion.id] === selectedQuestion.correct_option ? 'green' : 'red',
                                fontWeight: 'bold'
                            }}>
                                {userAnswers[selectedQuestion.id] === selectedQuestion.correct_option ? '✅ 正解' : '❌ 不正解'}
                            </span>
                        </h2>

                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>問題文:</p>
                            <p style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>{selectedQuestion.question_text}</p>
                        </div>

                        {/* 選択肢一覧 */}
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>選択肢:</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[1, 2, 3, 4].map(optId => {
                                    const isCorrect = optId === selectedQuestion.correct_option
                                    const isSelected = userAnswers[selectedQuestion.id] === optId
                                    let bg = 'white'
                                    let border = '1px solid #ddd'

                                    if (isCorrect) {
                                        bg = '#e6ffe6'
                                        border = '1px solid green'
                                    } else if (isSelected) {
                                        bg = '#ffe6e6'
                                        border = '1px solid red'
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
                                            {selectedQuestion[`option_${optId}`]}
                                            {isCorrect && <span style={{ marginLeft: '10px', color: 'green', fontWeight: 'bold' }}>✅ 正解</span>}
                                            {isSelected && !isCorrect && <span style={{ marginLeft: '10px', color: 'red', fontWeight: 'bold' }}>❌ あなたの回答</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 解説 */}
                        <div>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>解説:</p>
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{selectedQuestion.explanation}</p>
                        </div>

                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button
                                onClick={handleClosePopup}
                                style={{
                                    padding: '10px 25px',
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

export default ResultScreen

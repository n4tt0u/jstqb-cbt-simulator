import React from 'react'

const ResultScreen = ({ questions, userAnswers, onRestart }) => {
    // 正答数の計算
    const correctCount = questions.reduce((count, q) => {
        return count + (userAnswers[q.id] === q.correct_option ? 1 : 0)
    }, 0)

    const totalCount = questions.length
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

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
                <h3 style={{ marginBottom: '15px', color: '#333' }}>正誤一覧</h3>
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
                                <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
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
        </div>
    )
}

export default ResultScreen

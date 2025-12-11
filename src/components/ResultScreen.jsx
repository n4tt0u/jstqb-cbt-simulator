import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { COLORS } from '../constants/theme'
import ExplanationModal from './ExplanationModal'

const ResultScreen = ({ questions, userAnswers, onRestart, timeLimit, timerSeconds, reviewFlags, toggleReviewFlag }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [exportIncorrect, setExportIncorrect] = useState(true)
    const [exportFlagged, setExportFlagged] = useState(false)

    // UI制御用のフラグ計算
    const hasIncorrect = questions.some(q => userAnswers[q.id] !== q.correct_option)
    const hasFlagged = questions.some(q => reviewFlags && reviewFlags[q.id])

    // データが存在しない場合はチェックを外す（初期表示時などの整合性）
    useEffect(() => {
        if (!hasIncorrect && exportIncorrect) setExportIncorrect(false)
        if (!hasFlagged && exportFlagged) setExportFlagged(false)
    }, [hasIncorrect, hasFlagged, exportIncorrect, exportFlagged])

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

    const handleExportCSV = () => {
        // 抽出ロジック
        const exportData = questions.filter(q => {
            const isCorrect = userAnswers[q.id] === q.correct_option
            const hasFlag = reviewFlags[q.id]

            if (exportIncorrect && !isCorrect) return true
            if (exportFlagged && hasFlag) return true
            return false
        })

        if (exportData.length === 0) {
            return
        }

        // CSV生成 (入力ファイルと同じフォーマットを維持)
        // 必要なカラム: id, question_text, option_1...option_4, correct_option, explanation
        const csvData = exportData.map(q => ({
            id: q.id,
            question_text: q.question_text,
            option_1: q.option_1,
            option_2: q.option_2,
            option_3: q.option_3,
            option_4: q.option_4,
            correct_option: q.correct_option,
            explanation: q.explanation
        }))

        // Excel文字化け対策 (BOM)
        const csv = Papa.unparse(csvData)
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' })

        // ダウンロードリンク生成
        const link = document.createElement('a')
        const date = new Date()
        const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`
        link.href = URL.createObjectURL(blob)
        link.download = `review_${dateStr}.csv`
        link.click()
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


                <h3 style={{ marginBottom: '15px', color: COLORS.TEXT_MAIN }}>
                    正誤一覧 <span style={{ fontSize: '0.85rem', fontWeight: 'normal', marginLeft: '10px' }}>※行クリックで解説表示 / ⚑クリックでフラグ切替</span>
                </h3>
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
                                        fontSize: '1.8rem', // サイズアップ
                                        color: hasFlag ? COLORS.PRIMARY : 'transparent',
                                        WebkitTextStroke: hasFlag ? '0px' : `1.5px ${COLORS.SUB_HEADER}`,
                                        display: 'inline-block',
                                        width: '30px', // ヒットエリア拡大
                                        height: '30px',
                                        lineHeight: '30px',
                                        textAlign: 'center',
                                        cursor: 'pointer', // クリック可能に
                                        borderRadius: '50%', // 円形にして
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.target.style.background = '#eef'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}

                                        onClick={(e) => {
                                            e.stopPropagation() // 行クリック（解説表示）を阻止
                                            toggleReviewFlag(q.id)
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

                {/* エクスポート UI */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    padding: '20px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.BORDER}`
                }}>
                    <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', color: COLORS.TEXT_MAIN }}>復習用データのエクスポート</h3>
                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <label style={{
                            cursor: hasIncorrect ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: hasIncorrect ? 1 : 0.5
                        }}>
                            <input
                                type="checkbox"
                                checked={exportIncorrect}
                                onChange={(e) => setExportIncorrect(e.target.checked)}
                                disabled={!hasIncorrect}
                                style={{ marginRight: '5px' }}
                            />
                            不正解問題
                        </label>
                        <label style={{
                            cursor: hasFlagged ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: hasFlagged ? 1 : 0.5
                        }}>
                            <input
                                type="checkbox"
                                checked={exportFlagged}
                                onChange={(e) => setExportFlagged(e.target.checked)}
                                disabled={!hasFlagged}
                                style={{ marginRight: '5px' }}
                            />
                            フラグ付き問題
                        </label>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        disabled={!exportIncorrect && !exportFlagged}
                        style={{
                            padding: '10px 25px',
                            background: (!exportIncorrect && !exportFlagged) ? '#ccc' : COLORS.SUB_HEADER,
                            color: COLORS.WHITE,
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            cursor: (!exportIncorrect && !exportFlagged) ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        復習用CSVをエクスポート
                    </button>
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
            {
                selectedQuestion && (
                    <ExplanationModal
                        question={selectedQuestion}
                        userAnswer={userAnswers[selectedQuestion.id]}
                        onClose={handleClosePopup}
                    />
                )
            }

        </div >
    )
}

export default ResultScreen

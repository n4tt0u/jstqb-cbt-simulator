import React, { useState } from 'react'
import Papa from 'papaparse'
import ExplanationModal from './ExplanationModal'
import './ResultScreen.css'

const ResultScreen = ({ questions, userAnswers, onRestart, timeLimit, timerSeconds, reviewFlags, toggleReviewFlag }) => {
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [exportIncorrect, setExportIncorrect] = useState(true)
    const [exportFlagged, setExportFlagged] = useState(false)

    // UI制御用のフラグ計算
    const hasIncorrect = questions.some(q => userAnswers[q.id] !== q.correct_option)
    const hasFlagged = questions.some(q => reviewFlags && reviewFlags[q.id])

    // データが存在しない場合はチェックを外す（初期表示時などの整合性）


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

            if (exportIncorrect && hasIncorrect && !isCorrect) return true
            if (exportFlagged && hasFlagged && hasFlag) return true
            return false
        })

        if (exportData.length === 0) {
            return
        }

        // CSV生成 (入力ファイルと同じフォーマットを維持)
        const csvData = exportData.map(q => ({
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
        <div className="cbt-container result-screen-container">
            <div className="result-screen-card">
                <h1 className="result-screen-title">
                    試験結果
                </h1>

                {/* スコア表示エリア */}
                <div className="score-section">
                    <h2 className="score-label">総合スコア</h2>
                    <div className="score-value">
                        {correctCount} / {totalCount} 問
                    </div>
                    <div className="score-rate">
                        正答率: {percentage}%
                    </div>
                    <div className="time-section">
                        経過時間: <strong>{formatTime(elapsedSeconds)}</strong>
                        {timeLimit > 0 && elapsedSeconds > (timeLimit * 60) && <span className="status-overtime">(超過)</span>}
                    </div>
                </div>


                <h3 className="grid-title">
                    正誤一覧 <span className="grid-note">※行クリックで解説表示 / ⚑クリックでフラグ切替</span>
                </h3>
                <div className="questions-grid">
                    {questions.map((q, index) => {
                        const isCorrect = userAnswers[q.id] === q.correct_option
                        const hasFlag = reviewFlags && reviewFlags[q.id]

                        return (
                            <div
                                key={q.id}
                                onClick={() => handleRowClick(q)}
                                className="question-tile"
                            >
                                <div className="question-meta">
                                    {/* フラグアイコン */}
                                    <span
                                        className={`tile-flag-icon ${hasFlag ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation() // 行クリック（解説表示）を阻止
                                            toggleReviewFlag(q.id)
                                        }}
                                    >
                                        ⚑
                                    </span>
                                    <span className="question-number-text">問題 {index + 1}</span>
                                </div>

                                <div className={`tile-result-icon ${isCorrect ? 'icon-correct' : 'icon-incorrect'}`}>
                                    {isCorrect ? '✅' : '❌'}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* エクスポート UI */}
                <div className="export-section">
                    <h3 className="export-title">復習用データのエクスポート</h3>
                    <div className="export-options">
                        <label className={`export-label ${!hasIncorrect ? 'disabled' : ''}`}>
                            <input
                                type="checkbox"
                                checked={exportIncorrect && hasIncorrect}
                                onChange={(e) => setExportIncorrect(e.target.checked)}
                                disabled={!hasIncorrect}
                            />
                            不正解問題
                        </label>
                        <label className={`export-label ${!hasFlagged ? 'disabled' : ''}`}>
                            <input
                                type="checkbox"
                                checked={exportFlagged && hasFlagged}
                                onChange={(e) => setExportFlagged(e.target.checked)}
                                disabled={!hasFlagged}
                            />
                            フラグ付き問題
                        </label>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        disabled={!exportIncorrect && !exportFlagged}
                        className="btn-export"
                    >
                        復習用CSVをエクスポート
                    </button>
                </div>

                {/* フッターアクション */}
                <div className="footer-section">
                    <button
                        onClick={onRestart}
                        className="btn-restart"
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

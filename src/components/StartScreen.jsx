import React, { useState } from 'react'
import Papa from 'papaparse'
import { parseQuestionRow, shuffleQuestionOptions } from '../utils/csvFormatter'
import { parseAnkiJson } from '../utils/ankiImport'
import './StartScreen.css'

const StartScreen = ({ onQuestionsLoaded, onStart, isDarkMode, onToggleDarkMode }) => {
    const [timeLimit, setTimeLimit] = useState(0) // デフォルト0（無制限）
    const [loading, setLoading] = useState(false)
    const [loadedCount, setLoadedCount] = useState(0)
    const [error, setError] = useState('')

    const processCSV = (csvText) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    // ユーティリティを使用してデータを変換し、選択肢をシャッフル
                    const formattedData = results.data
                        .map((q, index) => parseQuestionRow(q, index))
                        .map(q => shuffleQuestionOptions(q))

                    // Fisher-Yates shuffle for questions
                    for (let i = formattedData.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [formattedData[i], formattedData[j]] = [formattedData[j], formattedData[i]];
                    }

                    onQuestionsLoaded(formattedData)
                    setLoadedCount(formattedData.length)
                    setLoading(false)
                } else {
                    setError('有効な問題データが見つかりませんでした。')
                    setLoading(false)
                }
            },
            error: (err) => {
                console.error(err)
                setError('CSVの解析に失敗しました。')
                setLoading(false)
            }
        })
    }

    const handleLoadDefault = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch('/questions.csv')
            if (!response.ok) throw new Error('Default CSV not found')
            const csvText = await response.text()
            processCSV(csvText)
        } catch (err) {
            console.error(err)
            setError('デフォルト問題の読み込みに失敗しました。')
            setLoading(false)
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setLoading(true)
        setError('')
        const reader = new FileReader()
        reader.onload = (event) => {
            processCSV(event.target.result)
        }
        reader.onerror = () => {
            setError('ファイルの読み込みに失敗しました。')
            setLoading(false)
        }
        reader.readAsText(file)
    }

    const handleAnkiImport = async () => {
        setLoading(true)
        setError('')
        try {
            const text = await navigator.clipboard.readText()
            if (!text) {
                setError('クリップボードが空か、テキストを取得できませんでした。')
                setLoading(false)
                return
            }

            const questions = parseAnkiJson(text).map(q => shuffleQuestionOptions(q))

            // Fisher-Yates shuffle for questions
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            onQuestionsLoaded(questions)
            setLoadedCount(questions.length)
            setLoading(false)
        } catch (err) {
            console.error(err)
            setError(err.message || 'クリップボードからの読み込みに失敗しました。')
            setLoading(false)
        }
    }

    const handleStart = (mode) => {
        onStart(mode, timeLimit)
    }

    return (
        <div className="start-screen-container cbt-container">
            <button
                onClick={onToggleDarkMode}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '5px',
                    borderRadius: '50%',
                    transition: 'transform 0.2s',
                    zIndex: 10
                }}
                title={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                {isDarkMode ? '🌞' : '🌙'}
            </button>
            <div className="start-screen-card">
                <h1 className="start-screen-title">CBT 再現演習</h1>

                {/* Step 1: データ読み込み */}
                <div className="step-section">
                    <h2 className="step-title">Step 1: 問題データの準備</h2>

                    <div className="button-group">
                        <button
                            onClick={handleLoadDefault}
                            disabled={loading || loadedCount > 0}
                            className="btn-load-default"
                        >
                            デフォルト問題集をロード
                        </button>

                        <button
                            onClick={handleAnkiImport}
                            disabled={loading || loadedCount > 0}
                            className="btn-anki-import"
                        >
                            📋 AnkiNLMからインポート
                        </button>

                        <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                            <a href="/questions.csv" download className="template-download-link">
                                CSVテンプレートをダウンロード
                            </a>
                        </div>

                        <div className="upload-section">
                            <p className="upload-label">または CSVファイルをアップロード</p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                disabled={loading}
                                style={{ fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    {loading && <p className="status-message">読み込み中...</p>}
                    {error && <p className="status-message status-error">{error}</p>}
                    {loadedCount > 0 && <p className="status-message status-success">✓ {loadedCount} 問の問題をロードしました</p>}
                </div>

                {/* Step 2: モード選択して開始 */}
                <div>
                    <h2 className="step-title">Step 2: 演習モードを選択して開始</h2>
                    <div className="button-group">
                        <button
                            onClick={() => handleStart('practice')}
                            disabled={loadedCount === 0}
                            className="mode-button practice"
                        >
                            一問一答モードで開始
                            <span className="mode-description">
                                1問ごとに解説を表示します
                            </span>
                        </button>

                        <div className="exam-mode-group">
                            <div className="timer-section" style={{ marginTop: 0, marginBottom: '10px', background: 'transparent', padding: 0 }}>
                                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>制限時間 (分):</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={timeLimit}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0
                                        setTimeLimit(Math.min(9999, Math.max(0, val)))
                                    }}
                                    className="timer-input"
                                    disabled={loadedCount === 0}
                                />
                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                    {timeLimit === 0 ? '※ 0分は時間制限なし' : `※ ${timeLimit}分で試験終了`}
                                </div>
                            </div>

                            <button
                                onClick={() => handleStart('exam')}
                                disabled={loadedCount === 0}
                                className="mode-button exam"
                                style={{ width: '100%' }}
                            >
                                本番モードで開始
                                <span className="mode-description">
                                    全て解いた後に結果を表示します
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StartScreen

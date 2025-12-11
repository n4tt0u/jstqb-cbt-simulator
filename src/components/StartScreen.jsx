import React, { useState } from 'react'
import Papa from 'papaparse'
import './StartScreen.css'

const StartScreen = ({ onQuestionsLoaded, onStart }) => {
    const [mode, setMode] = useState('practice')
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
                    // IDなどを数値化
                    // IDなどを数値化し、カラム名を内部用にマッピング
                    const formattedData = results.data.map((q, index) => {
                        // 正解オプションの変換 (a->1, b->2, c->3, d->4)
                        let correctVal = 0
                        if (q.correct_option) {
                            const lower = String(q.correct_option).toLowerCase().trim()
                            if (lower === 'a') correctVal = 1
                            else if (lower === 'b') correctVal = 2
                            else if (lower === 'c') correctVal = 3
                            else if (lower === 'd') correctVal = 4
                        }

                        return {
                            ...q,
                            id: index + 1,
                            // CSVの option_a 〜 d を内部の option_1 〜 4 にマッピング
                            option_1: q.option_a,
                            option_2: q.option_b,
                            option_3: q.option_c,
                            option_4: q.option_d,
                            correct_option: correctVal,
                        }
                    })
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

    const handleStart = () => {
        onStart(mode, timeLimit)
    }

    return (
        <div className="start-screen-container cbt-container">
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

                {/* Step 2: モード選択 */}
                <div>
                    <h2 className="step-title">Step 2: 演習モード選択</h2>
                    <div className="button-group">
                        <button
                            onClick={() => setMode('practice')}
                            disabled={loadedCount === 0}
                            className={`mode-button practice ${mode === 'practice' && loadedCount > 0 ? 'active' : ''}`}
                        >
                            一問一答モード
                            <span className="mode-description">
                                1問ごとに解説を表示します
                            </span>
                        </button>

                        <button
                            onClick={() => setMode('exam')}
                            disabled={loadedCount === 0}
                            className={`mode-button exam ${mode === 'exam' && loadedCount > 0 ? 'active' : ''}`}
                        >
                            本番模試モード
                            <span className="mode-description">
                                全て解いた後に結果を表示します
                            </span>
                        </button>

                        {/* タイマー設定 (模試/一問一答共通) */}
                        <div className="timer-section">
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
                            />
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                {timeLimit === 0 ? '※ 0分は時間制限なし (カウントアップ計測)' : `※ ${timeLimit}分で試験終了`}
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={loadedCount === 0}
                            className="btn-start"
                        >
                            試験開始
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StartScreen

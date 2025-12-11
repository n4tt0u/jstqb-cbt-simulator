import React, { useState } from 'react'
import Papa from 'papaparse'

const StartScreen = ({ onQuestionsLoaded, onStart }) => {
    const [mode, setMode] = useState('practice')
    const [questionsLoaded, setQuestionsLoaded] = useState(false)
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
                    // IDなどを数値化
                    const formattedData = results.data.map((q, index) => ({
                        ...q,
                        id: index + 1, // IDはインデックスから自動採番
                        correct_option: Number(q.correct_option)
                    }))
                    onQuestionsLoaded(formattedData)
                    setLoadedCount(formattedData.length)
                    setLoading(false)
                    setQuestionsLoaded(true)
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
        <div className="cbt-container" style={{ justifyContent: 'center', alignItems: 'center', background: '#f0f4f8' }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center'
            }}>
                <h1 style={{ color: 'rgb(0, 109, 170)', marginBottom: '30px' }}>CBT 再現演習</h1>

                {/* Step 1: データ読み込み */}
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#555' }}>Step 1: 問題データの準備</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <button
                            onClick={handleLoadDefault}
                            disabled={loading || loadedCount > 0}
                            style={{
                                padding: '12px',
                                background: 'rgb(0, 109, 170)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: (loading || loadedCount > 0) ? 'default' : 'pointer',
                                opacity: (loading || loadedCount > 0) ? 0.7 : 1,
                                fontSize: '1rem'
                            }}
                        >
                            デフォルト問題集をロード
                        </button>

                        <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                            <p style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#666' }}>または CSVファイルをアップロード</p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                disabled={loading}
                                style={{ fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    {loading && <p style={{ color: '#666', marginTop: '10px' }}>読み込み中...</p>}
                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                    {loadedCount > 0 && <p style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>✓ {loadedCount} 問の問題をロードしました</p>}
                </div>

                {/* Step 2: モード選択 */}
                <div>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#555' }}>Step 2: 演習モード選択</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <button
                            onClick={() => setMode('practice')}
                            disabled={loadedCount === 0}
                            style={{
                                padding: '15px',
                                background: loadedCount === 0 ? '#ddd' : (mode === 'practice' ? '#4CAF50' : '#f1f1f1'),
                                color: mode === 'practice' ? 'white' : '#333',
                                border: '2px solid #4CAF50',
                                borderRadius: '4px',
                                cursor: loadedCount === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                        >
                            一問一答モード
                            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'normal', marginTop: '4px' }}>
                                1問ごとに解説を表示します
                            </span>
                        </button>

                        <button
                            onClick={() => setMode('exam')}
                            disabled={loadedCount === 0}
                            style={{
                                padding: '15px',
                                background: loadedCount === 0 ? '#ddd' : (mode === 'exam' ? '#FF9800' : '#f1f1f1'),
                                color: mode === 'exam' ? 'white' : '#333',
                                border: '2px solid #FF9800',
                                borderRadius: '4px',
                                cursor: loadedCount === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                        >
                            本番模試モード
                            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'normal', marginTop: '4px' }}>
                                全て解いた後に結果を表示します
                            </span>
                        </button>

                        {/* タイマー設定 (模試/一問一答共通) */}
                        <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>制限時間 (分):</label>
                            <input
                                type="number"
                                min="0"
                                value={timeLimit}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setTimeLimit(Math.min(9999, Math.max(0, val)))
                                }}
                                style={{ width: '60px', padding: '5px', textAlign: 'center', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                                {timeLimit === 0 ? '※ 0分は時間制限なし (カウントアップ計測)' : `※ ${timeLimit}分で試験終了`}
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={loadedCount === 0}
                            style={{
                                marginTop: '10px',
                                padding: '15px',
                                background: loadedCount === 0 ? '#ddd' : '#006daa',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: loadedCount === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                            }}
                        >
                            試験開始
                        </button>

                        {/* Debug Button */}
                        <button
                            onClick={() => onStart(mode, 5 / 60)} // 5 seconds
                            disabled={loadedCount === 0}
                            style={{
                                marginTop: '5px',
                                padding: '5px',
                                background: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                width: 'fit-content',
                                alignSelf: 'center'
                            }}
                        >
                            [Debug] 5秒で開始
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StartScreen

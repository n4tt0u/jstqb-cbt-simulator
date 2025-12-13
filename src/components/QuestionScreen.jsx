import React, { useState, useEffect, useRef } from 'react'
import '../index.css'
import { COLORS } from '../constants/theme'
import QuestionListModal from './QuestionListModal'
import ConfirmModal from './ConfirmModal'
import { formatTime, getTimerColor } from '../utils/timeUtils'

const QuestionScreen = ({
    question,
    questions, // 全問題リスト (ID参照用)
    currentIndex,
    totalQuestions,
    onNext,
    onPrev,
    onJump,
    selectedOption,
    userAnswers, // 全回答状況
    reviewFlags, // 全フラグ状況
    onOptionSelect,
    isFlagged,
    onFlagToggle,
    mode, // 'practice' or 'exam'
    onFinish,
    timerSeconds,
    timeLimit,
    onPauseTimer,
    isExternalModalOpen = false // デフォルトはfalse
}) => {
    const [showFeedback, setShowFeedback] = useState(false)
    const [showQuestionsList, setShowQuestionsList] = useState(false)
    const [showFinishConfirmation, setShowFinishConfirmation] = useState(false) // 終了確認モーダル用
    const [showUnansweredModal, setShowUnansweredModal] = useState(false) // 未回答警告モーダル用
    // キーボード操作用のフォーカス管理 (1-4, null)
    const [focusedOptionId, setFocusedOptionId] = useState(null)
    const [isKeyboardFocus, setIsKeyboardFocus] = useState(false) // キーボード操作中のみフォーカスリングを表示

    // ラジオボタンのDOM参照用
    const optionRefs = useRef({})

    // 問題が変わったら解説表示とフォーカスをリセット
    useEffect(() => {
        // 一問一答モードで、既に回答済みの場合は解説を表示状態にする
        if (mode === 'practice' && userAnswers[question.id] !== undefined) {
            setShowFeedback(true)
        } else {
            setShowFeedback(false)
        }
        setFocusedOptionId(null) // 問題切り替え時はフォーカス外す
        // userAnswersは依存配列に含めない（回答操作ですぐに解説が表示されるのを防ぐため）
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.id, mode])

    // 一問一答モード: 解説表示中はタイマー停止
    useEffect(() => {
        if (mode === 'practice') {
            onPauseTimer(showFeedback)
        }
    }, [showFeedback, mode])

    // キーボード操作の追加
    useEffect(() => {
        const handleKeyDown = (e) => {
            // モーダル表示中は操作無効 (内部モーダル OR 外部モーダル)
            if (showFinishConfirmation || showUnansweredModal || showQuestionsList || isExternalModalOpen) {
                e.preventDefault()
                e.stopPropagation()
                return
            }

            // 解説表示中のキーボード操作
            if (showFeedback) {
                if (e.key === 'ArrowRight') {
                    handleNextClick()
                } else if (e.key === 'ArrowLeft') {
                    // 解説表示中でも戻る操作は許可
                    e.preventDefault()
                    if (currentIndex > 0) onPrev()
                }
                // それ以外のキー（回答変更など）はブロック
                return
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault() // デフォルト動作（ラジオボタン移動など）を無効化
                if (currentIndex > 0) onPrev()
            } else if (e.key === 'ArrowRight') {
                e.preventDefault() // デフォルト動作（ラジオボタン移動など）を無効化
                handleNextClick()
            } else if (e.key === 'ArrowDown') {
                e.preventDefault() // スクロール防止
                setIsKeyboardFocus(true) // キーボード操作なのでフォーカスリング有効化
                const currentId = focusedOptionId !== null ? focusedOptionId : (selectedOption !== null ? selectedOption : 4)
                const nextId = currentId === 4 ? 1 : currentId + 1
                setFocusedOptionId(nextId)
                onOptionSelect(nextId)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setIsKeyboardFocus(true) // キーボード操作なのでフォーカスリング有効化
                const currentId = focusedOptionId !== null ? focusedOptionId : (selectedOption !== null ? selectedOption : 1)
                const prevId = currentId === 1 ? 4 : currentId - 1
                setFocusedOptionId(prevId)
                onOptionSelect(prevId)
            } else if (e.key === 'f' || e.key === 'F') {
                onFlagToggle()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentIndex, showFeedback, selectedOption, mode, totalQuestions, focusedOptionId, showFinishConfirmation, showUnansweredModal, showQuestionsList, isExternalModalOpen, onOptionSelect, onFlagToggle]) // モーダル状態も依存に追加

    // focusedOptionIdが変わったらDOMのフォーカスも同期させる
    useEffect(() => {
        if (focusedOptionId !== null && optionRefs.current[focusedOptionId]) {
            // isKeyboardFocusのチェックは行わず、常にフォーカスを当てる
            // これにより、キーボード操作時の「見えないフォーカス」問題を解消し、
            // マウス操作時も正しくフォーカスが維持される。
            // ただし、フォーカスリングの表示はCSS(outline)で isKeyboardFocus を見て制御している。
            optionRefs.current[focusedOptionId].focus()
        }
    }, [focusedOptionId])

    const options = [
        { id: 1, text: question.option_1 },
        { id: 2, text: question.option_2 },
        { id: 3, text: question.option_3 },
        { id: 4, text: question.option_4 },
    ]

    const handleNextClick = () => {
        // 一問一答モード かつ まだ解説を表示していない場合
        if (mode === 'practice' && !showFeedback) {
            if (selectedOption === null) {
                // window.confirmの代わりにカスタムモーダル
                setShowUnansweredModal(true)
                return
            }
            setShowFeedback(true)
        } else {
            // それ以外（解説表示済み、または模試モード）は次の問題へ
            if (currentIndex === totalQuestions - 1) {
                if (mode === 'exam') {
                    // window.confirmの代わりにカスタムモーダルを表示
                    setShowFinishConfirmation(true)
                } else {
                    onFinish()
                }
            } else {
                setShowFeedback(false)
                onNext()
            }
        }
    }

    const handleJumpTo = (index) => {
        setShowFeedback(false)
        onJump(index)
        setShowQuestionsList(false)
    }

    const isCorrect = selectedOption === question.correct_option

    return (
        <div className="cbt-container">
            {/* ヘッダー */}
            <header className="cbt-header" style={{ background: COLORS.PRIMARY }}>
                <div className="header-info">
                    {mode === 'exam' && (
                        <div className="info-row">
                            <span className="info-icon">🕒</span>
                            <span style={{
                                color: getTimerColor(timerSeconds, timeLimit),
                                fontWeight: 'bold'
                            }}>
                                {timeLimit === 0 ? `経過時間 ${formatTime(timerSeconds)}` : `残り時間 ${formatTime(timerSeconds)}`}
                            </span>
                        </div>
                    )}
                    <div className="info-row">
                        <span className="info-icon">📑</span>
                        <span>{currentIndex + 1} / {totalQuestions} 問</span>
                    </div>
                </div>
            </header>

            {/* サブヘッダー (見直しフラグ) */}
            <div className="cbt-sub-header" style={{ background: COLORS.SUB_HEADER }}>
                <div className="review-flag" onClick={onFlagToggle}>
                    <span className={`flag-icon ${isFlagged ? 'active' : ''}`}>⚑</span>
                    <span>後で見直す</span>
                </div>
            </div>
            {/* メインエリア */}
            <main className="cbt-main">
                <div className="question-area">
                    <p className="question-text">{question.question_text}</p>
                </div>

                <div className="options-area">
                    {options.map((opt) => (
                        <label key={opt.id} className="option-label" style={{
                            cursor: showFeedback ? 'default' : 'pointer',
                            background: showFeedback && opt.id === question.correct_option ? COLORS.SUCCESS_BG :
                                showFeedback && opt.id === selectedOption && opt.id !== question.correct_option ? COLORS.ERROR_BG :
                                    COLORS.WHITE,
                            // キーボードフォーカス時のスタイル (青枠などで強調)
                            outline: (focusedOptionId === opt.id && isKeyboardFocus) ? `3px solid ${COLORS.PRIMARY}` : 'none',
                            outlineOffset: '-2px'
                        }}>
                            <input
                                type="radio"
                                name="option"
                                value={opt.id}
                                checked={selectedOption === opt.id}
                                onChange={() => {
                                    if (!showFeedback) {
                                        onOptionSelect(opt.id)
                                        setFocusedOptionId(opt.id) // マウス操作時もフォーカス同期
                                        setIsKeyboardFocus(false) // マウス操作なのでフォーカスリング無効化
                                    }
                                }}
                                onClick={() => {
                                    if (!showFeedback) {
                                        setFocusedOptionId(opt.id)
                                        setIsKeyboardFocus(false) // マウス操作なのでフォーカスリング無効化
                                    }
                                }}
                                disabled={showFeedback}
                                style={{ outline: 'none' }} // ブラウザデフォルトのフォーカスリングを削除
                                ref={(el) => (optionRefs.current[opt.id] = el)}
                            />
                            <span className="option-text">
                                {String.fromCharCode(96 + opt.id)}) {opt.text}
                            </span>
                        </label>
                    ))}
                </div>

                {/* 解説エリア */}
                {showFeedback && (
                    <div className="feedback-area" style={{ marginTop: '30px', padding: '20px', background: COLORS.BACKGROUND, border: `1px solid ${COLORS.BORDER}`, borderRadius: '4px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: isCorrect ? COLORS.SUCCESS : COLORS.ERROR }}>
                            {isCorrect ? '✅ 正解' : '❌ 不正解'}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>正解の選択肢:</strong> {String.fromCharCode(96 + question.correct_option)})
                        </div>
                        <div>
                            <strong>解説:</strong>
                            <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{question.explanation}</p>
                        </div>
                    </div>
                )}
            </main>

            {/* フッター */}
            <footer className="cbt-footer" style={{ background: COLORS.PRIMARY }}>
                <div className="footer-buttons">
                    <button
                        className="nav-button"
                        onClick={onPrev}
                        disabled={currentIndex === 0}
                        style={{ opacity: (currentIndex === 0) ? 0.5 : 1 }}
                    >
                        <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>←</span> 前へ
                    </button>

                    <button
                        className="nav-button secondary"
                        onClick={() => setShowQuestionsList(true)}
                        disabled={mode === 'practice'} // 一問一答モードでは無効化
                        style={{ opacity: mode === 'practice' ? 0.3 : 1, cursor: mode === 'practice' ? 'default' : 'pointer' }}
                    >
                        <span style={{ fontSize: '1.2em' }}>❖</span> 問題の選択
                    </button>

                    <button
                        className="nav-button"
                        onClick={handleNextClick}
                    >
                        {currentIndex === totalQuestions - 1 ? '終了' : '次へ'} <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>→</span>
                    </button>
                </div>
            </footer>

            {/* 問題一覧ポップアップ */}
            {showQuestionsList && (
                <QuestionListModal
                    questions={questions}
                    userAnswers={userAnswers}
                    reviewFlags={reviewFlags}
                    currentIndex={currentIndex}
                    onJump={handleJumpTo}
                    onClose={() => setShowQuestionsList(false)}
                />
            )}
            {/* 終了確認モーダル */}
            <ConfirmModal
                isOpen={showFinishConfirmation}
                message={"試験を終了して結果を表示しますか？"}
                onConfirm={onFinish}
                onCancel={() => setShowFinishConfirmation(false)}
                confirmText="終了する"
                cancelText="キャンセル"
            />

            {/* 未回答警告モーダル */}
            <ConfirmModal
                isOpen={showUnansweredModal}
                message={"解答が選択されていません。\nこのまま解説を表示しますか？"}
                onConfirm={() => {
                    // 何も選択せずに解説を見る場合、nullを記録して「解答済み」扱いにする
                    onOptionSelect(null)
                    setShowUnansweredModal(false)
                    setShowFeedback(true)
                }}
                onCancel={() => setShowUnansweredModal(false)}
                confirmText="表示する"
                cancelText="キャンセル"
            />
        </div>
    )
}

export default QuestionScreen

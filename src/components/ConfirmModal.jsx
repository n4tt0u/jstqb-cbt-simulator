import React, { useState, useEffect } from 'react'
import { COLORS } from '../constants/theme'

const ConfirmModal = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "キャンセル",
    isAlert = false // trueならキャンセルボタンを隠して確認ボタンのみにする
}) => {
    const [focusedButton, setFocusedButton] = useState('confirm') // 'confirm' or 'cancel'

    // モーダルが開くたびにフォーカスをリセット (confirmデフォルト)
    useEffect(() => {
        if (isOpen) {
            setFocusedButton('confirm')
        }
    }, [isOpen])

    // キーボード操作
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (!isAlert) {
                    setFocusedButton(prev => prev === 'confirm' ? 'cancel' : 'confirm')
                }
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (focusedButton === 'confirm') {
                    onConfirm()
                } else if (!isAlert) {
                    onCancel()
                }
            } else if (e.key === 'Escape') {
                if (!isAlert) onCancel()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, focusedButton, isAlert, onConfirm, onCancel])

    if (!isOpen) return null

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
        }}>
            <div style={{
                background: COLORS.WHITE,
                padding: '30px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                width: '90%'
            }}>
                <h3 style={{
                    marginBottom: '20px',
                    color: COLORS.TEXT_MAIN,
                    whiteSpace: 'pre-wrap', // 改行コードを有効にする
                    lineHeight: '1.5'
                }}>
                    {message}
                </h3>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    {/* 肯定/メインアクション (左) */}
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '10px 20px',
                            background: COLORS.PRIMARY,
                            color: COLORS.WHITE,
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            minWidth: '100px',
                            outline: focusedButton === 'confirm' ? `3px solid ${COLORS.TEXT_MAIN}` : 'none',
                            outlineOffset: '2px',
                            opacity: focusedButton === 'confirm' ? 1 : 0.8
                        }}
                    >
                        {confirmText}
                    </button>

                    {/* キャンセル (右) - isAlertがfalseの時のみ表示 */}
                    {!isAlert && (
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '10px 20px',
                                background: '#ccc',
                                color: '#333',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                minWidth: '100px',
                                outline: focusedButton === 'cancel' ? `3px solid ${COLORS.TEXT_MAIN}` : 'none',
                                outlineOffset: '2px',
                                opacity: focusedButton === 'cancel' ? 1 : 0.8
                            }}
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal

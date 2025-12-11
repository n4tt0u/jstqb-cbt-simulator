import { useState, useEffect, useRef } from 'react'

export const useExamTimer = (initialLimitRef, onExpiry) => {
    // initialLimitRef: 制限時間(分) ※0ならカウントアップ
    // onExpiry: 制限時間が来て「終了」を選んだ時のコールバック

    const [timeLimit, setTimeLimit] = useState(0)
    const [timerSeconds, setTimerSeconds] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isActive, setIsActive] = useState(false) // タイマーが動いているかどうか

    // 0になった瞬間のアラート済みフラグ (重複アラート防止)
    const alertShownRef = useRef(false)

    // 開始処理
    const startTimer = (limitMinutes) => {
        setTimeLimit(limitMinutes)
        setTimerSeconds(limitMinutes > 0 ? limitMinutes * 60 : 0)
        setIsPaused(false)
        setIsActive(true)
        alertShownRef.current = false
    }

    // 停止処理
    const stopTimer = () => {
        setIsActive(false)
    }

    const togglePause = (shouldPause) => {
        setIsPaused(shouldPause)
    }

    useEffect(() => {
        if (!isActive || isPaused) return

        const interval = setInterval(() => {
            setTimerSeconds(prev => {
                // カウントダウンモード
                if (timeLimit > 0) {
                    return prev - 1
                }
                // カウントアップモード
                else {
                    return prev + 1
                }
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isActive, isPaused, timeLimit])

    // 時間切れチェック (Side Effect)
    useEffect(() => {
        if (!isActive || timeLimit === 0) return

        // カウントダウンで0になった瞬間、かつまだアラートを出していない場合
        if (timerSeconds === 0 && !alertShownRef.current) {
            alertShownRef.current = true // ガードを立てる
            // 親コンポーネントに通知 (ここでモーダル表示などを制御してもらう)
            onExpiry && onExpiry()
        }
    }, [timerSeconds, isActive, timeLimit, onExpiry])

    return {
        timerSeconds,
        timeLimit,
        isPaused,
        startTimer,
        stopTimer,
        togglePause
    }
}

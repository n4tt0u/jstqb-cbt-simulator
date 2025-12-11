import { COLORS } from '../constants/theme';

export const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds);
    const m = Math.floor(absSeconds / 60);
    const s = absSeconds % 60;
    const text = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return seconds < 0 ? `-${text}` : text;
};

export const getTimerColor = (timerSeconds, timeLimit) => {
    if (timerSeconds < 0) {
        return COLORS.ERROR;
    }
    if (timeLimit > 0 && timerSeconds < 60) {
        return COLORS.WARNING;
    }
    return 'inherit';
};

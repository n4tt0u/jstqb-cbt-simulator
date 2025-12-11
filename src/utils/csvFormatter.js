/**
 * CSVデータと内部データの相互変換を行うユーティリティ
 */

// 正解の数値(1-4)をアルファベット(a-d)に変換
export const numberToChar = (n) => {
    if (n === 1) return 'a'
    if (n === 2) return 'b'
    if (n === 3) return 'c'
    if (n === 4) return 'd'
    return ''
}

// 正解のアルファベット(a-d)を数値(1-4)に変換
export const charToNumber = (char) => {
    if (!char) return 0
    const lower = String(char).toLowerCase().trim()
    if (lower === 'a') return 1
    if (lower === 'b') return 2
    if (lower === 'c') return 3
    if (lower === 'd') return 4
    return 0
}

/**
 * CSVの行データを内部用の問題オブジェクトに変換する
 * @param {Object} csvRow - PapaParseで読み込んだCSVの1行
 * @param {number} index - 配列のインデックス
 * @returns {Object} 内部用の問題オブジェクト
 */
export const parseQuestionRow = (csvRow, index) => {
    return {
        ...csvRow,
        id: index + 1,
        // CSVの option_a 〜 d を内部の option_1 〜 4 にマッピング
        option_1: csvRow.option_a,
        option_2: csvRow.option_b,
        option_3: csvRow.option_c,
        option_4: csvRow.option_d,
        correct_option: charToNumber(csvRow.correct_option),
    }
}

/**
 * 内部用の問題オブジェクトをCSV出力用の行データに変換する
 * @param {Object} question - 内部用の問題オブジェクト
 * @returns {Object} CSV出力用のオブジェクト
 */
export const formatQuestionForExport = (question) => {
    return {
        question_text: question.question_text,
        option_a: question.option_1,
        option_b: question.option_2,
        option_c: question.option_3,
        option_d: question.option_4,
        correct_option: numberToChar(question.correct_option),
        explanation: question.explanation
    }
}

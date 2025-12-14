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

/**
 * 問題の選択肢をシャッフルする
 * @param {Object} question - 内部用の問題オブジェクト
 * @returns {Object} 選択肢がシャッフルされた問題オブジェクト
 */
export const shuffleQuestionOptions = (question) => {
    // 選択肢の配列を作成（インデックスを保持）
    const options = [
        { text: question.option_1, originalIndex: 1 },
        { text: question.option_2, originalIndex: 2 },
        { text: question.option_3, originalIndex: 3 },
        { text: question.option_4, originalIndex: 4 }
    ]

    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    // 新しい正解のインデックスを探す
    // 元の正解インデックス(1-4)と一致するoriginalIndexを持つ要素が、新しい配列のどこにあるか？
    // 配列は0始まりなので +1 して 1-4 に戻す
    const newCorrectOptionIndex = options.findIndex(opt => opt.originalIndex === question.correct_option) + 1

    // 解説文の選択肢参照を置換するマップを作成
    // key: 元のインデックス(1-4), value: 新しいインデックス(1-4)
    const indexMap = {}
    options.forEach((opt, newIdx) => {
        indexMap[opt.originalIndex] = newIdx + 1
    })

    let newExplanation = question.explanation || ""
    if (newExplanation) {
        // 1. プレースホルダーに置換して、多重置換を防ぐ

        // パターン: "選択肢1", "選択肢 1", "選択肢a", "選択肢A"
        newExplanation = newExplanation.replace(/(選択肢\s?)([1-4a-d])/gi, (match, prefix, val) => {
            let oldIdx = 0
            // 数字の場合
            if (/[1-4]/.test(val)) {
                oldIdx = parseInt(val)
            }
            // アルファベットの場合
            else {
                oldIdx = charToNumber(val)
            }

            const newIdx = indexMap[oldIdx]

            // 元が数字なら数字、アルファベットならアルファベットで返す（大文字小文字維持）
            if (/[1-4]/.test(val)) {
                return `${prefix}__TEMP_NUM_${newIdx}__`
            } else {
                const char = numberToChar(newIdx)
                const isUpper = val === val.toUpperCase()
                return `${prefix}__TEMP_CHAR_${isUpper ? char.toUpperCase() : char}__`
            }
        })

        // パターン: 行頭や区切りの後の "a)", "a.", "a）", "(a)", "はa)", "がa)" など
        // Ankiインポート形式: "a) ..."
        // 日本語の助詞や読点などもプレフィックスとして許可する
        newExplanation = newExplanation.replace(/(^|\n|[\s(（「『【<,:、。はがを])([a-d])([)\）\.])/gi, (match, pre, val, post) => {
            const oldIdx = charToNumber(val)
            const newIdx = indexMap[oldIdx]
            const char = numberToChar(newIdx)
            const isUpper = val === val.toUpperCase()
            return `${pre}__TEMP_CHAR_${isUpper ? char.toUpperCase() : char}__${post}`
        })

        // 2. プレースホルダーを実際の値に戻す
        newExplanation = newExplanation.replace(/__TEMP_NUM_(\d+)__/g, "$1")
        newExplanation = newExplanation.replace(/__TEMP_CHAR_([a-z]+)__/gi, (match, p1) => p1)

        // 3. 「【各選択肢の解説】」以下の行をアルファベット順にソートする (ユーザー要望対応)
        const separator = "【各選択肢の解説】"
        if (newExplanation.includes(separator)) {
            const parts = newExplanation.split(separator)
            // parts[0] is header (Correct answer info), parts[1] is the list
            if (parts.length >= 2) {
                const header = parts[0]
                const body = parts.slice(1).join(separator) // In case separator appears multiple times, join rest

                // 空行を除去して行リストにする
                const lines = body.split('\n').filter(line => line.trim() !== '')

                lines.sort((a, b) => {
                    const getChar = (str) => {
                        const match = str.match(/^\s*([a-d])[).）]/i)
                        return match ? match[1].toLowerCase() : null
                    }
                    const charA = getChar(a)
                    const charB = getChar(b)

                    if (charA && charB) return charA.localeCompare(charB)
                    // a, b, c, d で始まる行を優先して上に
                    if (charA) return -1
                    if (charB) return 1
                    return 0
                })

                // 再結合 (separatorの後と各行の間に改行)
                newExplanation = header + separator + '\n' + lines.join('\n')
            }
        }
    }

    return {
        ...question,
        option_1: options[0].text,
        option_2: options[1].text,
        option_3: options[2].text,
        option_4: options[3].text,
        correct_option: newCorrectOptionIndex,
        explanation: newExplanation
    }
}

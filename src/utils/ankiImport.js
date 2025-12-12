/**
 * AnkiNLM (JSON format from clipboard) import utility
 */
import { charToNumber } from './csvFormatter'

/**
 * Parses JSON content from clipboard and converts it to the application's internal question format.
 * @param {string} jsonContent - The JSON string from clipboard
 * @returns {Array} Array of formatted question objects
 * @throws {Error} If parsing fails or format is invalid
 */
export const parseAnkiJson = (jsonContent) => {
    let data
    try {
        data = JSON.parse(jsonContent)
    } catch (e) {
        throw new Error('クリップボードの内容が有効なJSONではありません。')
    }

    let quizItems = []
    if (data && Array.isArray(data.quiz)) {
        quizItems = data.quiz
    } else if (Array.isArray(data)) {
        quizItems = data
    } else {
        throw new Error('有効なクイズデータ形式ではありません（"quiz" プロパティまたは配列が必要です）。')
    }

    const formattedQuestions = []

    quizItems.forEach((item, index) => {
        const questionText = item.question || ""
        const options = item.answerOptions || []

        if (options.length < 4) {
            console.warn(`Question skipped (fewer than 4 options): ${questionText.substring(0, 20)}...`)
            return
        }

        // Determine correct option
        let correctIndex = -1
        // Map 0->a, 1->b, 2->c, 3->d for display parsing if needed, 
        // but for internal app usage we need 1-based index (1-4).
        // The app uses 1=a, 2=b, 3=c, 4=d.

        options.forEach((opt, idx) => {
            if (opt.isCorrect === true) {
                correctIndex = idx
            }
        })

        if (correctIndex === -1) {
            console.warn(`Question skipped (no correct answer): ${questionText.substring(0, 20)}...`)
            return
        }

        const correctChar = ['a', 'b', 'c', 'd'][correctIndex] || ''
        const charMap = { 0: 'a', 1: 'b', 2: 'c', 3: 'd' }

        // Generate Explanation
        const correctRationale = options[correctIndex].rationale || ""

        let explanationParts = [
            `${correctChar}) ${correctRationale}\n`,
            "【各選択肢の解説】"
        ]

        options.forEach((opt, idx) => {
            if (idx === correctIndex) return // Skip correct option in the list

            const char = charMap[idx] || '?'
            explanationParts.push(`${char}) ${opt.rationale || ""}`)
        })

        const explanation = explanationParts.join('\n')

        // Create question object matching internal structure (see parseQuestionRow in csvFormatter)
        const questionObj = {
            id: index + 1, // Temporary ID, will be re-indexed if mixed, but usually fine here
            question_text: questionText,
            option_1: options[0].text || "",
            option_2: options[1].text || "",
            option_3: options[2].text || "",
            option_4: options[3].text || "",
            // correct_option expects number 1-4
            correct_option: correctIndex + 1,
            explanation: explanation
        }

        formattedQuestions.push(questionObj)
    })

    if (formattedQuestions.length === 0) {
        throw new Error('有効な問題データが見つかりませんでした。')
    }

    return formattedQuestions
}

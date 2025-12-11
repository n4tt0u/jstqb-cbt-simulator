
import sys
from pypdf import PdfReader

def extract_content(pdf_path, text_path, start_marker):
    reader = PdfReader(pdf_path)
    full_text = []
    for page in reader.pages:
        full_text.append(page.extract_text())
    
    content = '\n'.join(full_text)
    start_idx = content.find(start_marker)
    
    if start_idx != -1:
        extracted = content[start_idx:]
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(extracted)
        print(f"Successfully extracted to {text_path}")
    else:
        print(f"Marker '{start_marker}' not found in {pdf_path}")
        # Fallback: write last 5000 chars
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(content[-5000:])
        print("wrote tail")

q_path = r'c:\Users\n4tt0\マイドライブ（n4tt0u@gmail.com）\development\memo\ISTQB_CTAL-TM_Sample-Exam-Questions_SETA_v1.3.2.pdf'
a_path = r'c:\Users\n4tt0\マイドライブ（n4tt0u@gmail.com）\development\memo\ISTQB_CTAL-TM_Sample-Exam-Answers_SETA-v1.3.2.pdf'

extract_content(q_path, 'appendix_questions.txt', 'Question #A1')
# For answers, the marker might be different, let's look for "Question #A1" too
extract_content(a_path, 'appendix_answers.txt', 'Question #A1')

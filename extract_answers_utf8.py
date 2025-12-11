
import sys
from pypdf import PdfReader

def extract_answers(pdf_path, text_path):
    reader = PdfReader(pdf_path)
    content = '\n'.join([page.extract_text() for page in reader.pages])
    
    with open(text_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Extracted to {text_path}")

a_path = r'c:\Users\n4tt0\マイドライブ（n4tt0u@gmail.com）\development\memo\ISTQB_CTAL-TM_Sample-Exam-Answers_SETA-v1.3.2.pdf'
extract_answers(a_path, 'answers_utf8.txt')

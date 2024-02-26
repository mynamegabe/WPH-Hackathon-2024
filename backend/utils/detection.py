from transformers import pipeline
from transformers import AutoModelForSequenceClassification, AutoTokenizer

tokenizer = AutoModelForSequenceClassification("jpelhaw/longformer-base-plagiarism-detection")
model = AutoTokenizer.from_pretrained("jpelhaw/longformer-base-plagiarism-detection")


def detectAIContent(content):
    detector = pipeline("text-classification", model="roberta-base-openai-detector")
    result = detector(content)
    return result[0]["label"] == 'Fake'


def detectPlagiarism(text):
    tokenized = tokenizer(text, add_special_tokens=True)
    result = model(**tokenized)
    return "plagiarised" in result
from transformers import pipeline


def detectAIContent(content):
    detector = pipeline("text-classification", model="roberta-base-openai-detector")
    result = detector(content)
    return result[0]["label"] == 'Fake'
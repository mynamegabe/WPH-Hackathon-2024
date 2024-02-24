import config

import google.generativeai as genai

genai.configure(api_key=config.MAKERSUITE_API_KEY)
model = genai.GenerativeModel('gemini-pro')


def queryGemini(query):
    response = model.generate_content(query)
    return response


def detectAIContent(text):
    prompt_parts = [
        text,
        "\nBased on the content, determine if the content is 60% or above AI-generated.",
        "\nA: Yes",
        "\nB: No",
    ]
    response = model.generate_content(prompt_parts)
    return response.text


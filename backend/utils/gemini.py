import utils.config as config

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
    return "Yes" in response.text


def extractTraits(text):
    prompt_parts = [
        text,
        "\nBased on the content, extract the personality traits or characteristics of the person.",
        "\nThe output should be single words separated by commas. Example: 'Leadership, Communication, Time Management'"
    ]
    response = model.generate_content(prompt_parts)
    return response.text


def determineSuitability(job_description, job_traits, text):
    prompt_parts = [
        f"Job description: {job_description}",
        f"Job traits: {job_traits}",
        f"Response: {text}",
        "\nBased on the response, determine if the person is suitable for the job.",
        "\nA: Yes",
        "\nB: No",
    ]
    response = model.generate_content(prompt_parts)
    return response.text


def startChatAssessment():
    chat = model.start_chat(history=[
        # {
        #     "role": "user",
        #     "parts": "The following is a chat assessment with a candidate. Using the candidate's responses, generate a follow-up question.",
        # },
    ])
    return chat

def getNextQuestion(chat, question, reply, depth=1):
    if depth < 3:
        response = chat.send_message(
            f"The question was: {question}\n\nThe reply was: {reply}\n\nBased on the reply, generate a follow-up question."
        )
        next_question = response.text
        return next_question
    else:
        return 0
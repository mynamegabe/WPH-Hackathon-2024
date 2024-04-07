import utils.config as config
import re

import google.generativeai as genai

genai.configure(api_key=config.MAKERSUITE_API_KEY)
model = genai.GenerativeModel('gemini-pro',
                              safety_settings=[
                                  {
                                      "category": "HARM_CATEGORY_HARASSMENT",
                                      "threshold": "BLOCK_NONE"
                                  },
                                  {
                                      "category": "HARM_CATEGORY_HATE_SPEECH",
                                      "threshold": "BLOCK_NONE"
                                  },
                                  {
                                      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                      "threshold": "BLOCK_NONE"
                                  },
                                  {
                                      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                                      "threshold": "BLOCK_NONE"
                                  },
                              ])


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


def matchRoles(user, roles):
    rolesText = ""
    for role in roles:
        rolesText += f"{role.name}({role.id}): {role.description}\nTraits: {role.traits}\n\n"
    prompt_parts = [
        f"User: \nDescription: {user.description} Traits: {user.traits}",
        f"Roles: {rolesText}",
        "\nBased on the user's information, which roles could the user be suitable for? Do not choose all. Provide the role IDs separated by commas.",
        "\nExample: 1, 2, 3",
    ]
    response = model.generate_content(prompt_parts)
    r = response.text
    if r == "0":
        return []

    roles = r.split(", ")
    return roles

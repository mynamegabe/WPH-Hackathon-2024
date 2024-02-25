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
        "\nBased on the content, extract the traits or characteristics of the person.",
        "\nE.g. hardworking, innovative, etc."
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


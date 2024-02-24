import string
import random

def generateId(length=64):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
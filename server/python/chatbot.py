import sys
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

chatbot = ChatBot("Ron Obvious")
print(chatbot.get_response(sys.argv[1]))

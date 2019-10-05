import numpy as np
import re
import sys

from hate_prediction import preprocess
from hate_prediction import tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import model_from_json
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

chatbot = ChatBot('Ron Obvious')
json_file = open("model.json", "r")
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)
loaded_model.load_weights("model.h5")

text = pad_sequences(
    [tokenizer.convert_tokens_to_ids(tokenizer.tokenize(preprocess(sys.argv[1])))]
)
hate_content, offensive_language_content = loaded_model.predict(text)

print(hate_content, offensive_language_content)


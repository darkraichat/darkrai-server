
import numpy as np
import pandas as pd
import torch
import itertools
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import tensorflow as tf
import re
import tensorflow_hub as hub

from sklearn.model_selection import train_test_split

from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import Sequential
from keras.layers import Dense, Flatten, LSTM, Conv1D, MaxPooling1D, Dropout, Activation
from keras.layers.embeddings import Embedding

from pytorch_pretrained_bert import BertTokenizer
from pytorch_pretrained_bert.modeling import BertModel


def get_bert_embed_matrix():
    bert = BertModel.from_pretrained('bert-base-uncased')
    bert_embeddings = list(bert.children())[0]
    bert_word_embeddings = list(bert_embeddings.children())[0]
    mat = bert_word_embeddings.weight.data.numpy()
    return mat

BERT_EMBEDDINGS = get_bert_embed_matrix()

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

labeled_data = pd.read_csv('labeled_data.csv')
labeled_data = labeled_data[['hate_speech', 'offensive_language', 'tweet']]

text_X = []
y = []
for i in range(len(labeled_data)):
    a = 0
    b = 0
    if labeled_data['hate_speech'][i]>=1:
        a = 1
    if labeled_data['offensive_language'][i]>=1:
        b = 1
    y.append([a, b])
    text_X.append(str(labeled_data['tweet'][i]))

def preprocess(tweets):
	t = tweets
	z = lambda x: re.compile('\#').sub('', re.compile('RT @').sub('@', x).strip())
	t = z(t)
	tweet = ' '.join(re.sub("(@[_A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",t).split())
	return tweet.lower()

preprocessed_text = []
for i in range(len(text_X)):
    preprocessed_text.append(preprocess(text_X[i]))

train_tokens_ids = []
for i in preprocessed_text:
    train_tokens_ids.append(tokenizer.convert_tokens_to_ids(tokenizer.tokenize(i)[:50]))

model = Sequential()
model.add(Embedding(100000, 100, input_length=50))
model.add(LSTM(100, dropout=0.2, recurrent_dropout=0.2))
model.add(Dense(2, activation='sigmoid'))
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

train_tokens_ids = pad_sequences(train_tokens_ids, maxlen = 50, dtype = 'int', padding = 'post')

train_X, test_X, train_y, test_y = train_test_split(train_tokens_ids, y)

model.fit(train_X, np.array(train_y), epochs = 20)

model_json = model.to_json()
with open("model.json", "w") as json_file:
    json_file.write(model_json)
# serialize weights to HDF5
model.save_weights("model.h5")

model.evaluate(test_X, np.array(test_y))
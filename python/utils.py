import re
import pickle
import nltk
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences

def preprocess(tweets):
	z = lambda x: re.compile('\#').sub('', re.compile('RT @').sub('@', x).strip())
	t = z(tweets)
	tweet = ' '.join(re.sub("(@[_A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)"," ",t).split())
	return tweet.lower()

def convert_text_to_sequences(text, vocab_size = 100000, maxlen = 50, tokenizer = None):
    if tokenizer is None:
        tokenizer = Tokenizer(num_words= vocab_size)
        tokenizer.fit_on_texts(text)
        with open('tokenizer.pickle', 'wb') as f:
            pickle.dump(tokenizer, f)
    sequences = tokenizer.texts_to_sequences(text)
    data = pad_sequences(sequences, maxlen = maxlen, dtype = 'int', padding = 'post')
    return data
    
def preprocess_labels(labeled_data):
    y = []
    for i in range(len(labeled_data)):
        a = 0
        b = 0
        if labeled_data['hate_speech'][i]>=1:
            a = 1
        if labeled_data['offensive_language'][i]>=1:
            b = 1
        y.append([a, b])
    return y
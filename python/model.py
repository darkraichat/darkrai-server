from keras.models import Sequential
from keras.layers import Dense, Flatten, LSTM, Conv1D, MaxPooling1D, Dropout, Activation
from keras.layers.embeddings import Embedding

class Model():
    def __init__(self):
        self.model = self.create_model()
    def create_model(self, vocab_size = 100000, embedding_size = 100, input_length = 150):
        model = Sequential()
        model.add(Embedding(vocab_size, embedding_size, input_length=150))
        model.add(LSTM(100, dropout=0.2, recurrent_dropout=0.2))
        model.add(Dense(2, activation='sigmoid'))
        model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
        return model
    def train(self, train_X, train_y, epochs = 25):
        self.model.fit(train_X, train_y, epochs = epochs)
    def save(self, model_name):
        self.model.save(model_name)


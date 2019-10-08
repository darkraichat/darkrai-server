import numpy as np
import pandas as pd
from utils import *
from model import Model
from sklearn.model_selection import train_test_split

if __name__== '__main__':
    labeled_data = pd.read_csv('labeled_data.csv')
    labeled_data = labeled_data[['hate_speech', 'offensive_language', 'tweet']]
    y = preprocess_labels(labeled_data)

    preprocessed_text = []
    for i in range(len(y)):
        preprocessed_text.append(preprocess(str(labeled_data['tweet'][i])))

    sequence_data = convert_text_to_sequences(preprocessed_text)
    train_X, test_X, train_y, test_y = train_test_split(sequence_data, y, train_size = 0.95, shuffle = True)
    
    model = Model()
    model.train(train_X, np.array(train_y))

    print("Evaluation of Model :\n", model.evaluate(test_X, test_y))
    print()

    model.save('model.h5')


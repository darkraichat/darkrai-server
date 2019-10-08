from utils import *
from keras.models import load_model

model = load_model('model.h5')
text = sys.argv[1]

preprocessed_text = preprocess(text)
sequence_data = convert_text_to_sequences(preprocessed_text)

content = loaded_model.predict(sequence_data)

print(content[0][0], content[0][1])

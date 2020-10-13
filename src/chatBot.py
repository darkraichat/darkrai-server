import sys
import logging
logger = logging.getLogger()
logger.setLevel(logging.CRITICAL)
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

chatbot = ChatBot(
    'Darkrai-Bot',
    preprocessors=[
        'chatterbot.preprocessors.clean_whitespace'
    ],
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    logic_adapters=[
        'chatterbot.logic.BestMatch',
        'chatterbot.logic.MathematicalEvaluation',
    ],
    database_uri='sqlite:///database.sqlite3'
)
general = [
    "Hi",
    "Hi",
    "Heya",
    "Fine",
    "I'm good what about you",
    "How are you?",
    "I'm good what about you",
    "What are you doing?",
    "Nothing just talking with you",
    "Are you happy",
    "Yes i'm Happy",
    "Hello",
    "Hi there!",
    "How are you doing?",
    "I'm doing great.",
    "That is good to hear",
    "Thank you.",
    "You're welcome."
]

project =[
     'What is Darkrai?',
     'Darkrai is a browser extension that will enable the user to chat with any other user visiting the same website as themselves.',
     'How to use',
     '''
     Download the Extension from the Chrome and Open any Website and then you can chat with any other person or
     group of person visitin the website
     ''',
    'Who built it?',
    'It is built by students of DA-IICT college',
    'What features does it have?',
    'Darkrai is a browser extension through which we chat with other people visiting the same website',
    'Is it available for FireFox',
    'No currently it is available for Chrome only',
    'Is it a full fledged application',
    'It is still in development and new features are added continuously',
    'Is it applicable for any website',
    'Yes it is available for any websites',
    'Can i use it?',
    'Yes you can use it you just have to download the extension from the chrome',
    'Can i get the Github link of this project',
    r'Yes you can go to this repository https://github.com/darkraichat',
    'Is it open-source or close source',
    'Darkrai Chat is an Open Source Application',
    'Which stack Darkrai uses?',
    'MERN stack',
    'What is the Stack of Darkrai',
    'It uses MERN stack',
    'This is a Nice App',
    'Thanks do share with your friends'
]

trainer = ListTrainer(chatbot)

for item in (general, project):
    trainer.train(item)


user_input = sys.argv[1]
bot_response = chatbot.get_response(user_input)
if(bot_response.confidence < 0.1):
    print('I am sorry, but I do not understand.')
else:
    print(bot_response)

#print(sys.argv[1])
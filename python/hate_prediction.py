import numpy as np
import re
from pytorch_pretrained_bert import BertTokenizer

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")


def preprocess(tweets):
    t = tweets
    z = lambda x: re.compile("\#").sub("", re.compile("RT @").sub("@", x).strip())
    t = z(t)
    tweet = " ".join(
        re.sub("(@[_A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", t).split()
    )
    return tweet.lower()


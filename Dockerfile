FROM tensorflow/tensorflow:latest-py3

RUN apt-get install python3-pip

RUN pip install keras pandas

RUN pip install torch pytorch_pretrained_bert

RUN pip install scikit-learn tensorflow_hub

RUN apt-get install curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN apt-get install -y nodejs

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list 

RUN apt-get update && apt-get install -y yarn

WORKDIR /usr/src/server

COPY . .

RUN yarn

EXPOSE 4848

CMD ["node src/index.js"]

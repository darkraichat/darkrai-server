FROM node:lts

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \ 
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update && apt-get install -y yarn

# Set work directory
WORKDIR /usr/src/server

# Copying required files
COPY . .

# Installing dependencies
RUN yarn

# Command to run the server
CMD ["node", "src/index.js"]

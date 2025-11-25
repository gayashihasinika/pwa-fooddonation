FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

# Install patch-package globally so it exists during yarn install
RUN yarn global add patch-package postinstall-postinstall

RUN yarn install

COPY . .

CMD ["yarn", "start"]

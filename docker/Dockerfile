FROM node:14

WORKDIR /app
ADD . /app
RUN yarn install
RUN cd jolocom-lib && yarn build
CMD yarn test

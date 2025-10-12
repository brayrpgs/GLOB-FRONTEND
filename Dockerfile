FROM node:22.14.0

RUN mkdir -p /home/app

COPY . .

WORKDIR /home/app

RUN npm i -g @ionic/cli

RUN npm install

#RUN npm run build

EXPOSE 5174

CMD ["npm", "run", "dev"]
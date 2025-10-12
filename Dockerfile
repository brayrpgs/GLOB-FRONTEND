FROM node:22.14.0-alpine


WORKDIR /home/app

COPY . .

RUN npm i

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]
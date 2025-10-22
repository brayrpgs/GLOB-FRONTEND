FROM node:22.14.0-alpine

WORKDIR /home/app

COPY package*.json /

RUN npm i

COPY . .

# Uncomment the next line to build the frontend
#RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]

# Uncomment the next line to run the frontend in development mode
#CMD ["npm", "run", "preview"]
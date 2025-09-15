FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]

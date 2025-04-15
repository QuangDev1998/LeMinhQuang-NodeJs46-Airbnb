# Use Node.js LTS
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --timeout=3000

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]
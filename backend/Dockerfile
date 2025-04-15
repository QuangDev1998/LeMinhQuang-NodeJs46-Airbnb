FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --timeout=3000

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# Add wait-for script
COPY wait-for.sh .
RUN chmod +x wait-for.sh

# Start only when DB is ready
CMD ["./wait-for.sh", "npm", "run", "start:prod"]
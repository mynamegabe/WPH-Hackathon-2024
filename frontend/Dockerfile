FROM node:21-alpine3.18

WORKDIR /app

COPY package.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN mv ./src/config/site.tsx.remote ./src/config/site.tsx

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

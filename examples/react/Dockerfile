# Базовый образ для Node.js
FROM node:20-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование всех файлов проекта
COPY . .

# Сборка приложения с помощью Vite
RUN npm run build

# Второй этап: минимальный образ для запуска приложения
FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование только необходимых файлов из предыдущего шага
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Установка только production-зависимостей
RUN npm install --production

# Указание порта, который будет использоваться приложением
EXPOSE 3000

# Команда для запуска Node.js-приложения
CMD ["node", "dist/index.js"]

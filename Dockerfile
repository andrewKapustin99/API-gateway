# Указываем базовый образ
FROM node:latest

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение
CMD ["node", "server.js"]

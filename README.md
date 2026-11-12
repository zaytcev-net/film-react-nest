# FILM! — онлайн-кинотеатр

Веб-приложение для просмотра афиши фильмов, выбора сеансов и бронирования билетов.

**Демо проекта:** [https://film.zaytcev-net.nomorepartiessite.ru](https://film.zaytcev-net.nomorepartiessite.ru)

**API:** [https://api.zaytcev-net.nomorepartiessite.ru](https://api.zaytcev-net.nomorepartiessite.ru)

> Демо развёрнуто на временном сервере Яндекс Практикума. Доступность сайта зависит от срока работы сервера.

## Возможности приложения

- Просмотр каталога фильмов.
- Просмотр расписания сеансов.
- Выбор мест в кинозале.
- Оформление бронирования билетов.
- Получение информации о фильмах и сеансах через REST API.

## Технологический стек

### Frontend

- React 18
- TypeScript
- Vite
- SCSS
- Day.js
- Storybook

### Backend

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- class-validator
- Jest

### Инфраструктура

- Docker и Docker Compose
- Nginx
- GitHub Actions
- GitHub Container Registry (GHCR)
- Let's Encrypt (HTTPS)

## Архитектура проекта

Проект разделён на frontend и backend. В качестве базы данных используется PostgreSQL. Nginx принимает внешние запросы, отдаёт собранный frontend и перенаправляет запросы к API на backend.

```text
film-react-nest/
├── backend/              # NestJS API
│   ├── src/
│   ├── public/            # Статические файлы
│   ├── test/              # SQL-скрипты и тесты
│   └── Dockerfile
├── frontend/              # React-приложение
│   └── Dockerfile
├── nginx/                 # Конфигурация Nginx
│   ├── default.conf
│   └── Dockerfile
├── .github/
│   └── workflows/         # GitHub Actions
├── docker-compose.yml     # Локальное окружение
└── docker-compose.prod.yml # Production-окружение
```

## Запуск проекта локально

### Требования

Перед запуском необходимо установить:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Запуск через Docker Compose

Клонируйте репозиторий:

```bash
git clone https://github.com/zaytcev-net/film-react-nest.git
cd film-react-nest
```

Соберите и запустите контейнеры:

```bash
docker compose up --build -d
```

Проверьте состояние контейнеров:

```bash
docker compose ps
```

После запуска доступны:

| Сервис | Адрес |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost/api/afisha |
| pgAdmin | http://localhost:8080 |

### Настройка базы данных

Для работы приложения используется PostgreSQL.

В локальном Docker Compose предусмотрены значения переменных окружения по умолчанию. Для изменения настроек можно создать файл `.env` в корне проекта.

Основные переменные:

```dotenv
DATABASE_NAME=afisha
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
LOGGER_TYPE=dev
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin123
```

**Важно:** приведённые значения предназначены только для локальной разработки. Для production необходимо использовать собственные надёжные пароли.

Для заполнения базы тестовыми данными предусмотрены SQL-скрипты в `backend/test/`. Выполнять их нужно в следующем порядке:

1. `prac.init.sql` — создание таблиц.
2. `prac.films.sql` — добавление фильмов.
3. `prac.shedules.sql` — добавление расписания.

Скрипты можно выполнить через pgAdmin, подключившись к базе данных `afisha`. В качестве адреса сервера внутри Docker-сети используется `database`, порт — `5432`.

### Остановка контейнеров

```bash
docker compose down
```

Данные PostgreSQL сохраняются в Docker volume и не удаляются при обычной остановке контейнеров.

## API

Базовый путь API:

```text
/api/afisha
```

Основные маршруты:

| Метод | Маршрут | Назначение |
|---|---|---|
| GET | `/films/` | Получение списка фильмов |
| GET | `/films/:id/schedule` | Получение расписания фильма |
| POST | `/order` | Оформление заказа |

Пример запроса:

```bash
curl http://localhost/api/afisha/films/
```

## Тестирование Backend

Перейдите в папку backend:

```bash
cd backend
```

Установите зависимости:

```bash
npm ci
```

Запустите unit-тесты:

```bash
npm test
```

Запустите тесты с отчётом о покрытии:

```bash
npm run test:cov
```

Сборка backend:

```bash
npm run build
```

## Деплой

Для автоматической сборки и публикации Docker-образов используется GitHub Actions.

При отправке изменений в настроенную ветку workflow:

1. Собирает Docker-образы frontend, backend и Nginx.
2. Публикует образы в GitHub Container Registry.
3. Подключается к серверу.
4. Обновляет и перезапускает контейнеры через Docker Compose.

В production используется PostgreSQL, а внешние HTTP-запросы перенаправляются на HTTPS.

---

**Автор проекта:** [zaytcev-net](https://github.com/zaytcev-net)
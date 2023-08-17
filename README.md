[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
### `Яндекс.Практикум`
**Курс "Веб-разработчик".** Проектная работа №6 `(спринт 13-14)`

-----

# "Mesto" бэкенд

## Описание проекта
проект представляет собой созданый сервер для фронтенд части Mesto.

## Основной функционал
* регистрация и авторизация,
* постановка и снятие лайка,
* удаление и создание карточки,
* обновление персональных данных пользователя и аватара,
* получение всех пользователей из базы,
* получение всех карточек из базы,
* получение пользователя по id,
* централизованная обработка ошибок,
* валидация данных до контроллера через celebrate,
* кастомная валидация в схемах,
* защита роутов авторизацией.

## Инструменты и технологии
* Node.js,
* mongoDB,
* express.js,
* mongoose,
* celebrate.

### Установка и запуск
`npm i` - установка зависимостей,  
`mongod` — запускает mongoDB,  
`npm run start` — запускает сервер,    
`npm run dev` — запускает сервер с hot-reload.

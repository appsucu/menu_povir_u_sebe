# Повір у себе — Меню кейтерингу

[![Deploy to GitHub Pages](https://github.com/appsucu/menu_povir_u_sebe/actions/workflows/deploy.yml/badge.svg)](https://github.com/appsucu/menu_povir_u_sebe/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-orange?style=flat&logo=github)](https://appsucu.github.io/menu_povir_u_sebe/)

Веб-каталог та інтерактивне меню кейтерингу для простору «Повір у себе» (Київ, вул. Почайнинська 38/44).

🌐 **Демо-версія:** [https://appsucu.github.io/menu_povir_u_sebe/](https://appsucu.github.io/menu_povir_u_sebe/)

---

## Особливості проєкту

- **Адаптивна типографіка та сітка:** використання сучасного CSS Subgrid для рівномірного вирівнювання карток товарів на будь-яких пристроях (мобільні екрани, планшети, десктопи).
- **Швидкість та автономність:** чистий статичний стек без зайвих бібліотек та важких залежностей. Зображення оптимізовані у формат WebP, шрифти підключені локально у форматі WOFF2.
- **Доступність (a11y):** семантична розмітка HTML5, підтримка клавіатурної навігації, `skip-link` та коректні контрасти.
- **Зручна навігація:** плавний скрол між категоріями та динамічне підсвічування активного розділу меню.

## Технологічний стек

- **Frontend:** Semantic HTML5, Modern CSS (Custom Properties, Grid, Subgrid), Vanilla JavaScript (ES6+)
- **Типографіка:** NAMU, MacPaw Fixel Text
- **CI/CD & Hosting:** GitHub Actions, GitHub Pages

## Структура репозиторію

```text
├── dist/                     # Готові файли веб-сайту для публікації
│   ├── index.html            # Головна сторінка каталогу страв
│   ├── style.css             # Стилі інтерфейсу, сітка та адаптивність
│   ├── menu.js               # Скрипт навігації та взаємодії
│   ├── menu.json             # Структуровані дані меню
│   ├── font-licenses.txt     # Ліцензії на використані шрифти
│   └── assets/               # Графічні ресурси (логотип, фото страв, шрифти)
│       └── fonts/            # Локальні файли шрифтів (WOFF2)
├── scripts/                  # Допоміжні скрипти автоматизації
│   └── download_fonts.py     # Скрипт завантаження та локалізації шрифтів
└── .github/                  # Конфігурації CI/CD робочих процесів
    └── workflows/
        └── deploy.yml        # Автоматичний деплой на GitHub Pages
```

## Локальний запуск

Оскільки проєкт є статичним веб-сайтом, для його запуску підійде будь-який локальний статичний HTTP-сервер.

### Варіант 1: Python 3 (рекомендовано)

```bash
# Запуск сервера для директорії dist на порту 8000
python3 -m http.server 8000 --directory dist
```

Відкрийте в браузері: [http://localhost:8000](http://localhost:8000)

### Варіант 2: Node.js / npx

```bash
npx serve dist -l 8000
```

### Варіант 3: VS Code Live Server

Встановіть розширення **Live Server**, відкрийте файл `dist/index.html` та оберіть **Open with Live Server**.

## Розгортання (Деплой)

У репозиторії налаштовано автоматичний CI/CD пайплайн на базі GitHub Actions:

- Кожен пуш у гілку `main` автоматично ініціює збірку та публікацію вмісту папки `dist/` на **GitHub Pages**.
- Статус публікації відображається у вкладці **Actions** репозиторію.

## Контакти простору

- **Адреса:** м. Київ, вул. Почайнинська 38/44
- **Телефон:** +38 (096) 444 39 36
- **Email:** daryna.kolmyk@povirusebe.org

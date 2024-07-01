# Домашнє завдання 5

Створи гілку `hw06-email` з гілки `master`.

Продовжуємо створення REST API для роботи з колекцією контактів.

Додайте верифікацію email користувача після реєстрації за допомогою сервісу SendGrid.

## Як процес верифікації повинен працювати

1. Після реєстрації користувач повинен отримати лист на вказану при реєстрації пошту з посиланням для верифікації свого email.
2. Пройшовши посиланням в отриманому листі, вперше користувач повинен отримати відповідь зі статусом `200`, що буде мати на увазі успішну верифікацію email.
3. Пройшовши по посиланню повторно, користувач повинен отримати помилку зі статусом `404`.

## Крок 1: Підготовка інтеграції з SendGrid API

1. Зареєструйся на SendGrid.
2. Створи email-відправника. Для цього:
    - В адміністративній панелі SendGrid зайди в меню **Marketing**, підменю **Senders** і в правому верхньому куті натисни кнопку **Create New Sender**.
    - Заповни поля в запропонованій формі та збережи.

    На вказаний email повинно прийти лист верифікації (перевірте спам, якщо не бачите листа). Натисни на посилання в ньому і заверши процес.

3. Створи API токен доступу. Для цього:
    - Вибери меню **Email API**, підменю **Integration Guide**.
    - Вибери **Web API** і технологію `Node.js`.
    - На третьому кроці дай ім'я вашому токену, наприклад `systemcats`, натисни кнопку **Generate** і скопіюй цей токен.

4. Отриманий API-токен додай в `.env` файл в нашому проекті.

## Крок 2: Створення ендпоінта для верифікації email

1. Додай в модель `User` два поля: `verificationToken` і `verify`. Значення поля `verify` рівне `false` означатиме, що його email ще не пройшов верифікацію.

    ```javascript
    {
      verify: {
        type: Boolean,
        default: false,
      },
      verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
      },
    }
    ```

2. Створи ендпоінт `GET /users/verify/:verificationToken`, де по параметру `verificationToken` ми будемо шукати користувача в моделі `User`.

    - Якщо користувач з таким токеном не знайдений, повернути помилку `Not Found`.
    - Якщо користувач знайдений, встановити `verificationToken` в `null`, а поле `verify` поставити рівним `true` в документі користувача і повернути успішну відповідь.

### Verification request
```http
GET /auth/verify/:verificationToken
```

### Verification user Not Found
- **Status:** 404 Not Found
- **ResponseBody:**
    ```json
    {
      "message": "User not found"
    }
    ```

### Verification success response
- **Status:** 200 OK
- **ResponseBody:**
    ```json
    {
      "message": "Verification successful"
    }
    ```

## Крок 3: Додавання відправки email користувачу з посиланням для верифікації

При створенні користувача при реєстрації:

1. Створи `verificationToken` для користувача і запиши його в БД (для генерації токена використовуйте пакет `uuid` або `nanoid`).
2. Відправ email на пошту користувача і вкажи посилання для верифікації email'а (`/users/verify/:verificationToken`) в повідомленні.
3. Логін користувача не дозволено, якщо не верифіковано email.

## Крок 4: Додавання повторної відправки email користувачу з посиланням для верифікації

Необхідно передбачити варіант, що користувач може випадково видалити лист. Воно може не дійти з якоїсь причини до адресата. Наш сервіс відправки листів під час реєстрації видав помилку і т.д.

### POST /users/verify

- Отримує body у форматі `{email}`.
- Якщо в body немає обов'язкового поля `email`, повертає json з ключем `{"message":"missing required field email"}` і статусом `400`.
- Якщо з body все добре, виконуємо повторну відправку листа з `verificationToken` на вказаний email, але тільки якщо користувач не верифікований.
- Якщо користувач вже пройшов верифікацію, відправити json з ключем `{"message":"Verification has already been passed"}` зі статусом `400 Bad Request`.

### Resending an email request
```http
POST /users/verify
Content-Type: application/json
RequestBody:
{
  "email": "example@example.com"
}
```

### Resending an email validation error
- **Status:** 400 Bad Request
- **Content-Type:** application/json
- **ResponseBody:**
    ```json
    {
      "message": "Помилка від Joi або іншої бібліотеки валідації"
    }
    ```

### Resending an email success response
- **Status:** 200 Ok
- **Content-Type:** application/json
- **ResponseBody:**
    ```json
    {
      "message": "Verification email sent"
    }
    ```

### Resend email for verified user
- **Status:** 400 Bad Request
- **Content-Type:** application/json
- **ResponseBody:**
    ```json
    {
      "message": "Verification has already been passed"
    }
    ```

**ПРИМІТКА!** Як альтернативу SendGrid можна використовувати пакет `nodemailer`.

## Додаткове завдання (необов'язкове)

Напишіть Dockerfile для вашої програми.
```
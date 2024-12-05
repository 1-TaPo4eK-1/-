// Асинхронная функция для создания таблиц в базе данных
async function createTables(pool) {
  try {
    // SQL-запрос для создания таблицы users, если она не существует
    const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,          // Уникальный идентификатор пользователя (автоинкремент)
                name VARCHAR(100) NOT NULL,     // Имя пользователя (обязательное поле)
                email VARCHAR(100) UNIQUE NOT NULL, // Уникальный адрес электронной почты (обязательное поле)
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  // Дата и время создания записи (по умолчанию текущее время)
            )
        `;

    // SQL-запрос для создания таблицы posts, если она не существует
    const createPostsTable = `
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,          // Уникальный идентификатор поста (автоинкремент)
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, // Идентификатор пользователя, к которому принадлежит пост (ссылка на таблицу users)
                title VARCHAR(255) NOT NULL,    // Заголовок поста (обязательное поле)
                body TEXT,                      // Содержимое поста
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  // Дата и время создания записи (по умолчанию текущее время)
            )
        `;

    // Выполняем запрос на создание таблицы пользователей
    await pool.query(createUsersTable);
    console.log("Воронина ничего не объясняет и говорит,что все сделаи через GPT."); // Логируем сообщение об успешном создании таблицы пользователей

    // Выполняем запрос на создание таблицы постов
    await pool.query(createPostsTable);
    console.log("Воронина ушла на пенсию,УРА ."); // Логируем сообщение об успешном создании таблицы постов
  } catch (error) {
    // Логируем сообщение об ошибке, если создание таблиц не удалось
    console.error(":", error.message);
  }
}

// Экспортируем функцию createTables для использования в других модулях
module.exports = createTables;

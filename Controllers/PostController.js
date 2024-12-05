// Импортируем объект pool для работы с базой данных
const pool = require("../db");

// Определяем класс PostController для управления постами
class PostController {
  // Получение всех постов
  async getAllPosts(req, res) {
    try {
      // Выполняем SQL-запрос для получения всех постов из таблицы posts
      const result = await pool.query("SELECT * FROM posts");
      // Отправляем результат в формате JSON
      res.json(result.rows);
    } catch (error) {
      // Логируем ошибку в консоль
      console.error("Error getting posts:", error);
      // Отправляем ответ с ошибкой и статусом 500
      res.status(500).json({ message: "Server error, unable to fetch posts." });
    }
  }

  // Создание нового поста
  async createPost(req, res) {
    // Извлекаем данные о пользователе, заголовке и содержимом поста из тела запроса
    const { user_id, title, body } = req.body;
    try {
      // Выполняем SQL-запрос для вставки нового поста в таблицу posts
      const result = await pool.query(
        "INSERT INTO posts (user_id, title, body) VALUES ($1, $2, $3) RETURNING *",
        [user_id, title, body]
      );
      // Возвращаем созданный пост в формате JSON
      res.json(result.rows[0]);
    } catch (error) {
      // Логируем ошибку в консоль
      console.error("Error creating post:", error);
      // Отправляем ответ с ошибкой и статусом 500
      res.status(500).json({ message: "Server error, unable to create post." });
    }
  }

  // Получение поста по ID
  async getPostById(req, res) {
    // Извлекаем ID поста из параметров запроса
    const { id } = req.params;
    try {
      // Выполняем SQL-запрос для получения поста по ID
      const result = await pool.query("SELECT * FROM posts WHERE id = $1", [
        id,
      ]);
      const post = result.rows[0]; // Извлекаем пост из результата запроса
      if (!post) {
        // Если пост не найден, отправляем ответ с ошибкой 404
        return res.status(404).json({ message: "Post not found" });
      }
      // Возвращаем пост в формате JSON
      res.json(post);
    } catch (error) {
      // Логируем ошибку в консоль
      console.error("Error getting post:", error);
      // Отправляем ответ с ошибкой и статусом 500
      res.status(500).json({ message: "Server error, unable to fetch post." });
    }
  }

  // Обновление поста
  async updatePost(req, res) {
    // Извлекаем ID поста из параметров запроса
    const { id } = req.params;
    // Извлекаем заголовок и содержимое поста из тела запроса
    const { title, body } = req.body;
    try {
      // Выполняем SQL-запрос для обновления поста по ID
      const result = await pool.query(
        "UPDATE posts SET title = $1, body = $2 WHERE id = $3 RETURNING *",
        [title, body, id]
      );
      const updatedPost = result.rows[0]; // Извлекаем обновлённый пост из результата запроса
      if (!updatedPost) {
        // Если пост не найден, отправляем ответ с ошибкой 404
        return res.status(404).json({ message: "Post not found" });
      }
      // Возвращаем обновлённый пост в формате JSON
      res.json(updatedPost);
    } catch (error) {
      // Логируем ошибку в консоль
      console.error("Error updating post:", error);
      // Отправляем ответ с ошибкой и статусом 500
      res.status(500).json({ message: "Server error, unable to update post." });
    }
  }

  // Удаление поста
  async deletePost(req, res) {
    // Извлекаем ID поста из параметров запроса
    const { id } = req.params;
    try {
      // Выполняем SQL-запрос для удаления поста по ID
      const result = await pool.query(
        "DELETE FROM posts WHERE id = $1 RETURNING *",
        [id]
      );
      const deletedPost = result.rows[0]; // Извлекаем удалённый пост из результата запроса
      if (!deletedPost) {
        // Если пост не найден, отправляем ответ с ошибкой 404
        return res.status(404).json({ message: "Post not found" });
      }
      // Отправляем сообщение об успешном удалении поста
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      // Логируем ошибку в консоль
      console.error("Error deleting post:", error);
      // Отправляем ответ с ошибкой и статусом 500
      res.status(500).json({ message: "Server error, unable to delete post." });
    }
  }
}

// Экспортируем экземпляр класса PostController для использования в других модулях
module.exports = new PostController();

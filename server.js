import pkg from 'pg';
const { Pool } = pkg; // Desestructuración del objeto importado

import express from 'express';
import cors from 'cors';

// Configuración del servidor
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'tu_usuario', // Reemplazar con tu usuario de PostgreSQL
    host: 'localhost',
    database: 'likeme',
    password: 'tu_contraseña', // Reemplazar con tu contraseña
    port: 5432,
});

// Rutas

// GET /posts - Obtener todos los posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los posts:', error);
        res.status(500).json({ message: 'Error al obtener los posts' });
    }
});

// POST /posts - Crear un nuevo post
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body;

    try {
        const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *';
        const values = [titulo, img, descripcion];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Post creado exitosamente', post: result.rows[0] });
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ message: 'Error al crear el post' });
    }
});

// PUT /posts/:id/like - Agregar un like a un post
app.put('/posts/:id/like', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.json({ message: 'Like agregado exitosamente', post: result.rows[0] });
        } else {
            res.status(404).json({ message: 'Post no encontrado' });
        }
    } catch (error) {
        console.error('Error al agregar like:', error);
        res.status(500).json({ message: 'Error al agregar like' });
    }
});

// DELETE /posts/:id - Eliminar un post
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.json({ message: 'Post eliminado exitosamente', post: result.rows[0] });
        } else {
            res.status(404).json({ message: 'Post no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        res.status(500).json({ message: 'Error al eliminar el post' });
    }
});

// Levantar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

import express from 'express';
import cors from 'cors';
import pkg from 'pg'; 
const { Pool } = pkg; 

// Configuración del servidor
const app = express();

// Habilitar CORS
app.use(cors());

// Configurar Express para manejar JSON
app.use(express.json());

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: 'tu_usuario', // Cambia estos valores según tu configuración
    host: 'localhost',
    database: 'likeme',
    password: 'tu_contraseña',
    port: 5432,
});

// Ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta POST para crear un nuevo post
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
            [titulo, img, descripcion]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el post');
    }
});

// Ruta PUT para dar like a un post
app.put('/posts/like/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al dar like');
    }
});

// Ruta DELETE para eliminar un post
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el post');
    }
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



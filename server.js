import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; // <-- usa la versión basada en promesas

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración del pool de conexiones
const pool = mysql.createPool({
    host: 'shortline.proxy.rlwy.net',
    user: 'root',
    password: 'cUlGjxXYaJmNTynxeURdxXjDcJmGRpOF',
    database: 'railway',
    port: 14150,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ruta para obtener conductores
app.get('/turnos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM conductores');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener conductores:', err);
        res.status(500).json({ mensaje: 'Error al obtener conductores' });
    }
});

// Ruta para registrar un conductor
app.post('/registrar', async (req, res) => {
    const { nombre, placa, cedula } = req.body;

    if (!nombre || !placa || !cedula) {
        return res.status(400).json({ mensaje: 'Nombre, placa y cedula son requeridos' });
    }

    try {
        const horaLlegada = new Date(); // Hora actual
        const query = 'INSERT INTO conductores (nombre, placa, cedula, hora_llegada) VALUES (?, ?, ?)';
        await pool.query(query, [nombre, placa, cedula, horaLlegada]);
        console.log(`Conductor registrado: Nombre=${nombre}, Placa=${placa}, Cedula=${cedula}`);
        res.json({ mensaje: 'Conductor registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar conductor:', err);
        res.status(500).json({ mensaje: 'Error al registrar conductor' });
    }
});

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://railway:${PORT}`);
});

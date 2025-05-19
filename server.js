import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Ruta para obtener conductores
app.get('/turnos', (req, res) => {
    const query = 'SELECT * FROM conductores';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener conductores:', err);
            return res.status(500).json({ mensaje: 'Error al obtener conductores' });
        }
        res.json(results);
    });
});

// Ruta para registrar un conductor
app.post('/registrar', (req, res) => {
    const { nombre, placa } = req.body;

    if (!nombre || !placa) {
        return res.status(400).json({ mensaje: 'Nombre y placa son requeridos' });
    }

    const query = 'INSERT INTO conductores (nombre, placa, hora_llegada) VALUES (?, ?, ?)';
    const horaLlegada = new Date(); // Hora actual
    db.query(query, [nombre, placa, horaLlegada], (err, result) => {
        if (err) {
            console.error('Error al registrar conductor:', err);
            return res.status(500).json({ mensaje: 'Error al registrar conductor' });
        }
        console.log(`Conductor registrado: Nombre=${nombre}, Placa=${placa}`);
        res.json({ mensaje: 'Conductor registrado exitosamente' });
    });
});

// Iniciar el servidor en el puerto 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
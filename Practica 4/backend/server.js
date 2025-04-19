import express from 'express';
import rutas from './routes/routes.js';
import cors from 'cors';

const app = express();
const PORT = 3002;  // Cambié el puerto a 3002

app.use(express.json());
app.use(cors({ origin: `http://localhost:3000` }));

// Prefijo de ruta para todas las solicitudes
app.use('/api', rutas);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}`);
});

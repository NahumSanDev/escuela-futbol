import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import pagosRoutes from './routes/pagos.js';
import partidosRoutes from './routes/partidos.js';
import avisosRoutes from './routes/avisos.js';
import productosRoutes from './routes/productos.js';
import codigosRoutes from './routes/codigos.js';
import familiasRoutes from './routes/familias.js';
import initRoutes from './routes/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/partidos', partidosRoutes);
app.use('/api/avisos', avisosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/codigos', codigosRoutes);
app.use('/api/familias', familiasRoutes);
app.use('/api/init', initRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CEFOR API running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

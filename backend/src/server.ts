import express from 'express';
import cors from 'cors';
import routes from './routes/routes';

const app = express();

// Middleware per il parsing JSON
app.use(express.json());

// Configurazione CORS
app.use(cors({
  origin: '*', // In produzione, specifica i domini consentiti
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Usa le routes
app.use(routes);

// Gestione errori 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
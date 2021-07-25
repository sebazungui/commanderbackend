import express from 'express';

import { getTorneos, getTorneosBySearch, getTorneo, participar, iniciarTorneo, agregarJugador, comentar, createTorneo, updateTorneo, likeTorneo, deleteTorneo } from '../controllers/torneos.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/search', getTorneosBySearch);

router.get('/', getTorneos);
router.get('/:id', getTorneo);
router.get('/:id/rondas', getTorneo);

router.post('/', auth,  createTorneo);
router.patch('/:id', auth, updateTorneo);
router.delete('/:id', auth, deleteTorneo);
router.patch('/:id/likeTorneo', auth, likeTorneo);
router.patch('/:id/participar', auth, participar);
router.post('/:id/comentar', comentar);
router.post('/:id/comentar', participar);
router.post('/:id/iniciarTorneo', auth, iniciarTorneo);

router.patch('/:id/agregarJugador', auth, agregarJugador);

export default router;
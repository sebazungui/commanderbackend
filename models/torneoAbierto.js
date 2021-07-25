import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { userSchema } from './user.js';

const torneoSchema = mongoose.Schema({
    title: String,
    detalle: String,
    creator: String,
    name: String,
    lugar: String,
    selectedFile: String,
    iniciado: { type: Boolean, default: false },
    comentarios: { type: [String], default: [] },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rondas: [Object],
    puntuacion: { 
        jugador: {type: String},
        puntos: {type: Number}
    },
    fecha: {
        type: Date,
        default: new Date()
    },
    fechaTorneo: {
        type: Date,
        default: new Date()
    },
});

var TorneoAbierto = mongoose.model('TorneoAbierto', torneoSchema);


export default TorneoAbierto;
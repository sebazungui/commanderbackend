import express from 'express';
import mongoose from 'mongoose';

import TorneoAbierto from '../models/torneoAbierto.js';

const router = express.Router();

export const getTorneos = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;

        const total = await TorneoAbierto.countDocuments({});
        const torneos = await TorneoAbierto.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: torneos, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteTorneo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await TorneoAbierto.findByIdAndRemove(id);

    res.json({ message: "Torneo deleted successfully." });
}

export const getTorneosBySearch = async (req, res) => {
    const { searchQuery } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i');

        const torneos = await TorneoAbierto.find({ title });
        res.json({ data: torneos });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getTorneo = async (req, res) => {
    const { id } = req.params;

    try {
        const torneo = await TorneoAbierto.findById(id).populate({
            path: 'likes',
            select: 'name _id'
        }).exec(function (err, torneo) {
            res.status(200).json(torneo);
        });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createTorneo = async (req, res) => {
    const torneo = req.body;

    const newTorneoAbierto = new TorneoAbierto({ ...torneo, creator: req.userId, fecha: new Date().toISOString() })

    try {
        await newTorneoAbierto.save();

        res.status(201).json(newTorneoAbierto);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateTorneo = async (req, res) => {
    const { id } = req.params;
    const { title, detalle, creator, selectedFile, lugares, jugadores } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No torneo with id: ${id}`);

    const updatedTorneo = { creator, title, detalle, lugares, jugadores, selectedFile, _id: id };

    await TorneoAbierto.findByIdAndUpdate(id, updatedTorneo, { new: true });

    res.json(updatedTorneo);
}

export const iniciarTorneo = async (req, res) => {
    const { id } = req.params;
    const { rondas } = req.body;

    const torneo = await TorneoAbierto.findById(id);

    // const rondasNew = JSON.stringify(rondas);
    // torneo.rondas.push(rondas);
    // const iniciado = true;

    // const updatedTorneo = await TorneoAbierto.findByIdAndUpdate(id, torneo, { new: true });
    const updatedTorneo2 = await TorneoAbierto.findByIdAndUpdate(id, rondas);

    // res.json(updatedTorneo);
    res.json(updatedTorneo2);
}



export const agregarJugador = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No torneo with id: ${id}`);


}

export const likeTorneo = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No torneo with id: ${id}`);

    const torneo = await TorneoAbierto.findById(id);

    const index = torneo.likes.findIndex((id) => String(id) === String(req.userId));
    if (index === -1) {
        torneo.likes.push(req.userId);

    } else {
        torneo.likes = torneo.likes.filter((id) => String(id) !== String(req.userId));

    }
    const updatedTorneo = await TorneoAbierto.findByIdAndUpdate(id, torneo, { new: true });
    res.status(200).json(updatedTorneo);
}

export const comentar = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const torneo = await TorneoAbierto.findById(id);

    torneo.comentarios.push(value);

    const updatedTorneo = await TorneoAbierto.findByIdAndUpdate(id, torneo, { new: true });
    res.json(updatedTorneo);
}

export const participar = async (req, res) => {
    const { id } = req.params;
    const { asistentes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No torneo with id: ${id}`);

    const updatedTorneo = { asistentes, _id: id };

    await TorneoAbierto.findByIdAndUpdate(id, updatedTorneo, { new: true });

    res.json(updatedTorneo);
}

export default router;

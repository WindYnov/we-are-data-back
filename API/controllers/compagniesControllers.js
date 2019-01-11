const compagnies = require('../models/compagniesModels');
const mongoose = require('mongoose'); // Import du schéma
const compagnie = mongoose.model('compagnie', compagnies); // Création du modèle à partir du schéma

function respond(err, result, res) { // Fonction utilisée tout au long du contrôleur pour répondre
    if (err) {
        return res.status(500).json({error: err});
    }
    return res.json(result);
}

const compagniesControllers = {
    getAll: (req, res) => {  // Récupérer tous les items de la TodoList
        compagnie.find({}, (err, compagnies) => {
            return respond(err, compagnies, res);
        });
    },
    create: (req, res) => { // Créer une tâche
        const newCompagnie = new compagnie(req.body);
        newCompagnie.save((err, saveCompagnie) => {
            return respond(err, saveCompagnie, res);
        });
    },
    get: (req, res) => { // Récupérer une tâche
        compagnie.findById(req.params.id, (err, compagnie) => {
            return respond(err, compagnie, res);
        });
    },
    update: (req, res) => { // Mettre à jour une tâche
        compagnie.findByIdAndUpdate(req.params.id, req.body, (err, compagnie) => {
            return respond(err, compagnie, res);
        });
    },
    delete: (req, res) => { // Supprimer une tâche
        compagnie.findByIdAndRemove(req.params.id, (err, compagnie) => {
            return respond(err, compagnie, res);
        });
    }
};

module.exports = compagniesControllers; // Export du contrôleur
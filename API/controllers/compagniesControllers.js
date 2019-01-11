const modelsCompagnies = require('../models/compagniesModels');
const mongoose = require('mongoose'); // Import du schéma
const actions = mongoose.model('actions', modelsCompagnies); // Création du modèle à partir du schéma

function respond(err, result, res) { // Fonction utilisée tout au long du contrôleur pour répondre
    if (err) {
        return res.status(500).json({error: err});
    }
    return res.json(result);
}

const compagniesControllers = {
    getAll: (req, res) => {  // Récupérer tous les items de la TodoList
        actions.find({}, (err, compagnies) => {
            return respond(err, compagnies, res);
        });
    },
    create: (req, res) => { // Créer une tâche
        const newCompagnie = new actions(req.body);
        newCompagnie.save((err, saveCompagnie) => {
            return respond(err, saveCompagnie, res);
        });
    },
    get: (req, res) => { // Récupérer une tâche
        actions.findById(req.params.id, (err, compagnie) => {
            return respond(err, compagnie, res);
        });
    },
    update: (req, res) => { // Mettre à jour une tâche
        actions.findByIdAndUpdate(req.params.id, req.body, (err, compagnie) => {
            return respond(err, compagnie, res);
        });
    },
    delete: (req, res) => { // Supprimer une tâche
        actions.findByIdAndRemove(req.params.id, (err, compagnie) => {
            return respond(err, compagnie, res);
        });
    }
};

module.exports = compagniesControllers; // Export du contrôleur
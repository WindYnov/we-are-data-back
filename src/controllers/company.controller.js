const compayModel = require('../models/company.model');
const mongoose = require('mongoose'); // Import du schéma
const Company = mongoose.model('Company', compayModel); // Création du modèle à partir du schéma

function respond(err, result, res) { // Fonction utilisée tout au long du contrôleur pour répondre
    if (err) {
        return res.status(500).json({error: err});
    }
    return res.json(result);
}

const companyController = {
    getAll: (req, res) => {  // Récupérer tous les items de la TodoList
        Company.find({}, (err, compagnies) => {
            return respond(err, compagnies, res);
        });
    },
    create: (req, res) => { // Créer une tâche
        const company = new Company(req.body);
        company.save((err, data) => {
            return respond(err, data, res);
        });
    },
    get: (req, res) => { // Récupérer une tâche
        Company.findById(req.params.id, (err, data) => {
            return respond(err, data, res);
        });
    },
    update: (req, res) => { // Mettre à jour une tâche
        Company.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
            return respond(err, data, res);
        });
    },
    delete: (req, res) => { // Supprimer une tâche
        Company.findByIdAndRemove(req.params.id, (err, data) => {
            return respond(err, data, res);
        });
    }
};

module.exports = companyController; // Export du contrôleur
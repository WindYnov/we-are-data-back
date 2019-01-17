const mongoose = require('mongoose'); // Import de la librairie mongoose
const Schema = mongoose.Schema;

// Définition du schéma
const CompanySchema = new Schema({
            nom: {
                type: String,
                trim: true,
                required: true
            },
            prenom: {
                type: String,
                trim: true,
                required: true
            },
            societe: {
                type: String,
                trim: true,
                required: true
            },
            siret: {
                type: String,
                trim: true,
                required: true
            },
            email: {
                type: String,
                trim: true,
                required: true
            },
            telephone: {
                type: String,
                trim: true,
                required: true
            },
            keepInformed: {
                type: Boolean
            }
    },
    {
        timestamps: true
    } // Pour avoir les dates de création et de modification automatiquement gérés par mongoose
);

module.exports = CompanySchema; // Export du schéma
const compagniesAction = require('../controllers/compagniesControllers'); // Import du contrôleur

module.exports = (app) => {
    app.route('/compagnie').get(compagniesAction.getAll);
    app.route('/compagnie').post(compagniesAction.create);
    app.route('/compagnie/:id').get(compagniesAction.get);
    app.route('/compagnie/:id').put(compagniesAction.update);
    app.route('/compagnie/:id').delete(compagniesAction.delete);

    app.use((req, res) => { // Middleware pour capturer une requête qui ne match aucune des routes définies plus tôt
        res.status(404).json({url: req.originalUrl, error: 'not found'});
    });
};
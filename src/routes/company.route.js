const CompanyController = require('../controllers/company.controller'); // Import du contrôleur

module.exports = (app) => {
    app.route('/company/info').get(CompanyController.getAll);
    app.route('/company/info').post(CompanyController.create);
    app.route('/company/info/:id').get(CompanyController.get);
    app.route('/company/info/:id').put(CompanyController.update);
    app.route('/company/info/:id').delete(CompanyController.delete);

    app.use((req, res) => { // Middleware pour capturer une requête qui ne match aucune des routes définies plus tôt
        res.status(404).json({url: req.originalUrl, error: 'not found'});
    });
};
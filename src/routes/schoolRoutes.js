const express = require('express');
const SchoolController = require('../controllers/schoolController');
const SchoolModel = require('../models/schoolModel');

module.exports = (db) => {
    const router = express.Router();
    const schoolModel = new SchoolModel(db);
    const schoolController = new SchoolController(schoolModel);

    router.post('/addSchool', schoolController.addSchool.bind(schoolController));
    router.get('/listSchools', schoolController.listSchools.bind(schoolController));

    return router;
};
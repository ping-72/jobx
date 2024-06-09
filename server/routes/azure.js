const express = require('express');
const router = express.Router();

const AzureController = require('../controllers/azureController');

router.get('/sas/:userId/:questionId', AzureController.generateSasToken);

module.exports = router;
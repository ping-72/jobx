const express = require('express');
const router = express.Router();

const AzureController = require('../controllers/azureController');

router.get('/sas/:userId/:questionId', AzureController.generateSasToken);

router.get('/transcribe/:userId/:questionId', AzureController.handleTranscription);

router.get('/audio/download', AzureController.downloadAudio);

module.exports = router;
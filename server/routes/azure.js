const express = require("express");
const router = express.Router();

const AzureController = require("../controllers/azureController");

router.get("/sas/:userId/:jobId/:questionId", AzureController.generateSasToken);

router.post(
  "/transcribeForOneQuestion",
  AzureController.handleTranscriptionForEachQuestion
);

router.post("/transcribe", AzureController.handleTranscriptionForAllQuestions);

router.get("/audio/download", AzureController.downloadAudio);

module.exports = router;

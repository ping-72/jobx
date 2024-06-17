const express = require("express");
const router = express.Router();
const openAIController = require("../controllers/openAIController");

router.post("/moderate", openAIController.moderateContent);
router.post("/evaluate", openAIController.evaluateTranscription);

module.exports = router;

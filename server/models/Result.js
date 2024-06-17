const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultsSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  question_id: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  score: {
    communication: { type: Number, required: true },
    subject_expertise: { type: Number, required: true },
    relevancy: { type: Number, required: true },
    // Additional categories can be added here
  },
  feedback: { type: String, required: true },
});

const Result = mongoose.model("Result", resultsSchema);

module.exports = Result;

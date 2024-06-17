const mongoose = require("mongoose");
const { Schema } = mongoose;

const interviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  interviews: [
    {
      interview_id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
        required: false,
      },
      job_id: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },
      data: [
        {
          question: {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
          },
          answer: { type: String, required: true },
        },
      ],
      attempt_number: { type: Number, required: true },
    },
  ],
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;

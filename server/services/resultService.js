const Result = require("../models/Result");

const saveResult = async (userId, jobId, questionId, scores, feedback) => {
  const newResult = new Result({
    user_id: userId,
    job_id: jobId,
    question_id: questionId,
    score: scores,
    feedback: feedback,
  });

  await newResult.save();
};

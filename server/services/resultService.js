const Result = require("../models/Result");

const saveResult = async (userId, jobId, questionId, scores, feedback) => {
  // Check if the result already exists
  const result = await checkResult(userId, jobId, questionId);
  if (result) {
    return;
  }
  const newResult = new Result({
    user_id: userId,
    job_id: jobId,
    question_id: questionId,
    score: scores,
    feedback: feedback,
  });

  await newResult.save();
};

const checkResult = async (userId, jobId, questionId) => {
  const result = await Result.findOne({
    user_id: userId,
    job_id: jobId,
    question_id: questionId,
  });
  return result;
};

module.exports = { saveResult };

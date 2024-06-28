const Interview = require("../models/Interview");

const updateAnswer = async (userId, jobId, questionId, transcription) => {
  // Find the specific interview document
  let interview = await Interview.findOne({
    user_id: userId,
    "interviews.job_id": jobId,
  });

  // Find the specific question
  let question = interview.interviews[0].data.find(
    (q) => q.question.toString() === questionId
  );

  // Update the "answer" field
  question.answer = transcription;

  // Save the changes
  await interview.save();
};

const prepareInterviewText = async (questionId, answer) => {
  // Find the question by its ID
  const question = await Question.findById(questionId);

  // Prepare the interview text
  const interviewText = {
    question: question.question,
    answer: answer,
  };

  return interviewText;
};

// const InterviewService = { updateAnswer, prepareInterviewText };

module.exports = { updateAnswer, prepareInterviewText };

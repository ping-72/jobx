const Interview = require("../models/Interview");
const Question = require("../models/Question");

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

const getInterviewText = async (userId, jobId) => {
  console.log("Preparing interview text for AI", userId, jobId);
  const interview = await Interview.findOne({
    user_id: userId,
    "interviews.job_id": jobId,
  });
  data = interview.interviews[0].data;

  let interviewTexts = [];
  for (const { question, answer } of data) {
    const questionText = await Question.findById(question);
    interviewTexts.push({
      questionId: question,
      question: questionText.question,
      answer: answer,
    });
  }
  return interviewTexts;
};

const prepareInterviewTextForEachQuestion = async (questionId, answer) => {
  // Find the question by its ID
  const question = await Question.findById(questionId);

  // Prepare the interview text
  const interviewText = {
    question: question.question,
    answer: answer,
  };

  return interviewText;
};

const getQuestionIds = async (userId, jobId) => {
  const interview = await Interview.findOne({
    user_id: userId,
    "interviews.job_id": jobId,
  });
  console.log("interview", interview);
  return interview.interviews[0].data.map((q) => q.question.toString());
};

// const InterviewService = { updateAnswer, prepareInterviewText };

module.exports = {
  updateAnswer,
  getInterviewText,
  prepareInterviewTextForEachQuestion,
  getQuestionIds,
};

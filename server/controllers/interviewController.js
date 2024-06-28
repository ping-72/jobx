const Interview = require("../models/Interview"); // Import the Interview model
const MAX_ATTEMPTS = process.env.MAX_ATTEMPTS || 5; // Default to 5 if not specified in .env
const Question = require("../models/Question");
// const InterviewService = require("../services/interviewService");
const { updateAnswer } = require("../services/interviewService");

// Only for local mongo DB connection for testing
// const Questions = [
//     "What are you looking for in your next job?",
//      "What are your career goals for the next five years?",
//      "Describe a problem that you have solved using data. What did you enjoy about the process?"
// ]

const getQuestions = async (req, res) => {
  // res.json({ Questions }); // Use only for local mongo db connection
  try {
    // Fetch random questions, e.g., 3 questions
    const numberOfQuestions =
      parseInt(process.env.NUMBER_OF_QUESTIONS_IN_INTERVIEW) || 3;
    const randomQuestions = await Question.aggregate([
      { $sample: { size: numberOfQuestions } },
    ]);

    res.json({ Questions: randomQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

// Function to store interview data
const postInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interview } = req.body;

    // Find existing interview data for the user
    let userInterview = await Interview.findOne({ user_id: userId });

    // Check if the user has reached the maximum number of attempts
    if (userInterview && userInterview.interviews.length >= MAX_ATTEMPTS) {
      return res
        .status(403)
        .json({ message: "Maximum number of attempts reached." });
    }

    // Create a new interview attempt
    const newAttempt = {
      interview,
      attempt_number: userInterview ? userInterview.interviews.length + 1 : 1,
    };

    // If no existing interview data, create new record
    if (!userInterview) {
      userInterview = new Interview({
        user_id: userId,
        interviews: [newAttempt],
      });
    } else {
      // Add new attempt to existing interview data
      userInterview.interviews.push(newAttempt);
    }

    // Save the interview data
    await userInterview.save();
    console.log(
      "Interview data stored successfully for Interview number: ",
      newAttempt.attempt_number
    );
    res.status(201).json({ message: "Interview data stored successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to store interview data. Please try again." });
  }
};

const updateAnswerHandler = async (req, res) => {
  const { user_id, job_id, question_id, answer } = req.body;
  try {
    await updateAnswer(user_id, job_id, question_id, answer);
    res.status(200).json({ message: "Answer updated successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update answer. Please try again." });
  }
};

const createInterview = async (req, res) => {
  const { user_id, job_id, question_ids } = req.body;

  try {
    let attempt_number = 1;

    // Check if there's already an interview for the user
    const existingInterview = await Interview.findOne({ user_id });

    if (existingInterview) {
      attempt_number = existingInterview.interviews.length + 1;

      // Check if there's already an interview for the same job
      const existingJobInterview = existingInterview.interviews.find(
        (interview) => interview.job_id.equals(job_id)
      );
      // If there's already an interview for the same job, return an error
      if (existingJobInterview) {
        return res
          .status(400)
          .json({ message: "Interview already exists for this user and job" });
      }

      // Add a new interview data under the interviews field
      existingInterview.interviews.push({
        job_id,
        data: question_ids.map((question_id) => ({
          question: question_id,
          answer: "", // Initially empty, to be filled later
        })),
        attempt_number,
      });

      await existingInterview.save();

      return res.status(201).json({
        message: "Interview created successfully",
        interview: existingInterview,
      });
    }

    // If no existing interview, create a new interview document
    const interview = new Interview({
      user_id,
      interviews: [
        {
          job_id,
          data: question_ids.map((question_id) => ({
            question: question_id,
            answer: "", // Initially empty, to be filled later
          })),
          attempt_number,
        },
      ],
    });

    await interview.save();

    res
      .status(201)
      .json({ message: "Interview created successfully", interview });
  } catch (error) {
    console.error("Error creating interview:", error);
    res.status(500).json({ message: "Error creating interview", error });
  }
};

const getCurrentCountOfInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find existing interview data for the user
    let userInterview = await Interview.findOne({ user_id: userId });

    if (userInterview) {
      return res.status(200).json({ count: userInterview.interviews.length });
    }
    return res.status(200).json({ count: 0 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to get the count data. Please try again" });
  }
};

const InterviewController = {
  getQuestions,
  postInterview,
  getCurrentCountOfInterviews,
  createInterview,
  updateAnswerHandler,
};

module.exports = InterviewController;

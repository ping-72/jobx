const axios = require("axios");
const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const ffmpeg = require("fluent-ffmpeg");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const path = require("path");
const interviewService = require("../services/interviewService");

require("dotenv").config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const credential = new DefaultAzureCredential();

const downloadBlob = async (sasUrl, downloadFilePath) => {
  const response = await axios.get(sasUrl, { responseType: "stream" });
  const writer = fs.createWriteStream(downloadFilePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const extractAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .noVideo()
      .on("end", () => {
        console.log("Audio extracted successfully");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error extracting audio:", err);
        reject(err);
      })
      .run();
  });
};

const transcribeAudio = async (audioPath) => {
  const subscriptionKey = process.env.AZURE_SPEECH_KEY;
  const serviceRegion = process.env.AZURE_SPEECH_REGION;

  const audioConfig = sdk.AudioConfig.fromWavFileInput(
    fs.readFileSync(audioPath)
  );
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
  speechConfig.speechRecognitionLanguage = "en-US";

  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    let transcription = "";

    recognizer.recognizing = (s, e) => {
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
        transcription += `${e.result.text} `;
      } else if (e.result.reason === sdk.ResultReason.NoMatch) {
        console.log("NOMATCH: Speech could not be recognized.");
      }
    };

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);

      if (e.reason === sdk.CancellationReason.Error) {
        console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
        reject(e.errorDetails);
      }

      recognizer.stopContinuousRecognitionAsync();
    };

    recognizer.sessionStopped = (s, e) => {
      console.log("Session stopped event.");
      recognizer.stopContinuousRecognitionAsync(() => {
        resolve(transcription.trim());
      });
    };

    recognizer.startContinuousRecognitionAsync();
  });
};

const uploadBlob = async (sasUrl, content) => {
  await axios.put(sasUrl, content, {
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": "text/plain",
    },
  });
  console.log(`Uploaded text blob successfully`);
};

const generateSasTokenForBlob = async (userId, blobName) => {
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const startsOn = new Date();
  const expiresOn = new Date();
  expiresOn.setHours(expiresOn.getHours() + 1);

  const userDelegationKey = await blobServiceClient.getUserDelegationKey(
    startsOn,
    expiresOn
  );

  const sasOptions = {
    containerName,
    permissions: BlobSASPermissions.parse("rw"), // read, write permissions
    startsOn,
    expiresOn,
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    userDelegationKey,
    accountName
  ).toString();
  return `${blobClient.url}?${sasToken}`;
};

const processVideo = async (userId, jobId, questionId) => {
  const videoBlobName = `${userId}/${jobId}/${questionId}.webm`;
  const videoFilePath = path.join(__dirname, "video.webm");
  const audioFilePath = path.join(__dirname, "audio.wav");
  const transcriptBlobName = `${userId}/${jobId}/${questionId}.txt`;

  try {
    // Fetch the SAS token for downloading the video
    const videoSasUrl = await generateSasTokenForBlob(userId, videoBlobName);

    // Step 1: Download the video blob
    await downloadBlob(videoSasUrl, videoFilePath);

    // Step 2: Extract audio from the video
    await extractAudio(videoFilePath, audioFilePath);

    // Step 3: Transcribe the audio
    const transcription = await transcribeAudio(audioFilePath);

    // Fetch the SAS token for uploading the transcription
    const transcriptSasUrl = await generateSasTokenForBlob(
      userId,
      transcriptBlobName
    );

    // Step 4: Upload the transcription as a blob
    await uploadBlob(transcriptSasUrl, transcription);

    // Step 5: Update the interview mongo DB data with the transcription
    await interviewService.updateAnswer(
      userId,
      jobId,
      questionId,
      transcription
    );
  } catch (error) {
    console.error("Error processing video:", error);
  } finally {
    // Clean up temporary files
    fs.unlinkSync(videoFilePath);
    fs.unlinkSync(audioFilePath);
  }
};

const handleTranscription = async (req, res) => {
  const { userId, jobId, questionId } = req.params;
  try {
    await processVideo(userId, jobId, questionId);
    res.status(200).send("Transcription process completed successfully.");
  } catch (error) {
    res.status(500).send("Error during transcription process.");
  }
};

const generateSasToken = async (req, res) => {
  const { userId, jobId, questionId } = req.params;
  try {
    const sasUrl = await generateSasTokenForBlob(
      userId,
      `${userId}/${jobId}/${questionId}.webm`
    );
    res.json({ sasUrl });
  } catch (error) {
    console.error("Error generating SAS token:", error);
    res.status(500).json({ message: "Error generating SAS token" });
  }
};

const downloadAudio = (req, res) => {
  const audioFilePath = path.join(__dirname, "audio.wav");
  res.download(audioFilePath, "audio.wav", (err) => {
    if (err) {
      console.error("Error downloading the audio file:", err);
      res.status(500).send("Error downloading the audio file.");
    }
  });
};

const azureController = {
  generateSasToken,
  handleTranscription,
  downloadAudio,
};

module.exports = azureController;

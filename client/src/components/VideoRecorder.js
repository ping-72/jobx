import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import QuestionDisplay from './interview/QuestionDisplay'; // Make sure to update the path as needed

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [thinkingTime, setThinkingTime] = useState(30); // 30 seconds for thinking
  const [recordingTime, setRecordingTime] = useState(150); // 2 mins 30 seconds for recording
  const [timerActive, setTimerActive] = useState(true);
  const [showRecordingIcon, setShowRecordingIcon] = useState(false);
  
  const question = "Can you tell us about a challenging project you worked on?"; // Example question
  const currentQuestionIndex = 0;

  const handleDataAvailable = useCallback(
    ({ data }) => {
      console.log('Data available:', data);
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
        console.log('Recorded chunks:', recordedChunks);
      }
    },
    [setRecordedChunks, recordedChunks]
  );

  const handleDownload = useCallback(() => {
    console.log('Handle download:', recordedChunks);
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'react-webcam-stream-capture.webm';
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    } else {
      console.log('No recorded chunks to download');
    }
  }, [recordedChunks]);

  const handleStartCaptureClick = useCallback(() => {
    console.log('Starting capture');
    setCapturing(true);
    setThinkingTime(0);
    setShowRecordingIcon(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm'
    });
    mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorderRef.current.start();
    console.log('MediaRecorder started');
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    console.log('Handle stop capture click');
    mediaRecorderRef.current.stop();
    setCapturing(false);
    setRecordingTime(0);
    setShowRecordingIcon(false);
    setTimerActive(false);
  }, [mediaRecorderRef, setCapturing, setShowRecordingIcon, setTimerActive]);

  useEffect(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      console.log('Adding stop event listener');
      mediaRecorder.addEventListener('stop', handleDownload);
      return () => {
        console.log('Removing stop event listener');
        mediaRecorder.removeEventListener('stop', handleDownload);
      };
    }
  }, [handleDownload]);

  useEffect(() => {
    if (timerActive) {
      const thinkingTimer = setTimeout(() => {
        if (!capturing) {
          handleStartCaptureClick();
        }
        const recordingTimer = setTimeout(() => {
          if (capturing) {
            handleStopCaptureClick();
          }
        }, recordingTime * 1000);

        return () => clearTimeout(recordingTimer);
      }, thinkingTime * 1000);

      return () => clearTimeout(thinkingTimer);
    }
  }, [thinkingTime, recordingTime, timerActive, capturing, handleStartCaptureClick, handleStopCaptureClick]);

  useEffect(() => {
    let interval;
    if (timerActive && thinkingTime > 0) {
      interval = setInterval(() => {
        setThinkingTime(prev => prev - 1);
      }, 1000);
    } else if (timerActive && recordingTime > 0 && capturing) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [thinkingTime, recordingTime, timerActive, capturing]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <QuestionDisplay 
        question={question} 
        currentQuestionIndex={currentQuestionIndex} 
        skipAnimate={false} 
      />
      <div className="mb-4 relative">
        <Webcam 
          audio={true} 
          ref={webcamRef} 
          muted={true} 
          className="rounded-lg shadow-lg border-10 border-gray-300" 
        />
        {showRecordingIcon && (
          <div className="absolute top-0 left-0 m-2 p-2 bg-red-600 text-white rounded-full">
            Recording...
          </div>
        )}
        <div className="absolute bottom-0 left-0 m-2 p-2 bg-white text-black rounded-lg">
            {thinkingTime > 0 && !capturing
                ? `Recording will start in ${thinkingTime} seconds`
                : recordingTime > 0 && `Recording will stop in ${recordingTime} seconds`}
        </div>
      </div>
      <div className="flex space-x-4">
        {thinkingTime > 0 && !capturing && (
          <button 
            onClick={handleStartCaptureClick} 
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Start Capture
          </button>
        )}
        {recordingTime > 0 && capturing && (
          <button 
            onClick={handleStopCaptureClick} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Stop Capture
          </button>
        )}
        {/* Commented out download button */}
        {recordedChunks.length > 0 && (
          <button 
            onClick={handleDownload} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Download
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;

import {useEffect,useRef,useState} from "react";
import {processAnswerVideo} from "../services/api";
import "./VideoRecorder.css";

function getSupportedVideoMimeType() {
  if (!window.MediaRecorder|| !MediaRecorder.isTypeSupported) {
    return "";
  }

  const possibleVideoTypes = ["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm","video/mp4"];
  const supportedVideoType = possibleVideoTypes.find((videoType) => {return MediaRecorder.isTypeSupported(videoType);});
  return supportedVideoType || "";
}

function getVideoExtension(mimeType) {
  if (mimeType && mimeType.includes("mp4")) {
    return "mp4";
  }

  return "webm";
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds =totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatFileSize(sizeBytes) {
  if (!sizeBytes) {
    return "0 KB";
  }

  const sizeKilobytes =sizeBytes / 1024;

  if (sizeKilobytes < 1024) {
    return `${sizeKilobytes.toFixed(1)} KB`;
  }

  const sizeMegabytes =sizeKilobytes / 1024;

  return `${sizeMegabytes.toFixed(2)} MB`;
}

function VideoRecorder({questionIndex,question,savedRecording,onRecordingChange}) {
  const previewVideoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingStartedAtRef = useRef(null);
  const [recording,setRecording] = useState(savedRecording || null);
  const [cameraReady,setCameraReady] = useState(false);
  const [isRecording,setIsRecording] = useState(false);
  const [recordingSeconds,setRecordingSeconds] = useState(0);
  const [error,setError] = useState("");
  
  useEffect(() => {
    setRecording(savedRecording || null);
  }, [savedRecording,questionIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const mediaRecorder = mediaRecorderRef.current;

      if (mediaRecorder && mediaRecorder.state!== "inactive") {
        mediaRecorder.ondataavailable =null;
        mediaRecorder.onstop =null;
        mediaRecorder.stop();
      }

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => {
              track.stop();
            }
          );
      }
    };
  }, []);

  function commitRecording(nextRecording) {
    setRecording(nextRecording);
    onRecordingChange(questionIndex,nextRecording);
  }

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function stopCamera(updateState = true) {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(
          (track) => {
            track.stop();
          }
        );

      cameraStreamRef.current =null;
    }

    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject =null;
    }

    if (updateState) {
      setCameraReady(false);
    }
  }


  async function enableCamera() {
    setError("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera recording is not supported in this browser.");
      return null;
    }

    try {
      const stream =await navigator.mediaDevices.getUserMedia({
            video: {
                width: {ideal: 1280},
              height: {ideal: 720},
              facingMode:"user"
            },

            audio: {
              echoCancellation:true,
              noiseSuppression:true,
              autoGainControl:true
            }
          });

      cameraStreamRef.current =stream;

      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }

      setCameraReady(true);
      return stream;
    }

    catch (cameraError) {
      console.error(cameraError);

      setError("Camera or microphone access was denied. Allow permission and try again.");
      return null;
    }
  }

  async function startRecording() {
    setError("");

    if (!window.MediaRecorder) {
      setError("MediaRecorder is not supported in this browser.");
      return;
    }

    let stream =cameraStreamRef.current;

    if (!stream || !stream.active) {
      stream = await enableCamera();
    }

    if (!stream) {
      return;
    }

    const selectedMimeType =getSupportedVideoMimeType();

    const recorderOptions = {videoBitsPerSecond:1200000,audioBitsPerSecond:64000};

    if (selectedMimeType) {
      recorderOptions.mimeType =selectedMimeType;
    }

    let mediaRecorder;

    try {
      mediaRecorder =new MediaRecorder(stream,recorderOptions);
    }

    catch {
      mediaRecorder =new MediaRecorder(stream);
    }

    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable =
      (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

    mediaRecorder.onstop = () => {
      clearTimer();

      const finalMimeType =mediaRecorder.mimeType|| selectedMimeType || "video/webm";

      const videoBlob =new Blob(recordedChunksRef.current,{type:finalMimeType});

      if (videoBlob.size === 0) {
        setError("No video data was recorded.");
        setIsRecording(false);
        stopCamera();
        return;
      }

      const extension =getVideoExtension(finalMimeType);
      const fileName =`answer-${questionIndex + 1}-${Date.now()}.${extension}`;
      const videoUrl =URL.createObjectURL(videoBlob);
      const durationSeconds =recordingStartedAtRef.current? Math.max(1,Math.round((Date.now()- recordingStartedAtRef.current) / 1000)): recordingSeconds;
      const nextRecording = {videoBlob,videoUrl,fileName,mimeType:finalMimeType,sizeBytes:videoBlob.size,durationSeconds,transcript:"",isProcessing:false,isProcessed:false,audioSizeBytes:null};
      commitRecording(nextRecording);
      setIsRecording(false);
      stopCamera();
    };

    mediaRecorderRef.current =mediaRecorder;
    recordingStartedAtRef.current =Date.now();
    setRecordingSeconds(0);
    setIsRecording(true);
    mediaRecorder.start(1000);
    timerRef.current =setInterval(() => {
          setRecordingSeconds((currentSeconds) => {
              return currentSeconds + 1;
            }
          );
        },
        1000
      );
  }

  function stopRecording() {const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || mediaRecorder.state=== "inactive") {
      return;
    }
    clearTimer();
    mediaRecorder.stop();
  }

  function retakeRecording() {
    setError("");
    stopCamera();
    commitRecording(null);
    setRecordingSeconds(0);
  }

  async function processRecording() {
    if (!recording || !recording.videoBlob) {
      setError("Record your answer first.");
      return;
    }
    setError("");
    const processingRecording = {...recording,isProcessing:true,isProcessed:false};
    commitRecording(processingRecording);

    try {
      const result = await processAnswerVideo({
          videoBlob:processingRecording.videoBlob,
          fileName:processingRecording.fileName,
          question,
          questionIndex
        });

      const processedRecording = {
        ...processingRecording,
        transcript:result.transcript,
        isProcessing:false,
        isProcessed:true,
        audioSizeBytes:result.audio_size_bytes
      };

      commitRecording(processedRecording);
    }

    catch (processingError) {
      console.error( processingError);

      commitRecording({
        ...processingRecording,
        isProcessing:false,
        isProcessed:false
      });

      setError(processingError.message || "The answer could not be processed.");
    }
  }


  return (
    <section className="video-recorder">
      <div className="video-recorder-heading">
        <div>
          <p className="video-label">Video answer</p>
          <h2>Record your response</h2>
        </div>

        {isRecording && (
          <div className="recording-indicator">
            <span className="recording-dot" />Recording{" "}{formatSeconds(recordingSeconds)}
          </div>
        )}
      </div>

      {!recording && (
        <div className="capture-section">
          <div className="video-preview-wrapper">
            <video
              ref={previewVideoRef}
              className="video-preview"
              autoPlay
              muted
              playsInline
            />

            {!cameraReady && (
              <div className="camera-placeholder">
                <span className="camera-icon">🎥</span>
                <p>Enable your camera to begin recording.</p>
              </div>
            )}
          </div>

          <div className="recorder-actions">
            {!cameraReady && (
              <button
                type="button"
                className="secondary-button"
                onClick={enableCamera}
                disabled={isRecording}
              >Enable Camera</button>
            )}

            {cameraReady
              && !isRecording && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={startRecording}
                >Start Recording</button>
              )}

            {isRecording && (
              <button
                type="button"
                className="stop-recording-button"
                onClick={stopRecording}
              >Stop Recording</button>
            )}
          </div>
        </div>
      )}

      {recording && (
        <div className="recorded-answer-section">
          <video
            className="recorded-video"
            src={recording.videoUrl}
            controls
            playsInline
          />

          <div className="recording-information">
            <span>Video size:{" "}{formatFileSize(recording.sizeBytes)} </span>
            <span>Duration:{" "}{formatSeconds(recording.durationSeconds|| 0)}</span>
            {recording.audioSizeBytes && (
                <span>Extracted audio:{" "}{formatFileSize(recording.audioSizeBytes)}</span>
              )}
          </div>

          <div className="recorder-actions">
            <a className="download-video-button"
              href={recording.videoUrl}
              download={recording.fileName}
            >Download Original Video</a>

            <button
              type="button"
              className="secondary-button"
              onClick={retakeRecording}
              disabled={
                recording.isProcessing
              }
            >Retake</button>

            {!recording.isProcessed && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={processRecording}
                  disabled={recording.isProcessing}
                >{recording.isProcessing? "Processing Answer..." : "Save and Transcribe"}</button>
              )}
          </div>

          {recording.isProcessing && (
            <div className="processing-message">
              <span className="processing-spinner" />Extracting compressed audio and sending it to Groq..
            </div>
          )}

          {recording.isProcessed && (
            <div className="transcript-panel">
              <p className="transcript-label">Answer transcript</p>
              <p className="transcript-text">{recording.transcript}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="video-error" role="alert">{error}</p>
      )}
    </section>
  );
}

export default VideoRecorder;
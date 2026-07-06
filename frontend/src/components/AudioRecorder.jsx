import {useEffect,useRef,useState} from "react";
import "./AudioRecorder.css";

function getSupportedMimeType() {
  if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) {
    return "";
  }

  const possibleAudioTypes = ["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/ogg","audio/mp4"];

  const supportedAudioType =possibleAudioTypes.find((audioType) => {
        return MediaRecorder.isTypeSupported(audioType);
      }
    );

  return supportedAudioType || "";
}

function getAudioExtension(mimeType) {
  if (mimeType.includes("ogg")) {return "ogg";}
  if (mimeType.includes("mp4")) {return "m4a";}
  return "webm";
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function AudioRecorder({existingAnswer,onRecordingReady,onDeleteRecording,onRecordingStateChange}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds,setRecordingSeconds] = useState(0);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingStartedAtRef = useRef(null);

  function stopTimer() {
    if (!timerRef.current) {
      return;
    }

    clearInterval(timerRef.current);
    timerRef.current = null;
  }


  function stopMicrophone() {
    if (!mediaStreamRef.current) {
      return;
    }

    mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
    });

    mediaStreamRef.current = null;
  }


  function updateRecordingState(recordingState) {
    setIsRecording(recordingState);

    if (onRecordingStateChange) {
      onRecordingStateChange(recordingState);
    }
  }

  function startTimer() {

    recordingStartedAtRef.current =Date.now();
    setRecordingSeconds(0);

    timerRef.current = setInterval(
      () => {
        const elapsedMilliseconds = Date.now() - recordingStartedAtRef.current;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        setRecordingSeconds(elapsedSeconds);
      },250);
  }

  function handleAudioData(event) {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  }

  function handleRecordingStopped() {
    stopTimer();
    stopMicrophone();
    updateRecordingState(false);

    const recorder = mediaRecorderRef.current;

    const finalMimeType = recorder?.mimeType || "audio/webm";

    const audioBlob = new Blob(
        audioChunksRef.current,
      {
        type: finalMimeType
      }
    );

    audioChunksRef.current = [];

    if (audioBlob.size === 0) {
      setError("No audio was recorded. Please try again.");
      return;
    }

    const elapsedMilliseconds =recordingStartedAtRef.current? Date.now() -recordingStartedAtRef.current: 0;

    const finalDuration = Math.max(1,Math.round(elapsedMilliseconds / 1000));

    const audioUrl = URL.createObjectURL(audioBlob);

    const extension = getAudioExtension(finalMimeType);

    const recordingData = {
      blob: audioBlob,
      audioUrl,
      mimeType: finalMimeType,
      duration: finalDuration,
      extension
    };

    onRecordingReady(recordingData);
  }


  function handleRecordingError(recordingError) {
    stopTimer();
    stopMicrophone();
    updateRecordingState(false);

    if (recordingError.name ==="NotAllowedError") {
      setError("Microphone permission was denied. Allow microphone access and try again.");
      return;
    }

    if (recordingError.name ==="NotFoundError") {
      setError("No microphone was found on this device.");
      return;
    }

    if (recordingError.name === "NotReadableError") {
      setError("The microphone is being used by another application.");
      return;
    }

    setError("The audio recording could not be started.");
  }

  async function startRecording() {
    try {
      setError("");

       if ( !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        setError("Audio recording is not supported in this browser.");
        return;
      }

      const microphoneStream = await navigator.mediaDevices.getUserMedia({audio: true});

      mediaStreamRef.current = microphoneStream;
      audioChunksRef.current = [];
      const supportedMimeType =getSupportedMimeType();

      const recorder =supportedMimeType? new MediaRecorder(microphoneStream,{mimeType:supportedMimeType}): new MediaRecorder(microphoneStream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable =handleAudioData;

      recorder.onstop = handleRecordingStopped;

      updateRecordingState(true);
      startTimer();

      recorder.start(250);
    }

    catch (recordingError) {
        handleRecordingError(recordingError);
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder ||recorder.state === "inactive") {
      return;
    }

    recorder.stop();
  }

  useEffect(() => {
    return () => {
      stopTimer();

      const recorder = mediaRecorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.stop();
      }
      stopMicrophone();
    };
  }, []);

  return (
    <section className="audio-recorder">
      <div className="audio-recorder-heading">
        <div>
          <p className="audio-recorder-label">Your answer</p>
          <h3>Record your response</h3>
        </div>

        {isRecording && (
          <div className="recording-status">
            <span className="recording-dot" />
            <span>Recording</span>
          </div>
        )}
      </div>

      {error && (
        <p className="recording-error">{error}</p>
      )}

      {isRecording && (
        <div className="active-recording">
          <p>Speak clearly into your microphone.</p>
          <strong className="recording-time">{formatDuration(recordingSeconds)}</strong>
        </div>
      )}

      {!isRecording &&
        existingAnswer && (
          <div className="audio-preview">
            <p>Your answer has been recorded.</p>
            <audio controls src={ existingAnswer.audioUrl }/>

            <span className="audio-duration">
              Duration:{" "}{formatDuration(existingAnswer.duration)}
            </span>
          </div>
        )}


      {!isRecording &&
        !existingAnswer && (
          <div className="empty-recording">
            <p>
              Click Start Recording and
              answer the interview
              question.
            </p>
          </div>
        )}


      <div className="recorder-actions">
        {!isRecording &&
          !existingAnswer && (
            <button
              type="button"
              className="record-button"
              onClick={startRecording}
            >
              Start Recording
            </button>
          )}


        {isRecording && (
          <button
            type="button"
            className="stop-button"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        )}


        {!isRecording &&
          existingAnswer && (
            <>
              <button
                type="button"
                className="record-button"
                onClick={startRecording}
              >
                Record Again
              </button>

              <button
                type="button"
                className="delete-recording-button"
                onClick={onDeleteRecording}
              >
                Delete Answer
              </button>
            </>
          )}
      </div>
    </section>
  );
}


export default AudioRecorder;
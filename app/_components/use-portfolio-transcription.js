"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_RECORDING_MS = 60_000;
const MIME_TYPE_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/webm"
];

function getErrorMessage(error, fallback) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function getSupportedMimeType() {
  return MIME_TYPE_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

function getFileExtension(mimeType) {
  return mimeType.includes("mp4") ? "m4a" : "webm";
}

async function parseJsonResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || "The recording could not be transcribed.");
  }

  return payload;
}

export function usePortfolioTranscription({ onTranscript }) {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const cancelRequestedRef = useRef(false);
  const recordingTimeoutRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);
  const mountedRef = useRef(true);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const clearRecordingTimeout = useCallback(() => {
    if (recordingTimeoutRef.current) {
      window.clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  }, []);

  const releaseMicrophone = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const transcribe = useCallback(async (blob) => {
    if (!blob.size) {
      throw new Error("No speech was recorded. Please try again.");
    }

    const mimeType = blob.type || "audio/webm";
    const formData = new FormData();
    formData.append(
      "audio",
      blob,
      `portfolio-recording.${getFileExtension(mimeType)}`
    );

    const response = await fetch("/api/assistant/transcribe", {
      method: "POST",
      body: formData
    });
    const payload = await parseJsonResponse(response);
    const text = typeof payload.text === "string" ? payload.text.trim() : "";

    if (!text) {
      throw new Error("I could not hear any speech. Please try again.");
    }

    onTranscriptRef.current?.(text);
  }, []);

  const handleRecorderStopped = useCallback(
    async (mimeType) => {
      clearRecordingTimeout();
      releaseMicrophone();

      if (cancelRequestedRef.current) {
        cancelRequestedRef.current = false;
        chunksRef.current = [];
        if (mountedRef.current) setStatus("idle");
        return;
      }

      const blob = new Blob(chunksRef.current, { type: mimeType });
      chunksRef.current = [];
      if (mountedRef.current) setStatus("transcribing");

      try {
        await transcribe(blob);
        if (mountedRef.current) setError(null);
      } catch (transcriptionError) {
        if (mountedRef.current) {
          setError(
            getErrorMessage(
              transcriptionError,
              "The recording could not be transcribed."
            )
          );
        }
      } finally {
        if (mountedRef.current) setStatus("idle");
      }
    },
    [clearRecordingTimeout, releaseMicrophone, transcribe]
  );

  const stop = useCallback(() => {
    clearRecordingTimeout();
    const recorder = recorderRef.current;

    if (recorder?.state === "recording") {
      recorder.stop();
    }
  }, [clearRecordingTimeout]);

  const cancel = useCallback(() => {
    cancelRequestedRef.current = true;
    clearRecordingTimeout();
    const recorder = recorderRef.current;

    if (recorder?.state === "recording") {
      recorder.stop();
      return;
    }

    releaseMicrophone();
    chunksRef.current = [];
    if (mountedRef.current) setStatus("idle");
  }, [clearRecordingTimeout, releaseMicrophone]);

  const start = useCallback(async () => {
    if (status !== "idle") return;

    setError(null);

    if (
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError("Voice transcription is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      cancelRequestedRef.current = false;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      });
      recorder.addEventListener(
        "stop",
        () => void handleRecorderStopped(recorder.mimeType || mimeType || "audio/webm"),
        { once: true }
      );
      recorder.start(250);
      setStatus("recording");
      recordingTimeoutRef.current = window.setTimeout(stop, MAX_RECORDING_MS);
    } catch (recordingError) {
      releaseMicrophone();
      setStatus("idle");
      setError(
        getErrorMessage(recordingError, "Microphone access could not be started.")
      );
    }
  }, [handleRecorderStopped, releaseMicrophone, status, stop]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cancel();
    };
  }, [cancel]);

  return {
    cancel,
    clearError: () => setError(null),
    error,
    start,
    status,
    stop
  };
}

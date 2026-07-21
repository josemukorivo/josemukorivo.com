"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";
const FALLBACK_MAX_SESSION_SECONDS = 3 * 60;
const IDLE_TIMEOUT_MS = 60_000;
const ACTIVITY_EVENTS = new Set([
  "conversation.item.created",
  "conversation.item.input_audio_transcription.delta",
  "conversation.item.input_audio_transcription.completed",
  "input_audio_buffer.speech_started",
  "input_audio_buffer.speech_stopped",
  "response.created",
  "response.done",
  "response.output_audio.delta",
  "response.output_audio.done",
  "response.output_audio_transcript.delta",
  "response.output_audio_transcript.done"
]);

function browserSupportsRealtime() {
  return (
    typeof window !== "undefined" &&
    typeof RTCPeerConnection !== "undefined" &&
    "mediaDevices" in navigator &&
    "getUserMedia" in navigator.mediaDevices
  );
}

function getErrorMessage(error, fallback) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}

function createTextMessage(id, role, text) {
  return {
    id,
    role,
    source: "voice",
    parts: [{ type: "text", text }]
  };
}

function createToolMessage(callId, name, output) {
  return {
    id: `voice-tool-${callId}`,
    role: "assistant",
    source: "voice",
    parts: [
      {
        type: `tool-${name}`,
        state: "output-available",
        output
      }
    ]
  };
}

async function parseJsonResponse(response, fallback) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || fallback);
  }

  return payload;
}

export function usePortfolioRealtimeVoice({
  currentPath,
  conversationMessages,
  onToolOutput
}) {
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const handledFunctionCallsRef = useRef(new Set());
  const idleTimeoutRef = useRef(null);
  const sessionTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const sessionEndsAtRef = useRef(null);
  const onToolOutputRef = useRef(onToolOutput);
  const conversationMessagesRef = useRef(conversationMessages);
  const [status, setStatus] = useState("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  useEffect(() => {
    onToolOutputRef.current = onToolOutput;
  }, [onToolOutput]);

  useEffect(() => {
    conversationMessagesRef.current = conversationMessages;
  }, [conversationMessages]);

  const clearIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) {
      window.clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  }, []);

  const clearSessionTimers = useCallback(() => {
    if (sessionTimeoutRef.current) {
      window.clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    sessionEndsAtRef.current = null;
    setRemainingSeconds(null);
  }, []);

  const closeConnection = useCallback(() => {
    clearIdleTimer();
    clearSessionTimers();
    setIsSpeaking(false);

    dataChannelRef.current?.close();
    dataChannelRef.current = null;
    handledFunctionCallsRef.current.clear();

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }
  }, [clearIdleTimer, clearSessionTimers]);

  const disconnect = useCallback(() => {
    setStatus((currentStatus) => {
      if (currentStatus === "idle") {
        return currentStatus;
      }
      return "disconnecting";
    });
    closeConnection();
    setStatus("idle");
  }, [closeConnection]);

  const resetIdleTimer = useCallback(() => {
    clearIdleTimer();
    idleTimeoutRef.current = window.setTimeout(() => {
      closeConnection();
      setStatus("idle");
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer, closeConnection]);

  const startSessionTimer = useCallback(
    (maxSessionSeconds) => {
      clearSessionTimers();
      const seconds =
        Number.isFinite(maxSessionSeconds) && maxSessionSeconds > 0
          ? maxSessionSeconds
          : FALLBACK_MAX_SESSION_SECONDS;
      sessionEndsAtRef.current = Date.now() + seconds * 1000;
      setRemainingSeconds(seconds);

      countdownIntervalRef.current = window.setInterval(() => {
        const endsAt = sessionEndsAtRef.current;
        if (!endsAt) return;
        setRemainingSeconds(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
      }, 1000);

      sessionTimeoutRef.current = window.setTimeout(() => {
        closeConnection();
        setStatus("idle");
      }, seconds * 1000);
    },
    [clearSessionTimers, closeConnection]
  );

  const upsertTextMessage = useCallback((id, role, text) => {
    if (!text) return;

    setMessages((currentMessages) => {
      const existingIndex = currentMessages.findIndex(
        (message) => message.id === id
      );

      if (existingIndex === -1) {
        return [...currentMessages, createTextMessage(id, role, text)];
      }

      return currentMessages.map((message, index) =>
        index === existingIndex
          ? createTextMessage(id, role, text)
          : message
      );
    });
  }, []);

  const appendTextDelta = useCallback((id, role, delta) => {
    if (!delta) return;

    setMessages((currentMessages) => {
      const existingIndex = currentMessages.findIndex(
        (message) => message.id === id
      );

      if (existingIndex === -1) {
        return [...currentMessages, createTextMessage(id, role, delta)];
      }

      return currentMessages.map((message, index) => {
        if (index !== existingIndex) return message;
        const currentText = message.parts.find(
          (part) => part.type === "text"
        )?.text;
        return createTextMessage(id, role, `${currentText || ""}${delta}`);
      });
    });
  }, []);

  const runTool = useCallback(
    async (functionCall) => {
      const callId = functionCall.call_id;
      const name = functionCall.name;

      if (!callId || !name || handledFunctionCallsRef.current.has(callId)) {
        return;
      }

      handledFunctionCallsRef.current.add(callId);
      resetIdleTimer();

      let toolArguments = {};
      if (functionCall.arguments?.trim()) {
        try {
          toolArguments = JSON.parse(functionCall.arguments);
        } catch {
          toolArguments = {};
        }
      }

      let output;

      try {
        const response = await fetch("/api/assistant/realtime/tool", {
          method: "POST",
          body: JSON.stringify({ arguments: toolArguments, name }),
          headers: { "Content-Type": "application/json" }
        });
        const payload = await parseJsonResponse(
          response,
          "The assistant action could not be completed."
        );
        output = payload.output;
      } catch (toolError) {
        output = {
          error: getErrorMessage(
            toolError,
            "The assistant action could not be completed."
          )
        };
      }

      if (output?.kind !== "conversation-end") {
        setMessages((currentMessages) => [
          ...currentMessages,
          createToolMessage(callId, name, output)
        ]);
      }
      onToolOutputRef.current?.({ name, output });

      const dataChannel = dataChannelRef.current;
      if (!dataChannel || dataChannel.readyState !== "open") {
        return;
      }

      dataChannel.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify(output)
          }
        })
      );

      if (name === "endConversation") {
        closeConnection();
        setStatus("idle");
        return;
      }

      dataChannel.send(JSON.stringify({ type: "response.create" }));
      resetIdleTimer();
    },
    [closeConnection, resetIdleTimer]
  );

  const handleFunctionCalls = useCallback(
    (event) => {
      const functionCalls =
        event.response?.output?.filter(
          (output) => output.type === "function_call"
        ) || [];

      for (const functionCall of functionCalls) {
        void runTool(functionCall);
      }
    },
    [runTool]
  );

  const handleRealtimeEvent = useCallback(
    (rawEvent) => {
      let event;

      try {
        event = JSON.parse(rawEvent);
      } catch {
        return;
      }

      if (event.type && ACTIVITY_EVENTS.has(event.type)) {
        resetIdleTimer();
      }

      switch (event.type) {
        case "conversation.item.input_audio_transcription.delta":
          appendTextDelta(
            `voice-user-${event.item_id}`,
            "user",
            event.delta
          );
          break;
        case "conversation.item.input_audio_transcription.completed":
          upsertTextMessage(
            `voice-user-${event.item_id}`,
            "user",
            event.transcript
          );
          break;
        case "response.output_audio.delta":
        case "response.audio.delta":
          setIsSpeaking(true);
          break;
        case "response.output_audio_transcript.delta":
        case "response.audio_transcript.delta":
          setIsSpeaking(true);
          appendTextDelta(
            `voice-assistant-${event.item_id || event.response_id}`,
            "assistant",
            event.delta
          );
          break;
        case "response.output_audio_transcript.done":
        case "response.audio_transcript.done":
          upsertTextMessage(
            `voice-assistant-${event.item_id || event.response_id}`,
            "assistant",
            event.transcript
          );
          break;
        case "response.output_audio.done":
        case "response.audio.done":
          setIsSpeaking(false);
          break;
        case "response.done":
          setIsSpeaking(false);
          handleFunctionCalls(event);
          break;
        case "error":
          setError(event.error?.message || "The voice session encountered an error.");
          break;
        default:
          break;
      }
    },
    [
      appendTextDelta,
      handleFunctionCalls,
      resetIdleTimer,
      upsertTextMessage
    ]
  );

  const createSession = useCallback(async () => {
    const response = await fetch("/api/assistant/realtime/session", {
      method: "POST",
      body: JSON.stringify({
        currentPath,
        messages: [
          ...conversationMessagesRef.current,
          ...messages
        ].slice(-24)
      }),
      headers: { "Content-Type": "application/json" }
    });

    return parseJsonResponse(response, "Failed to create voice session.");
  }, [currentPath, messages]);

  const connect = useCallback(async () => {
    if (status !== "idle") return;

    setError(null);
    if (!browserSupportsRealtime()) {
      setError("Live voice is not supported in this browser.");
      return;
    }

    setStatus("connecting");

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      localStreamRef.current = localStream;

      const session = await createSession();
      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      const remoteAudio = document.createElement("audio");
      remoteAudio.autoplay = true;
      remoteAudio.setAttribute("playsinline", "true");
      remoteAudioRef.current = remoteAudio;

      peerConnection.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0] || null;
      };
      peerConnection.onconnectionstatechange = () => {
        if (
          peerConnection.connectionState === "failed" ||
          peerConnection.connectionState === "closed"
        ) {
          closeConnection();
          setStatus("idle");
        }
      };

      for (const track of localStream.getAudioTracks()) {
        peerConnection.addTrack(track, localStream);
      }

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;
      dataChannel.onmessage = (event) => {
        if (typeof event.data === "string") {
          handleRealtimeEvent(event.data);
        }
      };
      dataChannel.onopen = () => {
        setStatus("connected");
        startSessionTimer(session.maxSessionSeconds);
        resetIdleTimer();
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const answerResponse = await fetch(REALTIME_CALLS_URL, {
        method: "POST",
        body: offer.sdp || "",
        headers: {
          Authorization: `Bearer ${session.clientSecret}`,
          "Content-Type": "application/sdp"
        }
      });

      if (!answerResponse.ok) {
        throw new Error("Failed to connect the voice session.");
      }

      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: await answerResponse.text()
      });
    } catch (connectError) {
      closeConnection();
      setStatus("idle");
      setError(
        getErrorMessage(connectError, "Failed to start the voice session.")
      );
    }
  }, [
    closeConnection,
    createSession,
    handleRealtimeEvent,
    resetIdleTimer,
    startSessionTimer,
    status
  ]);

  const retryResponse = useCallback((messageId) => {
    const dataChannel = dataChannelRef.current;
    if (!dataChannel || dataChannel.readyState !== "open") return;

    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== messageId)
    );
    dataChannel.send(
      JSON.stringify({
        type: "response.create",
        response: {
          instructions:
            "Repeat your previous answer clearly and concisely. Preserve the facts and any necessary tool use."
        }
      })
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  useEffect(() => closeConnection, [closeConnection]);

  return {
    clearMessages,
    connect,
    disconnect,
    error,
    isListening: status === "connected" && !isSpeaking,
    isSpeaking,
    messages,
    remainingSeconds,
    retryResponse,
    status
  };
}

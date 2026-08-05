"use client";

import { useState, useRef, useEffect } from "react";
import { Square, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceIncidentReporterProps {
  onTranscript: (text: string) => void;
}

export function VoiceIncidentReporter({ onTranscript }: VoiceIncidentReporterProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    setStatusMessage(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setStatusMessage("Mikrofon erişimi engellendi veya desteklenmiyor.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setStatusMessage("Ses çözümleniyor (ASR)...");

    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const response = await fetch("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transkript API hatası");
      }

      const data = await response.json();
      if (data.transcript) {
        onTranscript(data.transcript);
        setStatusMessage("Transkript açıklamaya eklendi.");
      } else {
        setStatusMessage("Ses metne dönüştürülemedi.");
      }
    } catch (err) {
      console.error("Transkript gönderme hatası:", err);
      setStatusMessage("Transkript servisi yanıt vermedi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border-border bg-bg-surface flex flex-col gap-2 rounded-lg border p-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="text-fg-primary flex items-center gap-2 font-medium">
          <Volume2 className="text-brand-400 h-4 w-4" />
          <span>Sesli İhbar (Qwen Omni ASR)</span>
        </div>

        {isRecording && (
          <div className="flex animate-pulse items-center gap-2 font-mono text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startRecording}
            disabled={isProcessing}
            className="flex items-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex h-3 w-3 rounded-full bg-red-500" />
            )}
            <span>{isProcessing ? "İşleniyor..." : "Ses Kaydı Başlat"}</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={stopRecording}
            className="border-fg-muted text-fg-primary hover:bg-bg-elevated flex items-center gap-2"
          >
            <Square className="h-3 w-3 fill-red-500 text-red-500" />
            <span>Kaydı Durdur</span>
          </Button>
        )}

        {statusMessage && (
          <span className="text-fg-muted max-w-[240px] truncate text-xs">{statusMessage}</span>
        )}
      </div>
    </div>
  );
}

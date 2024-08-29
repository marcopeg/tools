import { useEffect, useState } from "react";

// Type definitions for the props and hook state
interface UseSpeechSynthesisProps {
  onEnd?: () => void;
}

interface SpeakArgs {
  voice?: SpeechSynthesisVoice | null;
  text?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseSpeechSynthesisResult {
  supported: boolean;
  speak: (args?: SpeakArgs) => void;
  speaking: boolean;
  cancel: () => void;
  voices: SpeechSynthesisVoice[];
  getVoices: () => SpeechSynthesisVoice[];
}

export const useSpeechSynthesis = (
  props: UseSpeechSynthesisProps = {}
): UseSpeechSynthesisResult => {
  const { onEnd = () => {} } = props;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);

  const processVoices = (voiceOptions: SpeechSynthesisVoice[]) => {
    setVoices(voiceOptions);
  };

  const getVoices = (): SpeechSynthesisVoice[] => {
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      processVoices(voiceOptions);
      return voiceOptions;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voiceOptions = window.speechSynthesis.getVoices();
      processVoices(voiceOptions);
    };

    return voiceOptions;
  };

  const handleEnd = () => {
    setSpeaking(false);
    onEnd();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setTimeout(getVoices, 0); // Fix to get voices on computer
    }
  }, []);

  const speak = (args: SpeakArgs = {}) => {
    const { voice = null, text = "", rate = 1, pitch = 1, volume = 1 } = args;

    try {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.onend = handleEnd;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    }
  };

  const cancel = () => {
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } catch (error) {
      console.error("Speech synthesis cancel failed:", error);
    }
  };

  return {
    supported: typeof window !== "undefined" && !!window.speechSynthesis,
    speak,
    speaking,
    cancel,
    voices,
    getVoices,
  };
};

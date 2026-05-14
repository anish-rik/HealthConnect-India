import { Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

interface VoiceButtonProps {
  startLabel: string;
  stopLabel: string;
}

export function VoiceButton({ startLabel, stopLabel }: VoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Get appropriate speech settings for different languages
  // Indian languages need slower rates due to complex pronunciation patterns
  const getSpeechSettings = (lang: string) => {
    const slowerLanguages = ['hi', 'kn', 'bn', 'ta', 'te', 'ml'];
    const baseLang = lang.split('-')[0];
    
    if (slowerLanguages.includes(baseLang)) {
      return {
        rate: 0.8,    // 20% slower for better comprehension of complex scripts
        volume: 0.9,  // Slightly lower volume for clearer articulation
        pitch: 1.1    // Higher pitch helps with phonetic clarity
      };
    }
    return {
      rate: 1.0,     // Normal speed for English
      volume: 1.0,   // Full volume
      pitch: 1.0     // Normal pitch
    };
  };

  const handleVoiceToggle = () => {
    if (!speechSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Get the main content to read - prioritize important sections
      const heroTitle = document.querySelector("h1")?.textContent || "";
      const heroSubtitle = document.querySelector("main p")?.textContent || "";
      const howHeading = document.querySelector("#how h2")?.textContent || "";
      const featuresHeading = document.querySelector("#features h2")?.textContent || "";

      const textToRead = [
        heroTitle,
        heroSubtitle,
        "How it works: " + howHeading,
        "Features: " + featuresHeading,
        "HealthConnect India helps you access your health records easily."
      ].join(". ").slice(0, 1500);

      const utterance = new SpeechSynthesisUtterance(textToRead);
      const currentLang = document.documentElement.lang || "en-IN";
      utterance.lang = currentLang;
      
      const settings = getSpeechSettings(currentLang);
      utterance.rate = settings.rate;
      utterance.volume = settings.volume;
      utterance.pitch = settings.pitch;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  if (!speechSupported) return null;

  return (
    <button
      onClick={handleVoiceToggle}
      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={isSpeaking ? stopLabel : startLabel}
    >
      {isSpeaking ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
      <span className="sr-only">
        {isSpeaking ? stopLabel : startLabel}
      </span>
    </button>
  );
}
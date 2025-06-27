"use client";

import React, { useState, useEffect, useRef } from "react";
import { Settings, X, Volume2, Clock, Shuffle } from "lucide-react";
import { FlashcardSettings } from "@/types";

interface FlashcardSettingsPanelProps {
  settings: FlashcardSettings;
  onSettingsChange: (settings: Partial<FlashcardSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FlashcardSettingsPanel({
  settings,
  onSettingsChange,
  isOpen,
  onClose,
}: FlashcardSettingsPanelProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      setVoices(availableVoices);
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Handle escape key and outside clicks
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-screen overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Flashcard Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Auto-play Settings */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Auto-play
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Enable Auto-play
                </label>
                <button
                  onClick={() =>
                    onSettingsChange({ autoPlay: !settings.autoPlay })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoPlay
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoPlay ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Auto-play Delay: {settings.autoPlayDelay / 1000}s
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={settings.autoPlayDelay}
                  onChange={(e) =>
                    onSettingsChange({
                      autoPlayDelay: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(139, 92, 246) ${
                      ((settings.autoPlayDelay - 1000) / 9000) * 100
                    }%, rgba(255,255,255,0.2) ${
                      ((settings.autoPlayDelay - 1000) / 9000) * 100
                    }%)`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Shuffle Settings */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Shuffle className="w-5 h-5 mr-2" />
              Card Order
            </h3>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                Shuffle Cards
              </label>
              <button
                onClick={() => onSettingsChange({ shuffle: !settings.shuffle })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.shuffle
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.shuffle ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Text-to-Speech Settings */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Text-to-Speech
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Enable TTS
                </label>
                <button
                  onClick={() =>
                    onSettingsChange({ ttsEnabled: !settings.ttsEnabled })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.ttsEnabled
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.ttsEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {settings.ttsEnabled && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Voice
                    </label>
                    <select
                      value={settings.ttsVoice || ""}
                      onChange={(e) =>
                        onSettingsChange({
                          ttsVoice: e.target.value || undefined,
                        })
                      }
                      className="w-full p-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    >
                      <option value="" className="bg-slate-800">
                        Default Voice
                      </option>
                      {voices.map((voice, index) => (
                        <option
                          key={index}
                          value={voice.name}
                          className="bg-slate-800"
                        >
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Speech Rate: {settings.ttsRate}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.ttsRate}
                      onChange={(e) =>
                        onSettingsChange({
                          ttsRate: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(139, 92, 246) ${
                          ((settings.ttsRate - 0.5) / 1.5) * 100
                        }%, rgba(255,255,255,0.2) ${
                          ((settings.ttsRate - 0.5) / 1.5) * 100
                        }%)`,
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Volume: {Math.round(settings.ttsVolume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.ttsVolume}
                      onChange={(e) =>
                        onSettingsChange({
                          ttsVolume: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(139, 92, 246) ${
                          settings.ttsVolume * 100
                        }%, rgba(255,255,255,0.2) ${
                          settings.ttsVolume * 100
                        }%)`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Other Settings */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4">Display</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Show Progress
                </label>
                <button
                  onClick={() =>
                    onSettingsChange({ showProgress: !settings.showProgress })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showProgress
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showProgress ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Show Hints
                </label>
                <button
                  onClick={() =>
                    onSettingsChange({ showHints: !settings.showHints })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showHints
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showHints ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

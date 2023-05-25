import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import React, { useState, useEffect } from 'react';

const Sequencer: React.FC = () => {
  const [channelStates, setChannelStates] = useState<Map<number, boolean[]>>(new Map());
  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const [tempo, setTempo] = useState<number>(120);

  useEffect(() => {
    const initialChannelStates = new Map<number, boolean[]>();
    initialChannelStates.set(0, Array<boolean>(16).fill(false));
    initialChannelStates.set(1, Array<boolean>(16).fill(false));
    initialChannelStates.set(2, Array<boolean>(16).fill(false));
    initialChannelStates.set(3, Array<boolean>(16).fill(false));
    setChannelStates(initialChannelStates);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentColumn((prevColumn) => (prevColumn + 1) % 16);
      }, calculateColumnDuration());
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, tempo]);

  const handleStepClick = (channelIndex: number, stepIndex: number) => {
    const updatedChannelStates = new Map(channelStates);
    const channelSteps = updatedChannelStates.get(channelIndex) || [];
    channelSteps[stepIndex] = !channelSteps[stepIndex];
    updatedChannelStates.set(channelIndex, channelSteps);
    setChannelStates(updatedChannelStates);
  };

  const handlePlayButtonClick = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const calculateColumnDuration = () => {
    // Convert tempo (BPM) to milliseconds per column
    const millisecondsPerBeat = 60000 / tempo;
    const columnsPerBeat = 4;
    const millisecondsPerColumn = millisecondsPerBeat / columnsPerBeat;
    return millisecondsPerColumn;
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(event.target.value);
    setTempo(newTempo);
  };

  const handleTempoDoubleClick = () => {
    setTempo(120);
  };

  const handleStepMouseDown = (channelIndex: number, stepIndex: number) => {
    setMouseIsDown(true);
    handleStepClick(channelIndex, stepIndex);
  };

  const handleStepMouseEnter = (channelIndex: number, stepIndex: number) => {
    if (mouseIsDown) {
      handleStepClick(channelIndex, stepIndex);
    }
  };

  const handleMouseUp = () => {
    setMouseIsDown(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="sequencer">
      <div className="controls">
        <button className="play-button" onClick={handlePlayButtonClick}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <input
          className="tempo-knob"
          type="range"
          min={20}
          max={200}
          value={tempo}
          onChange={handleTempoChange}
          onDoubleClick={handleTempoDoubleClick}
        />
        <span className="tempo-label">{tempo} BPM</span>
      </div>
      <div className="sequencer-grid">
        {Array.from(channelStates.entries()).map(([channelIndex, steps]) => (
          <div key={channelIndex} className="channel">
            {steps.map((step, stepIndex) => (
              <React.Fragment key={stepIndex}>
                {stepIndex !== 0 && stepIndex % 4 === 0 && (
                  <div className="column-separator">
                    <div className="separator-line" />
                  </div>
                )}
                <button
                  className={`step ${step ? 'active' : ''} ${currentColumn === stepIndex ? 'playing' : ''}`}
                  onClick={() => handleStepClick(channelIndex, stepIndex)}
                ></button>
              </React.Fragment>
            ))}
          </div>
        ))}
        <div className="column-indicator-wrapper">
          {Array.from({ length: 16 }).map((_, stepIndex) => (
            <div
              key={stepIndex}
              className={`column-indicator ${currentColumn === stepIndex ? 'playing' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sequencer;

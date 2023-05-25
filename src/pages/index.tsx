import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import React, { useState, useEffect } from 'react';

const Sequencer: React.FC = () => {
  const [channelStates, setChannelStates] = useState<Map<number, boolean[]>>(new Map());

  const handleStepClick = (channelIndex: number, stepIndex: number) => {
    const updatedChannelStates = new Map(channelStates);
    const channelSteps = updatedChannelStates.get(channelIndex) || [];
    channelSteps[stepIndex] = !channelSteps[stepIndex];
    updatedChannelStates.set(channelIndex, channelSteps);
    setChannelStates(updatedChannelStates);
  };

  const [mouseIsDown, setMouseIsDown] = useState<boolean>(false);

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

  useEffect(() => {
    // Initialize the channel states
    const initialChannelStates = new Map<number, boolean[]>();
    initialChannelStates.set(0, Array<boolean>(16).fill(false));
    initialChannelStates.set(1, Array<boolean>(16).fill(false));
    initialChannelStates.set(2, Array<boolean>(16).fill(false));
    initialChannelStates.set(3, Array<boolean>(16).fill(false));
    setChannelStates(initialChannelStates);
  }, []);

  return (
    <div className="sequencer">
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
              className={`step ${step ? 'active' : ''}`}
              onMouseDown={() => handleStepMouseDown(channelIndex, stepIndex)}
              onMouseEnter={() => handleStepMouseEnter(channelIndex, stepIndex)}
            ></button>
          </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sequencer;

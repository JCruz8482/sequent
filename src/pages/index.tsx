import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from 'react';

import { api } from "~/utils/api";

const Sequencer: React.FC = () => {
  const [steps, setSteps] = useState<boolean[][]>([
    Array(16).fill(false),
    Array(16).fill(false),
    Array(16).fill(false),
    Array(16).fill(false),
  ]);

  const handleClick = (channel: number, stepIndex: number) => {
    const updatedSteps = [...steps];
    if (!updatedSteps[channel]) {
      updatedSteps[channel] = [];
    }
    updatedSteps[channel][stepIndex] = !updatedSteps[channel][stepIndex];
    setSteps(updatedSteps);
  };

  return (
    <div className="sequencer">
      {steps.map((channel, channelIndex) => (
        <div className="channel" key={channelIndex}>
          {channel.map((step, stepIndex) => (
            <React.Fragment key={stepIndex}>
            {stepIndex !== 0 && stepIndex % 4 === 0 && (
              <div className="column-separator">
                <div className="separator-line" />
              </div>
              // <div className="vertical-line"></div>
            )}
            <button
              className={`step ${step ? 'active' : ''}`}
              onClick={() => handleClick(channelIndex, stepIndex)}
            />
          </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="app">
      <Sequencer />
    </div>
  );
};

export default App;

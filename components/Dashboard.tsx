
import React from 'react';
import { AppProps } from '../types';
import BreakTracker from './BreakTracker';
import AuxTracker from './AuxTracker';

const Dashboard: React.FC<AppProps> = ({ showModal }) => {
  return (
    <div className="space-y-8">
      <BreakTracker showModal={showModal} />
      <hr className="my-6 border-slate-200" />
      <AuxTracker />
    </div>
  );
};

export default Dashboard;

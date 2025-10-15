import React from 'react';

export interface LogEntry {
  id: string;
  dateTime: string;
  nameOfCaller: string;
  callerType: string;
  verified: boolean;
  callDriver: string;
  unitNumber: string;
  storeLocation: string;
  callbackNumber: string;
  notes: string;
  vacateDate?: string;
  balance?: string;
  promiseToPayDate?: string;
  rentIncreases?: RentIncreaseEntry[];
  unitTransfers?: UnitTransferEntry[];
}

export interface RentIncreaseEntry {
  id: string;
  unitNumber: string;
  prevRate: string;
  newRate: string;
}

export interface UnitTransferEntry {
  id: string;
  currentUnit: string;
  newUnit: string;
}

export interface ModalInfo {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
}

export interface AppProps {
  showModal: (title: string, content: React.ReactNode) => void;
}
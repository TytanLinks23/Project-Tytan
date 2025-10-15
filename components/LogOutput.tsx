import React from 'react';
import { LogEntry } from '../types';

interface LogOutputProps {
  entries: LogEntry[];
}

const LogOutput: React.FC<LogOutputProps> = ({ entries }) => {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold text-slate-700 mb-2">Call Log Output (Latest First)</h3>
      <div className="w-full h-64 p-3 bg-slate-50 border border-slate-300 rounded-md overflow-y-auto font-mono text-sm">
        {entries.length === 0 ? (
          <p className="text-slate-500">No entries yet.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="mb-4 pb-4 border-b border-slate-200 last:border-b-0 last:mb-0">
              <p><strong>Date/Time:</strong> {entry.dateTime}</p>
              <p><strong>Name of Caller:</strong> {entry.nameOfCaller}</p>
              <p><strong>Caller Type:</strong> {entry.callerType}</p>
              <p><strong>Verified:</strong> {entry.verified ? 'Yes' : 'No'}</p>
              <p><strong>Call Driver:</strong> {entry.callDriver}</p>
              <p><strong>Unit Number:</strong> {entry.unitNumber}</p>
              <p><strong>Store Location:</strong> {entry.storeLocation}</p>
              <p><strong>Callback Number:</strong> {entry.callbackNumber}</p>
              {entry.vacateDate && <p><strong>Vacate Date:</strong> {entry.vacateDate}</p>}
              {entry.promiseToPayDate && <p><strong>Promise to Pay Date:</strong> {entry.promiseToPayDate}</p>}
              {entry.balance && <p><strong>Balance:</strong> {entry.balance}</p>}
              {entry.rentIncreases && entry.rentIncreases.length > 0 && (
                <div>
                  <strong>Rent Increases:</strong>
                  <ul className="list-disc pl-5">
                    {entry.rentIncreases.map(ri => (
                      <li key={ri.id}>Unit {ri.unitNumber}: ${ri.prevRate} -> ${ri.newRate}</li>
                    ))}
                  </ul>
                </div>
              )}
              {entry.unitTransfers && entry.unitTransfers.length > 0 && (
                <div>
                  <strong>Unit Transfers:</strong>
                  <ul className="list-disc pl-5">
                    {entry.unitTransfers.map(ut => (
                      <li key={ut.id}>Unit {ut.currentUnit} -> {ut.newUnit}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Notes:</strong> <span className="whitespace-pre-wrap">{entry.notes}</span></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogOutput;
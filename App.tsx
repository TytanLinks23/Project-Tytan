
import React, { useState } from 'react';
import { LogEntry, ModalInfo } from './types';
import CallerLogForm from './components/CallerLogForm';
import LogOutput from './components/LogOutput';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    isOpen: false,
    title: '',
    content: '',
  });

  const handleAddLogEntry = (entry: LogEntry) => {
    setLogEntries(prevEntries => [entry, ...prevEntries]);
  };

  const showModal = (title: string, content: React.ReactNode) => {
    setModalInfo({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, title: '', content: '' });
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto p-4 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-700">TalkTrack Pro - Caller Log</h1>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
            <CallerLogForm onAddEntry={handleAddLogEntry} showModal={showModal} />
            <LogOutput entries={logEntries} />
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <Dashboard showModal={showModal} />
          </div>
        </main>
      </div>
      <Modal
        isOpen={modalInfo.isOpen}
        title={modalInfo.title}
        onClose={closeModal}
      >
        {modalInfo.content}
      </Modal>
    </div>
  );
};

export default App;

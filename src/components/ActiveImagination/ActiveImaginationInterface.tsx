import React from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { JournalingProvider, useJournaling } from './JournalingProvider';
import { ImaginationProvider, useImagination } from './ImaginationProvider';
import { PatternProvider, usePatterns } from './PatternProvider';
import { JournalEntry } from './JournalEntry';
import { ImaginationSessionComponent } from './ImaginationSession';
import { PatternCard } from './PatternCard';

const JournalingTab: React.FC = () => {
  const { entries, selectedEntry, selectEntry, analyzeEntry } = useJournaling();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <JournalEntry
            key={entry.id}
            entry={entry}
            onSelect={selectEntry}
            onAnalyze={analyzeEntry}
            isSelected={selectedEntry?.id === entry.id}
          />
        ))}
      </div>
    </div>
  );
};

const ImaginationTab: React.FC = () => {
  const {
    currentSession,
    startSession,
    submitResponse,
    completeSession,
    pauseSession,
    resumeSession
  } = useImagination();

  return (
    <div className="space-y-4">
      {currentSession ? (
        <ImaginationSessionComponent
          session={currentSession}
          onSubmitResponse={submitResponse}
          onPause={pauseSession}
          onResume={resumeSession}
          onComplete={completeSession}
          isActive={true}
        />
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500 mb-4">Geen actieve imaginatie sessie</p>
            <button
              onClick={startSession}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Nieuwe Sessie
            </button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

const PatternsTab: React.FC = () => {
  const { patterns, analyzePatterns, isAnalyzing } = usePatterns();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gedetecteerde Patronen</h2>
        <button
          onClick={analyzePatterns}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyseren...' : 'Analyseer Patronen'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map((pattern, index) => (
          <PatternCard
            key={index}
            pattern={pattern}
            onViewDetails={(p) => console.log('View pattern details:', p)}
          />
        ))}
      </div>

      {patterns.length === 0 && !isAnalyzing && (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500">Geen patronen gedetecteerd</p>
            <p className="text-sm text-gray-400 mt-2">
              Klik op "Analyseer Patronen" om je journal data te analyseren
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export const ActiveImaginationInterface: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Actieve Imaginatie</h1>

      <Tabs aria-label="Active Imagination Tabs" className="w-full">
        <Tab key="journaling" title="Dagboek">
          <JournalingProvider>
            <JournalingTab />
          </JournalingProvider>
        </Tab>

        <Tab key="imagination" title="Imaginatie Sessies">
          <ImaginationProvider>
            <ImaginationTab />
          </ImaginationProvider>
        </Tab>

        <Tab key="patterns" title="Patronen">
          <PatternProvider>
            <PatternsTab />
          </PatternProvider>
        </Tab>
      </Tabs>
    </div>
  );
};
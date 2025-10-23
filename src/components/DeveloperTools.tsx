/**
 * Developer Tools Component - BMAD Architecture
 *
 * Development features for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Settings } from 'lucide-react';

export const DeveloperTools: React.FC = () => {
  const handleDeveloperImport = () => {
    alert('🔧 Developer Database Import\n\nDeze functie is bedoeld voor het vullen van de Supabase database met Obsidian data tijdens ontwikkeling.\n\nVoor eindgebruikers wordt deze functionaliteit geïntegreerd in de normale workflow.');
  };

  return (
    <Card className="glass border border-white/10 mb-6">
      <CardBody className="p-6">
        <h3 className="text-xl font-semibold mb-4">🔧 Developer Tools</h3>
        <Button
          onClick={handleDeveloperImport}
          variant="ghost"
          size="sm"
          startContent={<Settings className="w-4 h-4" />}
          className="opacity-80"
        >
          🔧 Dev: Database Import
        </Button>
      </CardBody>
    </Card>
  );
};
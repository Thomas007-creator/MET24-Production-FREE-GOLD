import React from 'react';
import { Card, CardHeader, CardBody, Button, Divider } from '@nextui-org/react';
import { Database, Download, Upload, Trash2 } from 'lucide-react';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageDataTab: React.FC = () => {
  const {
    handleExportData,
    handleImportData,
    setIsDeleteModalOpen,
    setIsExportModalOpen,
    setIsImportModalOpen,
  } = useSettingsPage();

  return (
    <div className="space-y-6">
      <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Beheer
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Data Exporteren</p>
              <p className="text-sm text-gray-400">Download al je data als backup</p>
            </div>
            <Button
              color="primary"
              variant="bordered"
              startContent={<Download />}
              onClick={() => setIsExportModalOpen(true)}
            >
              Exporteren
            </Button>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Data Importeren</p>
              <p className="text-sm text-gray-400">Herstel data van een backup</p>
            </div>
            <Button
              color="secondary"
              variant="bordered"
              startContent={<Upload />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Importeren
            </Button>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Cache Wissen</p>
              <p className="text-sm text-gray-400">Verwijder tijdelijke bestanden</p>
            </div>
            <Button
              color="warning"
              variant="bordered"
              size="sm"
            >
              Wissen
            </Button>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Alle Data Verwijderen</p>
              <p className="text-sm text-gray-400">Permanent verwijderen van alle data</p>
            </div>
            <Button
              color="danger"
              variant="bordered"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Verwijderen
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
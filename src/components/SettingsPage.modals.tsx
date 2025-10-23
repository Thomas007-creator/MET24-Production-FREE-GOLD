import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageModals: React.FC = () => {
  const {
    isDeleteModalOpen,
    isExportModalOpen,
    isImportModalOpen,
    handleExportData,
    handleImportData,
    handleDeleteAccount,
    setIsDeleteModalOpen,
    setIsExportModalOpen,
    setIsImportModalOpen,
  } = useSettingsPage();

  return (
    <>
      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        size="md"
        className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-semibold text-white">Data Exporteren</h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300">
              Je data wordt geëxporteerd als een JSON bestand. Dit bevat al je journal entries,
              challenges, instellingen en andere persoonlijke data.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => setIsExportModalOpen(false)}
            >
              Annuleren
            </Button>
            <Button
              color="primary"
              onClick={handleExportData}
              startContent={<Download />}
            >
              Exporteren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        size="md"
        className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-semibold text-white">Data Importeren</h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300 mb-4">
              Selecteer een JSON backup bestand om je data te herstellen.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => setIsImportModalOpen(false)}
            >
              Annuleren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        size="md"
        className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-semibold text-white text-red-400">Account Verwijderen</h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300">
              <strong className="text-red-400">Waarschuwing:</strong> Dit zal permanent al je data verwijderen,
              inclusief journal entries, challenges, en instellingen. Deze actie kan niet ongedaan worden gemaakt.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuleren
            </Button>
            <Button
              color="danger"
              onClick={handleDeleteAccount}
              startContent={<Trash2 />}
            >
              Permanent Verwijderen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
import React from 'react';
import { Button, Card, CardBody, Progress, Chip } from '@nextui-org/react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Home,
  User,
  Database,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Key,
  Mail,
  Smartphone as Phone,
  Calendar,
  Clock,
  Languages,
  HelpCircle,
  FileText,
  Shield as Security,
  Users,
  Heart,
  Brain,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageHeader: React.FC = () => {
  const navigate = useNavigate();
  const {
    syncStatus,
    handleSaveSettings,
  } = useSettingsPage();

  const getSyncStatusColor = () => {
    switch (syncStatus.status) {
      case 'synced': return 'success';
      case 'syncing': return 'primary';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus.status) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            color="secondary"
            variant="bordered"
            startContent={<ArrowLeft />}
            onClick={() => navigate(-1)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Terug
          </Button>
          <Button
            color="primary"
            variant="bordered"
            startContent={<Home />}
            onClick={() => navigate('/')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Home
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            color="success"
            variant="bordered"
            startContent={<User />}
            onClick={() => navigate('/profile')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Profiel
          </Button>
          <Button
            color="primary"
            onClick={handleSaveSettings}
            startContent={<Save />}
          >
            Opslaan
          </Button>
        </div>
      </div>

      {/* Sync Status */}
      <Card className="bg-[rgba(27,38,59,0.8)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] mb-6">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getSyncStatusIcon()}
              <div>
                <p className="text-white font-medium">Sync Status</p>
                <p className="text-sm text-gray-400">
                  Laatste sync: {new Date(syncStatus.lastSync).toLocaleString('nl-NL')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress
                value={syncStatus.progress}
                className="w-24"
                color={getSyncStatusColor()}
                size="sm"
              />
              <Chip
                color={getSyncStatusColor()}
                size="sm"
                variant="flat"
              >
                {syncStatus.status}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
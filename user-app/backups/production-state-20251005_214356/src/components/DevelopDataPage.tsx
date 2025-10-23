import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Spinner } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeft,
  Download,
  Eye,
  BarChart3,
  Database,
  Settings,
  RefreshCw,
  FileText,
  Brain,
  Loader,
} from 'lucide-react';
import { createContentLoaderService } from '../services/contentLoaderService';
import database from '../database/v14/database';

const DevelopDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAppStore();
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'onboarding' | 'debug' | 'content'
  >('analytics');

  const userName = userData?.name || 'Gebruiker';
  const mbtiType = userData?.mbtiType || 'INTJ';

  // Content Loader state
  const [contentLoader] = useState(() => createContentLoaderService(database));
  const [contentLoading, setContentLoading] = useState(false);
  const [contentProgress, setContentProgress] = useState<any>(null);
  const [contentResults, setContentResults] = useState<any[]>([]);
  const [contentStats, setContentStats] = useState<any>(null);

  const handleExportToConsole = () => {
    // eslint-disable-next-line no-console
    console.log('📊 Onboarding Data Analysis:', userData);
    alert('Onboarding data geëxporteerd naar console!');
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `onboarding-data-${userName}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRunAnalysis = () => {
    const analysis = {
      timestamp: new Date().toISOString(),
      user: userName,
      mbtiType: mbtiType,
      onboardingComplete: true,
      dataPoints: {
        hasEmail: !!userData?.email,
        hasInterests: !!userData?.interests?.length,
        hasContext: !!userData?.context,
        hasWellness: !!userData?.wellness,
        hasNotifications: !!userData?.notifications,
        isVerified: !!userData?.verified,
        privacyAccepted: !!userData?.privacyAccepted,
      },
    };
    // eslint-disable-next-line no-console
    console.log('📊 Onboarding Analysis:', analysis);
    alert('Analyse voltooid! Bekijk console voor details.');
  };

  // Content Loader functions
  const handleLoadAllContent = async () => {
    try {
      setContentLoading(true);
      setContentResults([]);
      
      const results = await contentLoader.loadAllContent();
      setContentResults(results);
      
      // Calculate stats
      const stats = {
        totalTables: results.length,
        totalLoaded: results.reduce((sum, r) => sum + r.recordsLoaded, 0),
        totalSkipped: results.reduce((sum, r) => sum + r.recordsSkipped, 0),
        totalFailed: results.reduce((sum, r) => sum + r.recordsFailed, 0),
        totalTime: results.reduce((sum, r) => sum + r.loadTime, 0)
      };
      setContentStats(stats);
      
      alert(`Content loading voltooid! ${stats.totalLoaded} records geladen.`);
    } catch (error) {
      console.error('Content loading failed:', error);
      alert('Content loading mislukt! Bekijk console voor details.');
    } finally {
      setContentLoading(false);
    }
  };

  const handleLoadAIArtifacts = async () => {
    try {
      setContentLoading(true);
      const result = await contentLoader.loadAIArtifacts();
      setContentResults([result]);
      setContentStats({
        totalTables: 1,
        totalLoaded: result.recordsLoaded,
        totalSkipped: result.recordsSkipped,
        totalFailed: result.recordsFailed,
        totalTime: result.loadTime
      });
      alert(`AI Artifacts geladen! ${result.recordsLoaded} records.`);
    } catch (error) {
      console.error('AI Artifacts loading failed:', error);
      alert('AI Artifacts loading mislukt!');
    } finally {
      setContentLoading(false);
    }
  };

  const handleLoadMBTIContent = async () => {
    try {
      setContentLoading(true);
      const result = await contentLoader.loadMBTIContent();
      setContentResults([result]);
      setContentStats({
        totalTables: 1,
        totalLoaded: result.recordsLoaded,
        totalSkipped: result.recordsSkipped,
        totalFailed: result.recordsFailed,
        totalTime: result.loadTime
      });
      alert(`MBTI Content geladen! ${result.recordsLoaded} records.`);
    } catch (error) {
      console.error('MBTI Content loading failed:', error);
      alert('MBTI Content loading mislukt!');
    } finally {
      setContentLoading(false);
    }
  };

  const handleLoadContentByMBTI = async () => {
    try {
      setContentLoading(true);
      const results = await contentLoader.loadContentByMBTIType(mbtiType);
      setContentResults(results);
      setContentStats({
        totalTables: results.length,
        totalLoaded: results.reduce((sum, r) => sum + r.recordsLoaded, 0),
        totalSkipped: results.reduce((sum, r) => sum + r.recordsSkipped, 0),
        totalFailed: results.reduce((sum, r) => sum + r.recordsFailed, 0),
        totalTime: results.reduce((sum, r) => sum + r.loadTime, 0)
      });
      alert(`Content voor ${mbtiType} geladen! ${results.reduce((sum, r) => sum + r.recordsLoaded, 0)} records.`);
    } catch (error) {
      console.error('MBTI Content loading failed:', error);
      alert('MBTI Content loading mislukt!');
    } finally {
      setContentLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const connected = await contentLoader.testConnection();
      if (connected) {
        alert('✅ Supabase verbinding succesvol!');
      } else {
        alert('❌ Supabase verbinding mislukt!');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('❌ Verbinding test mislukt!');
    }
  };

  // Update progress
  useEffect(() => {
    if (contentLoading) {
      const interval = setInterval(() => {
        const progress = contentLoader.getProgress();
        setContentProgress(progress);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contentLoading, contentLoader]);

  return (
    <div className='p-5 max-w-6xl mx-auto'>
      {/* Header */}
      <header className='mb-8'>
        <div className='flex items-center gap-4 mb-4'>
          <Button
            size='sm'
            variant='bordered'
            onClick={() => navigate('/')}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Terug naar MainView
          </Button>
          <h1 className='text-3xl font-bold text-gray-800'>
            🔧 Develop Data & Debug Tools
          </h1>
        </div>
        <p className='text-gray-600'>
           ji voor data analyse en debugging
        </p>
      </header>

      {/* Tab Navigation */}
      <div className='flex gap-2 mb-6'>
        <Button
          size='sm'
          color={activeTab === 'analytics' ? 'primary' : 'default'}
          variant={activeTab === 'analytics' ? 'solid' : 'bordered'}
          onClick={() => setActiveTab('analytics')}
          className='flex items-center gap-2'
        >
          <BarChart3 className='w-4 h-4' />
          Analytics
        </Button>
        <Button
          size='sm'
          color={activeTab === 'onboarding' ? 'primary' : 'default'}
          variant={activeTab === 'onboarding' ? 'solid' : 'bordered'}
          onClick={() => setActiveTab('onboarding')}
          className='flex items-center gap-2'
        >
          <Database className='w-4 h-4' />
          Onboarding Data
        </Button>
        <Button
          size='sm'
          color={activeTab === 'debug' ? 'primary' : 'default'}
          variant={activeTab === 'debug' ? 'solid' : 'bordered'}
          onClick={() => setActiveTab('debug')}
          className='flex items-center gap-2'
        >
          <Settings className='w-4 h-4' />
          Debug Tools
        </Button>
        <Button
          size='sm'
          color={activeTab === 'content' ? 'primary' : 'default'}
          variant={activeTab === 'content' ? 'solid' : 'bordered'}
          onClick={() => setActiveTab('content')}
          className='flex items-center gap-2'
        >
          <FileText className='w-4 h-4' />
          Content Loader
        </Button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className='space-y-6'>
          <Card className='bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>
                📊 Analytics & Insights
              </h2>
            </CardHeader>
            <CardBody>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    📈 Gebruikersstatistieken
                  </h3>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>MBTI Type:</span> {mbtiType}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Gebruikersnaam:</span>{' '}
                      {userName}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Interesses:</span>{' '}
                      {userData?.interests?.length || 0}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Onboarding Voltooid:</span>{' '}
                      {userData ? 'Ja' : 'Nee'}
                    </p>
                  </div>
                </div>

                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    🎯 MBTI Analyse
                  </h3>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Type:</span> {mbtiType}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Confidence:</span> N/A
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Source:</span> N/A
                    </p>
                  </div>
                </div>

                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    💚 Wellness Status
                  </h3>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Energy Index:</span>{' '}
                      {(userData?.wellness?.scores as any)?.energy_index || 'N/A'}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Stress Index:</span>{' '}
                      {(userData?.wellness?.scores as any)?.stress_index || 'N/A'}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Social Support:</span>{' '}
                      {(userData?.wellness?.scores as any)?.social_support_score ||
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Onboarding Data Tab */}
      {activeTab === 'onboarding' && (
        <div className='space-y-6'>
          <Card className='bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>
                🔍 Onboarding Data Analyse
              </h2>
            </CardHeader>
            <CardBody>
              <div className='space-y-4'>
                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    👤 Gebruikersprofiel
                  </h3>
                  <pre className='text-xs bg-gray-100 p-3 rounded overflow-auto max-h-60'>
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>

                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    📊 Onboarding Status
                  </h3>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                    <div className='p-2 bg-green-100 rounded'>
                      <p className='text-xs text-gray-600'>Account</p>
                      <p className='font-semibold text-green-700'>✅ Actief</p>
                    </div>
                    <div className='p-2 bg-blue-100 rounded'>
                      <p className='text-xs text-gray-600'>Privacy</p>
                      <p className='font-semibold text-blue-700'>
                        {userData?.privacyAccepted
                          ? '✅ Geaccepteerd'
                          : '❌ Niet geaccepteerd'}
                      </p>
                    </div>
                    <div className='p-2 bg-purple-100 rounded'>
                      <p className='text-xs text-gray-600'>Verificatie</p>
                      <p className='font-semibold text-purple-700'>
                        {userData?.verified
                          ? '✅ Geverifieerd'
                          : '❌ Niet geverifieerd'}
                      </p>
                    </div>
                    <div className='p-2 bg-orange-100 rounded'>
                      <p className='text-xs text-gray-600'>Interesses</p>
                      <p className='font-semibold text-orange-700'>
                        {userData?.interests?.length || 0} geselecteerd
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Debug Tools Tab */}
      {activeTab === 'debug' && (
        <div className='space-y-6'>
          <Card className='bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>
                🔧 Debug Tools
              </h2>
            </CardHeader>
            <CardBody>
              <div className='space-y-4'>
                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    📤 Export Functies
                  </h3>
                  <div className='flex gap-2 flex-wrap'>
                    <Button
                      size='sm'
                      color='primary'
                      variant='bordered'
                      onClick={handleExportToConsole}
                      className='flex items-center gap-2'
                    >
                      <Eye className='w-4 h-4' />
                      Export naar Console
                    </Button>
                    <Button
                      size='sm'
                      color='success'
                      variant='bordered'
                      onClick={handleDownloadJSON}
                      className='flex items-center gap-2'
                    >
                      <Download className='w-4 h-4' />
                      Download JSON
                    </Button>
                    <Button
                      size='sm'
                      color='warning'
                      variant='bordered'
                      onClick={handleRunAnalysis}
                      className='flex items-center gap-2'
                    >
                      <BarChart3 className='w-4 h-4' />
                      Voer Analyse Uit
                    </Button>
                  </div>
                </div>

                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    🔍 Data Validatie
                  </h3>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>localStorage:</span>
                      {localStorage.getItem('onboarding_completed')
                        ? ' ✅ Onboarding voltooid'
                        : ' ❌ Onboarding niet voltooid'}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>userData:</span>
                      {userData ? ' ✅ Beschikbaar' : ' ❌ Niet beschikbaar'}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>MBTI Data:</span>
                      {userData?.mbtiType
                        ? ' ✅ Aanwezig'
                        : ' ❌ Niet aanwezig'}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Wellness Data:</span>
                      {userData?.wellness
                        ? ' ✅ Aanwezig'
                        : ' ❌ Niet aanwezig'}
                    </p>
                  </div>
                </div>

                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    🧹 Cache Management
                  </h3>
                  <div className='flex gap-2 flex-wrap'>
                    <Button
                      size='sm'
                      color='danger'
                      variant='bordered'
                      onClick={() => {
                        localStorage.clear();
                        alert('localStorage gewist! Pagina wordt herladen...');
                        window.location.reload();
                      }}
                    >
                      Clear localStorage
                    </Button>
                    <Button
                      size='sm'
                      color='warning'
                      variant='bordered'
                      onClick={() => {
                        sessionStorage.clear();
                        alert('sessionStorage gewist!');
                      }}
                    >
                      Clear sessionStorage
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Content Loader Tab */}
      {activeTab === 'content' && (
        <div className='space-y-6'>
          <Card className='bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>
                📦 Content Loader Service
              </h2>
            </CardHeader>
            <CardBody>
              <div className='space-y-4'>
                {/* Connection Test */}
                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    🔗 Verbinding Test
                  </h3>
                  <Button
                    size='sm'
                    color='primary'
                    variant='bordered'
                    onClick={handleTestConnection}
                    className='flex items-center gap-2'
                  >
                    <RefreshCw className='w-4 h-4' />
                    Test Supabase Verbinding
                  </Button>
                </div>

                {/* Content Loading Actions */}
                <div className='bg-white p-4 rounded-lg border'>
                  <h3 className='font-medium text-gray-700 mb-2'>
                    📥 Content Loading
                  </h3>
                  <div className='flex gap-2 flex-wrap'>
                    <Button
                      size='sm'
                      color='primary'
                      variant='bordered'
                      onClick={handleLoadAllContent}
                      disabled={contentLoading}
                      className='flex items-center gap-2'
                    >
                      {contentLoading ? <Spinner size='sm' /> : <Loader className='w-4 h-4' />}
                      Load All Content
                    </Button>
                    <Button
                      size='sm'
                      color='secondary'
                      variant='bordered'
                      onClick={handleLoadAIArtifacts}
                      disabled={contentLoading}
                      className='flex items-center gap-2'
                    >
                      <Brain className='w-4 h-4' />
                      Load AI Artifacts
                    </Button>
                    <Button
                      size='sm'
                      color='success'
                      variant='bordered'
                      onClick={handleLoadMBTIContent}
                      disabled={contentLoading}
                      className='flex items-center gap-2'
                    >
                      <FileText className='w-4 h-4' />
                      Load MBTI Content
                    </Button>
                    <Button
                      size='sm'
                      color='warning'
                      variant='bordered'
                      onClick={handleLoadContentByMBTI}
                      disabled={contentLoading}
                      className='flex items-center gap-2'
                    >
                      <Brain className='w-4 h-4' />
                      Load {mbtiType} Content
                    </Button>
                  </div>
                </div>

                {/* Progress Display */}
                {contentLoading && contentProgress && (
                  <div className='bg-white p-4 rounded-lg border'>
                    <h3 className='font-medium text-gray-700 mb-2'>
                      📊 Loading Progress
                    </h3>
                    <div className='space-y-2'>
                      <p className='text-sm'>
                        <span className='font-medium'>Current Table:</span> {contentProgress.currentTable}
                      </p>
                      <p className='text-sm'>
                        <span className='font-medium'>Progress:</span> {contentProgress.completedTables}/{contentProgress.totalTables} tables
                      </p>
                      <Progress 
                        value={(contentProgress.completedTables / contentProgress.totalTables) * 100} 
                        className='w-full'
                      />
                      <p className='text-sm'>
                        <span className='font-medium'>Records:</span> {contentProgress.loadedRecords}/{contentProgress.totalRecords}
                      </p>
                    </div>
                  </div>
                )}

                {/* Results Display */}
                {contentResults.length > 0 && (
                  <div className='bg-white p-4 rounded-lg border'>
                    <h3 className='font-medium text-gray-700 mb-2'>
                      📊 Loading Results
                    </h3>
                    <div className='space-y-2'>
                      {contentResults.map((result, index) => (
                        <div key={index} className='p-2 bg-gray-50 rounded border'>
                          <p className='text-sm font-medium'>{result.tableName}</p>
                          <div className='grid grid-cols-3 gap-2 text-xs'>
                            <span className='text-green-600'>✅ {result.recordsLoaded} loaded</span>
                            <span className='text-yellow-600'>⏭️ {result.recordsSkipped} skipped</span>
                            <span className='text-red-600'>❌ {result.recordsFailed} failed</span>
                          </div>
                          <p className='text-xs text-gray-500'>Time: {result.loadTime}ms</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistics Display */}
                {contentStats && (
                  <div className='bg-white p-4 rounded-lg border'>
                    <h3 className='font-medium text-gray-700 mb-2'>
                      📈 Loading Statistics
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                      <div className='p-2 bg-blue-100 rounded'>
                        <p className='text-xs text-gray-600'>Tables</p>
                        <p className='font-semibold text-blue-700'>{contentStats.totalTables}</p>
                      </div>
                      <div className='p-2 bg-green-100 rounded'>
                        <p className='text-xs text-gray-600'>Loaded</p>
                        <p className='font-semibold text-green-700'>{contentStats.totalLoaded}</p>
                      </div>
                      <div className='p-2 bg-yellow-100 rounded'>
                        <p className='text-xs text-gray-600'>Skipped</p>
                        <p className='font-semibold text-yellow-700'>{contentStats.totalSkipped}</p>
                      </div>
                      <div className='p-2 bg-red-100 rounded'>
                        <p className='text-xs text-gray-600'>Failed</p>
                        <p className='font-semibold text-red-700'>{contentStats.totalFailed}</p>
                      </div>
                    </div>
                    <p className='text-sm text-center mt-2'>
                      Total time: {contentStats.totalTime}ms
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DevelopDataPage;

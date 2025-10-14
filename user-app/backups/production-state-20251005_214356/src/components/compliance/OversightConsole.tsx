/**
 * Oversight Console - EU AI Act Human Oversight Interface
 * 
 * Integrates with existing:
 * - NextUI design system
 * - Zustand store (useAppStore)
 * - Supabase client
 * - Push notification system
 * - WatermelonDB V14
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
  Input,
  Select,
  SelectItem
} from '@nextui-org/react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  Play,
  Pause,
  Square,
  RefreshCw,
  Download,
  Bell,
  Settings,
  BarChart3,
  FileText,
  Users
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../config/supabase';
import { logger } from '../../utils/logger';

// Types
interface OversightSession {
  id: string;
  traceId: string;
  sessionType: string;
  openedBy: string;
  openedReason: string;
  riskLevel: number;
  status: string;
  openedAt: string;
  resolution?: string;
  actionsTaken?: string[];
}

interface IncidentReport {
  id: string;
  incidentId: string;
  severityLevel: number;
  category: string;
  description: string;
  status: string;
  firstDetectedAt: string;
  authorityNotificationRequired: boolean;
}

interface ComplianceStatus {
  overall: string;
  score: number;
  issues: string[];
  recommendations: string[];
}

interface ComplianceDashboard {
  latestSnapshot: any;
  recentIncidents: IncidentReport[];
  activeOversight: OversightSession[];
  modelPerformance: any[];
  complianceStatus: ComplianceStatus;
}

const OversightConsole: React.FC = () => {
  const { userData } = useAppStore();
  const [dashboard, setDashboard] = useState<ComplianceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<OversightSession | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [sessionAction, setSessionAction] = useState<'allow' | 'block' | 'modify' | 'escalate'>('allow');
  const [sessionNotes, setSessionNotes] = useState('');
  const [incidentNotes, setIncidentNotes] = useState('');
  const [incidentStatus, setIncidentStatus] = useState('investigating');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load compliance dashboard
  useEffect(() => {
    loadComplianceDashboard();
    
    if (autoRefresh) {
      const interval = setInterval(loadComplianceDashboard, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadComplianceDashboard = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('compliance-reporting', {
        body: { action: 'dashboard' }
      });

      if (error) throw error;
      
      setDashboard(data);
      logger.info('Compliance dashboard loaded', { 
        incidents: data.recentIncidents?.length || 0,
        oversight: data.activeOversight?.length || 0,
        status: data.complianceStatus?.overall
      });
    } catch (error) {
      logger.error('Failed to load compliance dashboard', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleSessionAction = async (session: OversightSession, action: string) => {
    try {
      const { error } = await supabase
        .from('oversight_sessions')
        .update({
          status: 'resolved',
          resolution: sessionNotes,
          actions_taken: [action],
          human_decision: action,
          resolved_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      // Send push notification if user is available
      if (userData?.id) {
        await supabase.functions.invoke('push-notifications', {
          body: {
            userId: userData.id,
            title: 'Oversight Action Taken',
            body: `Session ${session.id} was ${action}ed by human oversight`,
            data: { sessionId: session.id, action }
          }
        });
      }

      setShowSessionModal(false);
      setSelectedSession(null);
      setSessionNotes('');
      await loadComplianceDashboard();
      
      logger.info('Oversight session action completed', { sessionId: session.id, action });
    } catch (error) {
      logger.error('Failed to handle session action', { error });
    }
  };

  const handleIncidentUpdate = async (incident: IncidentReport) => {
    try {
      const { error } = await supabase
        .from('incident_reports')
        .update({
          status: incidentStatus,
          resolution: incidentNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', incident.id);

      if (error) throw error;

      setShowIncidentModal(false);
      setSelectedIncident(null);
      setIncidentNotes('');
      await loadComplianceDashboard();
      
      logger.info('Incident updated', { incidentId: incident.id, status: incidentStatus });
    } catch (error) {
      logger.error('Failed to update incident', { error });
    }
  };

  const generateComplianceReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('compliance-reporting', {
        body: { action: 'daily_snapshot' }
      });

      if (error) throw error;

      // Download report as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('Compliance report generated and downloaded');
    } catch (error) {
      logger.error('Failed to generate compliance report', { error });
    }
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (status) {
      case 'compliant': return 'success';
      case 'at_risk': return 'warning';
      case 'non_compliant': return 'danger';
      case 'open': return 'warning';
      case 'resolved': return 'success';
      case 'investigating': return 'primary';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: number): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    if (severity >= 4) return 'danger';
    if (severity >= 3) return 'warning';
    if (severity >= 2) return 'primary';
    return 'default';
  };

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading oversight console...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold">EU AI Act Oversight Console</h2>
              <p className="text-sm text-gray-500">Human oversight and compliance monitoring</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="bordered"
              startContent={<RefreshCw className="w-4 h-4" />}
              onPress={loadComplianceDashboard}
              isLoading={loading}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              color="primary"
              startContent={<Download className="w-4 h-4" />}
              onPress={generateComplianceReport}
            >
              Export Report
            </Button>
            <Button
              size="sm"
              variant="bordered"
              startContent={<Settings className="w-4 h-4" />}
              onPress={() => setAutoRefresh(!autoRefresh)}
              color={autoRefresh ? 'success' : 'default'}
            >
              Auto Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Compliance Status Overview */}
      {dashboard?.complianceStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Compliance Status</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Status */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Chip
                    color={getStatusColor(dashboard.complianceStatus.overall)}
                    variant="flat"
                    size="lg"
                  >
                    {dashboard.complianceStatus.overall.toUpperCase()}
                  </Chip>
                </div>
                <Progress
                  value={dashboard.complianceStatus.score}
                  color={dashboard.complianceStatus.score >= 85 ? 'success' : 
                         dashboard.complianceStatus.score >= 70 ? 'warning' : 'danger'}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Compliance Score: {dashboard.complianceStatus.score}%
                </p>
              </div>

              {/* Issues */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Active Issues</h4>
                <div className="space-y-1">
                  {dashboard.complianceStatus.issues.length > 0 ? (
                    dashboard.complianceStatus.issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{issue}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>No active issues</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                <div className="space-y-1">
                  {dashboard.complianceStatus.recommendations.length > 0 ? (
                    dashboard.complianceStatus.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{rec}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>No recommendations</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs aria-label="Oversight Console Tabs" className="w-full">
        <Tab key="oversight" title={
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Active Oversight</span>
          </div>
        }>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold">Oversight Sessions</h3>
                <Badge content={dashboard?.activeOversight?.length || 0} color="primary">
                  <Users className="w-5 h-5" />
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {dashboard?.activeOversight && dashboard.activeOversight.length > 0 ? (
                <Table aria-label="Oversight sessions table">
                  <TableHeader>
                    <TableColumn>SESSION ID</TableColumn>
                    <TableColumn>TYPE</TableColumn>
                    <TableColumn>RISK LEVEL</TableColumn>
                    <TableColumn>REASON</TableColumn>
                    <TableColumn>OPENED</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {dashboard.activeOversight.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {session.id.substring(0, 8)}...
                          </code>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat" color="primary">
                            {session.sessionType}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getSeverityColor(session.riskLevel)}
                            variant="flat"
                          >
                            Level {session.riskLevel}
                          </Chip>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm truncate">{session.openedReason}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {new Date(session.openedAt).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              onPress={() => {
                                setSelectedSession(session);
                                setShowSessionModal(true);
                              }}
                            >
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active oversight sessions</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="incidents" title={
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Incidents</span>
          </div>
        }>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold">Recent Incidents</h3>
                <Badge content={dashboard?.recentIncidents?.length || 0} color="danger">
                  <AlertTriangle className="w-5 h-5" />
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {dashboard?.recentIncidents && dashboard.recentIncidents.length > 0 ? (
                <Table aria-label="Incidents table">
                  <TableHeader>
                    <TableColumn>INCIDENT ID</TableColumn>
                    <TableColumn>SEVERITY</TableColumn>
                    <TableColumn>CATEGORY</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>DETECTED</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {dashboard.recentIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {incident.incidentId.substring(0, 8)}...
                          </code>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getSeverityColor(incident.severityLevel)}
                            variant="flat"
                          >
                            Level {incident.severityLevel}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat" color="secondary">
                            {incident.category}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getStatusColor(incident.status)}
                            variant="flat"
                          >
                            {incident.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {new Date(incident.firstDetectedAt).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() => {
                                setSelectedIncident(incident);
                                setShowIncidentModal(true);
                              }}
                            >
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent incidents</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="performance" title={
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Model Performance</span>
          </div>
        }>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Model Performance Metrics</h3>
            </CardHeader>
            <CardBody>
              {dashboard?.modelPerformance && dashboard.modelPerformance.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboard.modelPerformance.map((model, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{model.model_version}</h4>
                        <Chip
                          size="sm"
                          color={model.passed ? 'success' : 'danger'}
                          variant="flat"
                        >
                          {model.passed ? 'PASS' : 'FAIL'}
                        </Chip>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Pass Rate:</span>
                          <span>{model.pass_rate_percent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Score:</span>
                          <span>{model.avg_score?.toFixed(2) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Test:</span>
                          <span>{new Date(model.last_evaluation).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No performance data available</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Oversight Session Modal */}
      <Modal isOpen={showSessionModal} onClose={() => setShowSessionModal(false)} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <span>Review Oversight Session</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedSession && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Session ID</h4>
                    <p className="text-sm text-gray-600 font-mono">{selectedSession.id}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Risk Level</h4>
                    <Chip
                      color={getSeverityColor(selectedSession.riskLevel)}
                      variant="flat"
                    >
                      Level {selectedSession.riskLevel}
                    </Chip>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Reason for Oversight</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedSession.openedReason}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Action</h4>
                  <Select
                    value={sessionAction}
                    onChange={(e) => setSessionAction(e.target.value as any)}
                    placeholder="Select action"
                  >
                    <SelectItem key="allow" value="allow">Allow</SelectItem>
                    <SelectItem key="block" value="block">Block</SelectItem>
                    <SelectItem key="modify" value="modify">Modify</SelectItem>
                    <SelectItem key="escalate" value="escalate">Escalate</SelectItem>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                  <Textarea
                    placeholder="Add notes about your decision..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    minRows={3}
                  />
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowSessionModal(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => selectedSession && handleSessionAction(selectedSession, sessionAction)}
            >
              Apply Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Incident Modal */}
      <Modal isOpen={showIncidentModal} onClose={() => setShowIncidentModal(false)} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Review Incident</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedIncident && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Incident ID</h4>
                    <p className="text-sm text-gray-600 font-mono">{selectedIncident.incidentId}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Severity</h4>
                    <Chip
                      color={getSeverityColor(selectedIncident.severityLevel)}
                      variant="flat"
                    >
                      Level {selectedIncident.severityLevel}
                    </Chip>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedIncident.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Status</h4>
                  <Select
                    value={incidentStatus}
                    onChange={(e) => setIncidentStatus(e.target.value)}
                    placeholder="Select status"
                  >
                    <SelectItem key="investigating" value="investigating">Investigating</SelectItem>
                    <SelectItem key="mitigated" value="mitigated">Mitigated</SelectItem>
                    <SelectItem key="resolved" value="resolved">Resolved</SelectItem>
                    <SelectItem key="reported" value="reported">Reported</SelectItem>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Resolution Notes</h4>
                  <Textarea
                    placeholder="Add resolution notes..."
                    value={incidentNotes}
                    onChange={(e) => setIncidentNotes(e.target.value)}
                    minRows={3}
                  />
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowIncidentModal(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => selectedIncident && handleIncidentUpdate(selectedIncident)}
            >
              Update Incident
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OversightConsole;

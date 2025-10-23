/**
 * Compliance Reporting - Supabase Edge Function
 * 
 * Implements:
 * - Automated compliance snapshots (daily/weekly/monthly)
 * - Authority reporting for serious incidents
 * - KPI monitoring and drift detection
 * - Integration with existing V14 database
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Types
interface ComplianceSnapshot {
  snapshotId: string;
  snapshotType: 'daily' | 'weekly' | 'monthly' | 'incident' | 'audit';
  generatedAt: string;
  systemVersion: string;
  kpiMetrics: any;
  incidentSummary: any;
  riskRegisterSummary: any;
  authorityReady: boolean;
}

interface IncidentReport {
  incidentId: string;
  severityLevel: number;
  category: string;
  description: string;
  affectedUsers: number;
  firstDetectedAt: string;
  status: string;
  authorityNotificationRequired: boolean;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Compliance reporting service
class ComplianceReportingService {
  
  /**
   * Generate daily compliance snapshot
   */
  async generateDailySnapshot(): Promise<ComplianceSnapshot> {
    const snapshotId = crypto.randomUUID();
    const generatedAt = new Date().toISOString();
    
    try {
      // Get system version from system cards
      const { data: systemCard } = await supabase
        .from('system_cards')
        .select('system_version')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get KPI metrics from audit events
      const kpiMetrics = await this.getKPIMetrics();
      
      // Get incident summary
      const incidentSummary = await this.getIncidentSummary();
      
      // Get risk register summary
      const riskRegisterSummary = await this.getRiskRegisterSummary();

      const snapshot: ComplianceSnapshot = {
        snapshotId,
        snapshotType: 'daily',
        generatedAt,
        systemVersion: systemCard?.system_version || '1.0.0',
        kpiMetrics,
        incidentSummary,
        riskRegisterSummary,
        authorityReady: this.isAuthorityReady(kpiMetrics, incidentSummary)
      };

      // Store snapshot in database
      await this.storeSnapshot(snapshot);

      return snapshot;

    } catch (error) {
      console.error('Failed to generate daily snapshot:', error);
      throw error;
    }
  }

  /**
   * Generate incident report for authority notification
   */
  async generateIncidentReport(incidentId: string): Promise<any> {
    try {
      // Get incident details
      const { data: incident, error } = await supabase
        .from('incident_reports')
        .select('*')
        .eq('incident_id', incidentId)
        .single();

      if (error) throw error;

      // Get related audit events
      const { data: auditEvents } = await supabase
        .from('audit_events')
        .select('*')
        .eq('trace_id', incident.trace_id)
        .order('sequence_number');

      // Get system information
      const { data: systemCard } = await supabase
        .from('system_cards')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const report = {
        incidentId: incident.incident_id,
        reportType: 'serious_incident',
        generatedAt: new Date().toISOString(),
        systemInfo: {
          systemName: systemCard?.system_name || 'MET24 AI Buddy',
          systemVersion: systemCard?.system_version || '1.0.0',
          deploymentEnvironment: systemCard?.deployment_environment || 'production'
        },
        incidentDetails: {
          severityLevel: incident.severity_level,
          category: incident.incident_category,
          description: incident.incident_description,
          affectedUsers: incident.affected_users,
          firstDetectedAt: incident.first_detected_at,
          rootCause: incident.root_cause,
          impactAssessment: incident.impact_assessment
        },
        mitigationActions: incident.mitigation_actions,
        auditTrail: auditEvents,
        lessonsLearned: incident.lessons_learned,
        preventionMeasures: incident.prevention_measures
      };

      // Store authority report
      await this.storeAuthorityReport(report);

      return report;

    } catch (error) {
      console.error('Failed to generate incident report:', error);
      throw error;
    }
  }

  /**
   * Get KPI metrics from audit events
   */
  private async getKPIMetrics(): Promise<any> {
    const { data: kpis } = await supabase.rpc('get_safety_kpis', {
      days_back: 7
    });

    return {
      safetyKPIs: kpis || [],
      summary: {
        totalInteractions: kpis?.reduce((sum: number, kpi: any) => sum + (kpi.total_outputs || 0), 0) || 0,
        refusalRate: kpis?.length > 0 ? kpis[0].refusal_rate_percent || 0 : 0,
        pushbackRate: kpis?.length > 0 ? kpis[0].pushback_rate_percent || 0 : 0,
        oversightInterventions: kpis?.reduce((sum: number, kpi: any) => sum + (kpi.total_oversight_interventions || 0), 0) || 0,
        harmfulContentDetected: kpis?.reduce((sum: number, kpi: any) => sum + (kpi.harmful_content_detected || 0), 0) || 0,
        averageRiskScore: kpis?.length > 0 ? kpis[0].avg_risk_score || 0 : 0
      }
    };
  }

  /**
   * Get incident summary
   */
  private async getIncidentSummary(): Promise<any> {
    const { data: incidents } = await supabase
      .from('incident_reports')
      .select('*')
      .gte('first_detected_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      .order('first_detected_at', { ascending: false });

    const summary = {
      totalIncidents: incidents?.length || 0,
      bySeverity: {
        critical: incidents?.filter(i => i.severity_level >= 4).length || 0,
        high: incidents?.filter(i => i.severity_level === 3).length || 0,
        medium: incidents?.filter(i => i.severity_level === 2).length || 0,
        low: incidents?.filter(i => i.severity_level === 1).length || 0
      },
      byCategory: {},
      byStatus: {
        open: incidents?.filter(i => i.status === 'open').length || 0,
        investigating: incidents?.filter(i => i.status === 'investigating').length || 0,
        resolved: incidents?.filter(i => i.status === 'resolved').length || 0,
        reported: incidents?.filter(i => i.status === 'reported').length || 0
      },
      authorityNotifications: {
        required: incidents?.filter(i => i.authority_notification_required).length || 0,
        sent: incidents?.filter(i => i.authority_notified_at).length || 0
      }
    };

    // Group by category
    incidents?.forEach(incident => {
      const category = incident.incident_category;
      summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
    });

    return summary;
  }

  /**
   * Get risk register summary
   */
  private async getRiskRegisterSummary(): Promise<any> {
    const { data: risks } = await supabase
      .from('risk_register')
      .select('*')
      .order('risk_score', { ascending: false });

    return {
      totalRisks: risks?.length || 0,
      byCategory: {},
      byStatus: {
        pending: risks?.filter(r => r.mitigation_status === 'pending').length || 0,
        implemented: risks?.filter(r => r.mitigation_status === 'implemented').length || 0,
        verified: risks?.filter(r => r.mitigation_status === 'verified').length || 0,
        failed: risks?.filter(r => r.mitigation_status === 'failed').length || 0
      },
      highRiskRisks: risks?.filter(r => r.risk_score > 0.7).length || 0,
      averageRiskScore: risks?.length > 0 ? 
        risks.reduce((sum, r) => sum + r.risk_score, 0) / risks.length : 0
    };
  }

  /**
   * Check if snapshot is ready for authority submission
   */
  private isAuthorityReady(kpiMetrics: any, incidentSummary: any): boolean {
    // Check for serious incidents that require notification
    const seriousIncidents = incidentSummary.bySeverity.critical + incidentSummary.bySeverity.high;
    
    // Check for high risk scores
    const highRiskScore = kpiMetrics.summary.averageRiskScore > 0.7;
    
    // Check for high refusal rates (potential system issues)
    const highRefusalRate = kpiMetrics.summary.refusalRate > 20;
    
    return seriousIncidents > 0 || highRiskScore || highRefusalRate;
  }

  /**
   * Store compliance snapshot
   */
  private async storeSnapshot(snapshot: ComplianceSnapshot): Promise<void> {
    const { error } = await supabase
      .from('compliance_snapshots')
      .insert({
        snapshot_id: snapshot.snapshotId,
        snapshot_type: snapshot.snapshotType,
        snapshot_data: snapshot,
        kpi_metrics: snapshot.kpiMetrics,
        incident_summary: snapshot.incidentSummary,
        authority_ready: snapshot.authorityReady,
        generated_at: snapshot.generatedAt,
        generated_by: 'system'
      });

    if (error) {
      console.error('Failed to store compliance snapshot:', error);
      throw error;
    }
  }

  /**
   * Store authority report
   */
  private async storeAuthorityReport(report: any): Promise<void> {
    const { error } = await supabase
      .from('compliance_snapshots')
      .insert({
        snapshot_id: report.incidentId,
        snapshot_type: 'incident',
        snapshot_data: report,
        authority_ready: true,
        generated_at: report.generatedAt,
        generated_by: 'system'
      });

    if (error) {
      console.error('Failed to store authority report:', error);
      throw error;
    }
  }

  /**
   * Get compliance dashboard data
   */
  async getComplianceDashboard(): Promise<any> {
    try {
      // Get latest snapshot
      const { data: latestSnapshot } = await supabase
        .from('compliance_snapshots')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      // Get recent incidents
      const { data: recentIncidents } = await supabase
        .from('incident_reports')
        .select('*')
        .gte('first_detected_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('first_detected_at', { ascending: false });

      // Get active oversight sessions
      const { data: activeOversight } = await supabase
        .from('oversight_sessions')
        .select('*')
        .eq('status', 'open')
        .order('opened_at', { ascending: false });

      // Get model performance
      const { data: modelPerformance } = await supabase
        .from('evaluation_runs')
        .select('*')
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('completed_at', { ascending: false });

      return {
        latestSnapshot: latestSnapshot?.snapshot_data || null,
        recentIncidents: recentIncidents || [],
        activeOversight: activeOversight || [],
        modelPerformance: modelPerformance || [],
        complianceStatus: this.calculateComplianceStatus(latestSnapshot, recentIncidents, activeOversight)
      };

    } catch (error) {
      console.error('Failed to get compliance dashboard:', error);
      throw error;
    }
  }

  /**
   * Calculate overall compliance status
   */
  private calculateComplianceStatus(snapshot: any, incidents: any[], oversight: any[]): any {
    const status = {
      overall: 'compliant',
      score: 100,
      issues: [],
      recommendations: []
    };

    // Check for critical incidents
    const criticalIncidents = incidents?.filter(i => i.severity_level >= 4).length || 0;
    if (criticalIncidents > 0) {
      status.overall = 'non_compliant';
      status.score -= 30;
      status.issues.push(`${criticalIncidents} critical incidents require immediate attention`);
    }

    // Check for open oversight sessions
    const openOversight = oversight?.length || 0;
    if (openOversight > 5) {
      status.overall = 'at_risk';
      status.score -= 15;
      status.issues.push(`${openOversight} open oversight sessions indicate potential issues`);
    }

    // Check KPI metrics
    if (snapshot?.kpiMetrics?.summary) {
      const kpis = snapshot.kpiMetrics.summary;
      
      if (kpis.refusalRate > 15) {
        status.score -= 10;
        status.recommendations.push('High refusal rate suggests policy may be too restrictive');
      }
      
      if (kpis.averageRiskScore > 0.6) {
        status.score -= 20;
        status.issues.push('High average risk score indicates potential safety issues');
      }
    }

    // Determine overall status
    if (status.score < 70) {
      status.overall = 'non_compliant';
    } else if (status.score < 85) {
      status.overall = 'at_risk';
    }

    return status;
  }
}

// Main handler
serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'dashboard';
    const service = new ComplianceReportingService();

    let response;

    switch (action) {
      case 'daily_snapshot':
        response = await service.generateDailySnapshot();
        break;
      
      case 'incident_report':
        const incidentId = url.searchParams.get('incidentId');
        if (!incidentId) {
          throw new Error('incidentId parameter required');
        }
        response = await service.generateIncidentReport(incidentId);
        break;
      
      case 'dashboard':
      default:
        response = await service.getComplianceDashboard();
        break;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Compliance reporting error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

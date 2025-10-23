/**
 * V14 Audit Events Integration Test
 * 
 * Test script om WatermelonDB ↔ Supabase audit_events sync te valideren
 * Na succesvolle MINIMAL deployment in Supabase
 * 
 * @version 14.0.0
 * @author Thomas
 */

import database from '../database/v14/database';
import auditEventServiceV14 from '../services/auditEventServiceV14';
import { syncTableWithSupabase } from '../services/v14SupabaseSync';
import { createClient } from '@supabase/supabase-js';

// Test configuration
const TEST_CONFIG = {
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
  supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
  testUserId: 'test-user-v14-integration',
  testTraceId: crypto.randomUUID()
};

const supabase = createClient(TEST_CONFIG.supabaseUrl, TEST_CONFIG.supabaseKey);

interface TestResult {
  step: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
  error?: any;
}

class V14AuditIntegrationTest {
  private results: TestResult[] = [];

  constructor() {
    // Use V14 audit service singleton
  }

  /**
   * Run complete integration test
   */
  async runFullTest(): Promise<TestResult[]> {
    console.log('🧪 Starting V14 Audit Events Integration Test...\n');
    
    try {
      // Test 1: WatermelonDB local creation
      await this.testLocalAuditCreation();
      
      // Test 2: Supabase direct function call
      await this.testSupabaseFunction();
      
      // Test 3: WatermelonDB → Supabase sync
      await this.testWatermelonDBSync();
      
      // Test 4: Data integrity validation
      await this.testDataIntegrity();
      
      // Test 5: Cleanup
      await this.cleanup();
      
    } catch (error) {
      this.addResult('general', 'error', 'Test suite failed', undefined, error);
    }
    
    this.printResults();
    return this.results;
  }

  /**
   * Test 1: Local WatermelonDB audit creation
   */
  private async testLocalAuditCreation(): Promise<void> {
    try {
      console.log('📱 Test 1: WatermelonDB Local Audit Creation...');
      
      const auditData = {
        traceId: TEST_CONFIG.testTraceId,
        userId: TEST_CONFIG.testUserId,
        sessionId: 'test-session-local',
        eventType: 'chatllm_process',
        action: 'privacy_sanitization',
        dataSensitivityLevel: 'PERSONAL' as const,
        processingMethod: 'webgpu_local' as const,
        sanitizationApplied: true,
        externalApiUsed: false,
        status: 'success' as const,
        fallbackTriggered: false,
        metadata: { testType: 'local_creation' }
      };

      const auditEvent = await auditEventServiceV14.createAuditEvent(auditData);
      
      if (auditEvent && auditEvent.id) {
        this.addResult('local_creation', 'success', 
          `Local audit event created with ID: ${auditEvent.id}`);
        
        // Verify it exists in WatermelonDB
        const collection = database.get('audit_events');
        const found = await collection.find(auditEvent.id);
        
        if (found) {
          this.addResult('local_verification', 'success', 
            'Audit event verified in WatermelonDB', { id: found.id });
        } else {
          this.addResult('local_verification', 'error', 
            'Audit event not found after creation');
        }
      } else {
        this.addResult('local_creation', 'error', 
          'Failed to create local audit event');
      }
      
    } catch (error) {
      this.addResult('local_creation', 'error', 
        'Local audit creation failed', undefined, error);
    }
  }

  /**
   * Test 2: Direct Supabase function call (beide functies)
   */
  private async testSupabaseFunction(): Promise<void> {
    try {
      console.log('☁️  Test 2: Supabase V14 Functions...');
      
      // Test SIMPLE function
      const { data: simpleId, error: simpleError } = await supabase.rpc('create_v14_audit_event_simple', {
        p_trace_id: TEST_CONFIG.testTraceId,
        p_user_id: TEST_CONFIG.testUserId,
        p_event_type: 'simple_function_test',
        p_action: 'direct_supabase_simple'
      });

      if (simpleError) {
        this.addResult('supabase_simple', 'error', 
          'Simple function failed', undefined, simpleError);
      } else {
        this.addResult('supabase_simple', 'success', 
          `Simple function returned: ${simpleId}`, { auditId: simpleId });
      }

      // Test ADVANCED function
      const { data: advancedId, error: advancedError } = await supabase.rpc('create_v14_audit_event_advanced', {
        trace_id_param: TEST_CONFIG.testTraceId,
        user_id_param: TEST_CONFIG.testUserId,
        event_type_param: 'advanced_function_test',
        action_param: 'direct_supabase_advanced',
        metadata_param: {
          data_sensitivity_level: 'PERSONAL',
          processing_method: 'webgpu_local',
          processing_time_ms: 150,
          tokens_processed: 25,
          memory_usage_mb: 45.2,
          fallback_triggered: false,
          status: 'success'
        }
      });

      if (advancedError) {
        this.addResult('supabase_advanced', 'error', 
          'Advanced function failed', undefined, advancedError);
      } else {
        this.addResult('supabase_advanced', 'success', 
          `Advanced function returned: ${advancedId}`, { auditId: advancedId });
      }
      
    } catch (error) {
      this.addResult('supabase_functions', 'error', 
        'Supabase functions test failed', undefined, error);
    }
  }

  /**
   * Test 3: WatermelonDB → Supabase sync
   */
  private async testWatermelonDBSync(): Promise<void> {
    try {
      console.log('🔄 Test 3: WatermelonDB → Supabase Sync...');
      
      // Trigger sync (function returns void)
      await syncTableWithSupabase('audit_events');
      
      this.addResult('sync_process', 'success', 
        'Sync process completed without errors');
      
    } catch (error) {
      this.addResult('sync_process', 'error', 
        'Sync test failed', undefined, error);
    }
  }

  /**
   * Test 4: Data integrity validation (includes hash chain)
   */
  private async testDataIntegrity(): Promise<void> {
    try {
      console.log('🔍 Test 4: Data Integrity & Hash Chain Validation...');
      
      // Check Supabase for our test events
      const { data: supabaseEvents, error } = await supabase
        .from('audit_events')
        .select('*')
        .eq('user_id', TEST_CONFIG.testUserId);

      if (error) {
        this.addResult('data_integrity', 'error', 
          'Failed to query Supabase events', undefined, error);
        return;
      }

      // Check WatermelonDB for same events
      const localEvents = await auditEventServiceV14.getAuditEvents({
        userId: TEST_CONFIG.testUserId
      });

      this.addResult('data_integrity', 'success', 
        `Found ${supabaseEvents?.length || 0} events in Supabase, ${localEvents.length} in WatermelonDB`, 
        { 
          supabaseCount: supabaseEvents?.length || 0, 
          localCount: localEvents.length,
          events: supabaseEvents 
        });

      // Test hash chain validation via Supabase function
      if (supabaseEvents && supabaseEvents.length > 0) {
        const traceId = supabaseEvents[0].trace_id;
        const { data: chainValidation, error: chainError } = await supabase.rpc('validate_audit_chain', {
          p_trace_id: traceId
        });

        if (chainError) {
          this.addResult('hash_chain_validation', 'error', 
            'Hash chain validation failed', undefined, chainError);
        } else {
          this.addResult('hash_chain_validation', 'success', 
            `Hash chain validation: ${chainValidation[0]?.is_valid ? 'VALID' : 'INVALID'}`, 
            chainValidation);
        }
      }

      // Test local hash chain validation
      const localValidation = await auditEventServiceV14.validateHashChain(TEST_CONFIG.testTraceId);
      this.addResult('local_hash_validation', localValidation.isValid ? 'success' : 'error', 
        `Local hash chain: ${localValidation.isValid ? 'VALID' : 'INVALID'} (${localValidation.chainLength} events)`, 
        localValidation);
      
    } catch (error) {
      this.addResult('data_integrity', 'error', 
        'Data integrity test failed', undefined, error);
    }
  }

  /**
   * Test 5: Cleanup
   */
  private async cleanup(): Promise<void> {
    try {
      console.log('🧹 Test 5: Cleanup...');
      
      // Clean Supabase
      const { error: supabaseError } = await supabase
        .from('audit_events')
        .delete()
        .eq('user_id', TEST_CONFIG.testUserId);

      if (supabaseError) {
        this.addResult('cleanup', 'error', 
          'Failed to cleanup Supabase', undefined, supabaseError);
      } else {
        this.addResult('cleanup', 'success', 
          'Supabase cleanup completed');
      }
      
      // Clean WatermelonDB
      const collection = database.get('audit_events');
      const localEvents = await collection.query().fetch();
      const testEvents = localEvents.filter(e => 
        (e as any).userId === TEST_CONFIG.testUserId);

      await database.write(async () => {
        for (const event of testEvents) {
          await event.destroyPermanently();
        }
      });

      this.addResult('cleanup_local', 'success', 
        `Cleaned ${testEvents.length} local test events`);
      
    } catch (error) {
      this.addResult('cleanup', 'error', 
        'Cleanup failed', undefined, error);
    }
  }

  /**
   * Add test result
   */
  private addResult(step: string, status: 'success' | 'error', 
                   message: string, data?: any, error?: any): void {
    this.results.push({ step, status, message, data, error });
    
    const icon = status === 'success' ? '✅' : '❌';
    console.log(`${icon} ${step}: ${message}`);
    
    if (error) {
      console.error('   Error details:', error);
    }
  }

  /**
   * Print test summary
   */
  private printResults(): void {
    console.log('\n' + '='.repeat(50));
    console.log('📊 V14 AUDIT INTEGRATION TEST RESULTS');
    console.log('='.repeat(50));
    
    const successful = this.results.filter(r => r.status === 'success').length;
    const failed = this.results.filter(r => r.status === 'error').length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${this.results.length}`);
    
    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED - V14 Audit Integration Working! 🎉');
    } else {
      console.log('\n⚠️  Some tests failed - check details above');
    }
    console.log('='.repeat(50) + '\n');
  }
}

// Export for use in test routes
export default V14AuditIntegrationTest;

// For direct testing
if (require.main === module) {
  const test = new V14AuditIntegrationTest();
  test.runFullTest().then(() => {
    console.log('Test completed');
    process.exit(0);
  }).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}
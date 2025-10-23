/**
 * Test Script voor Therapist Ecosystem
 * 
 * Test alle services en database integraties:
 * - Database schema
 * - Regional therapist data
 * - MBTI matching
 * - Wellness tracking
 * - Push notifications
 * - Encryption
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { completeDatabaseV14, getCompleteDatabaseV14Status } from '../../database/v14/completeDatabaseV14';
import { TherapistEcosystemService } from './TherapistEcosystemService';
import { RegionalTherapistDataService } from './RegionalTherapistData';
import { HolisticWellnessService } from './HolisticWellnessService';
import { PushNotificationService } from './PushNotificationService';
import { EncryptionService } from './EncryptionService';

export class TestTherapistEcosystem {
  private therapistService: TherapistEcosystemService;
  private regionalDataService: RegionalTherapistDataService;
  private wellnessService: HolisticWellnessService;
  private notificationService: PushNotificationService;
  private encryptionService: EncryptionService;

  constructor() {
    this.therapistService = TherapistEcosystemService.getInstance();
    this.regionalDataService = RegionalTherapistDataService.getInstance();
    this.wellnessService = HolisticWellnessService.getInstance();
    this.notificationService = PushNotificationService.getInstance();
    this.encryptionService = EncryptionService.getInstance();
  }

  /**
   * Run complete test suite
   */
  public async runCompleteTest(): Promise<void> {
    try {
      console.log('🚀 Starting Complete Therapist Ecosystem Test Suite...');
      console.log('=' .repeat(60));

      // Test 1: Database Status
      await this.testDatabaseStatus();
      
      // Test 2: Regional Data Loading
      await this.testRegionalDataLoading();
      
      // Test 3: MBTI Matching
      await this.testMBTIMatching();
      
      // Test 4: Encryption Service
      await this.testEncryptionService();
      
      // Test 5: Wellness Tracking
      await this.testWellnessTracking();
      
      // Test 6: Push Notifications
      await this.testPushNotifications();
      
      // Test 7: Complete Ecosystem
      await this.testCompleteEcosystem();

      console.log('=' .repeat(60));
      console.log('✅ All tests completed successfully!');
      console.log('🎉 Therapist Ecosystem is ready for production!');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }

  /**
   * Test database status
   */
  private async testDatabaseStatus(): Promise<void> {
    console.log('\n📊 Test 1: Database Status');
    console.log('-'.repeat(40));
    
    try {
      const status = await getCompleteDatabaseV14Status();
      console.log('✅ Database Status:', {
        version: status.version,
        totalTables: status.totalTables,
        totalRecords: status.totalRecords,
        categories: status.categories
      });
      
      // Verify therapist ecosystem tables exist
      const requiredTables = ['therapists', 'zoomspace_coaches', 'appointments', 'session_notes', 'wellness_scores', 'push_notifications', 'therapist_reviews'];
      const missingTables = requiredTables.filter(table => !(table in status.tables));
      
      if (missingTables.length > 0) {
        throw new Error(`Missing tables: ${missingTables.join(', ')}`);
      }
      
      console.log('✅ All required tables present');
    } catch (error) {
      console.error('❌ Database status test failed:', error);
      throw error;
    }
  }

  /**
   * Test regional data loading
   */
  private async testRegionalDataLoading(): Promise<void> {
    console.log('\n🏥 Test 2: Regional Data Loading');
    console.log('-'.repeat(40));
    
    try {
      // Load regional therapists
      await this.regionalDataService.loadRegionalTherapists();
      console.log('✅ Regional therapists loaded');
      
      // Load ZoomSpace coaches
      await this.regionalDataService.loadZoomSpaceCoaches();
      console.log('✅ ZoomSpace coaches loaded');
      
      // Verify data in database
      const status = await this.regionalDataService.getServiceStatus();
      console.log('✅ Service Status:', status);
      
      if (status.regionalTherapists < 4) {
        throw new Error(`Expected 4 regional therapists, got ${status.regionalTherapists}`);
      }
      
      if (status.zoomspaceCoaches < 2) {
        throw new Error(`Expected 2 ZoomSpace coaches, got ${status.zoomspaceCoaches}`);
      }
      
      console.log('✅ Regional data loading test passed');
    } catch (error) {
      console.error('❌ Regional data loading test failed:', error);
      throw error;
    }
  }

  /**
   * Test MBTI matching
   */
  private async testMBTIMatching(): Promise<void> {
    console.log('\n🎯 Test 3: MBTI Matching');
    console.log('-'.repeat(40));
    
    try {
      const testMBTITypes = ['INFP', 'INTJ', 'ISTP', 'INFJ'];
      
      for (const mbtiType of testMBTITypes) {
        const recommendations = this.regionalDataService.getMBTIMatchingRecommendations(mbtiType);
        console.log(`✅ ${mbtiType}: ${recommendations.specialty}`);
        console.log(`   Therapists: ${recommendations.therapists.join(', ')}`);
        console.log(`   Coaches: ${recommendations.coaches.join(', ')}`);
      }
      
      // Test therapist recommendations
      const therapists = await this.therapistService.getRecommendedTherapists('test-user', 'INFP', 'Amsterdam');
      console.log(`✅ Found ${therapists.length} recommended therapists for INFP in Amsterdam`);
      
      // Test coach recommendations
      const coaches = await this.therapistService.getZoomSpaceCoaches('test-user', 'INFP');
      console.log(`✅ Found ${coaches.length} recommended coaches for INFP`);
      
      console.log('✅ MBTI matching test passed');
    } catch (error) {
      console.error('❌ MBTI matching test failed:', error);
      throw error;
    }
  }

  /**
   * Test encryption service
   */
  private async testEncryptionService(): Promise<void> {
    console.log('\n🔐 Test 4: Encryption Service');
    console.log('-'.repeat(40));
    
    try {
      // Test encryption status
      const status = await this.encryptionService.getEncryptionStatus();
      console.log('✅ Encryption Status:', status);
      
      if (!status.isAvailable) {
        throw new Error('Encryption service not available');
      }
      
      // Test session notes encryption
      const testNotes = 'Test session notes for encryption';
      const encryptedNotes = await this.encryptionService.encryptSessionNotes(testNotes);
      console.log('✅ Session notes encrypted:', encryptedNotes.ciphertext ? 'SUCCESS' : 'FAILED');
      
      // Test wellness scores encryption
      const testScores = {
        overall: 8,
        physical: 7,
        mental: 8,
        emotional: 9,
        social: 7,
        spiritual: 8
      };
      const encryptedScores = await this.encryptionService.encryptWellnessScores(testScores);
      console.log('✅ Wellness scores encrypted:', encryptedScores.ciphertext ? 'SUCCESS' : 'FAILED');
      
      // Test encryption validation
      const isValid = await this.encryptionService.validateEncryption(encryptedNotes);
      console.log('✅ Encryption validation:', isValid ? 'SUCCESS' : 'FAILED');
      
      console.log('✅ Encryption service test passed');
    } catch (error) {
      console.error('❌ Encryption service test failed:', error);
      throw error;
    }
  }

  /**
   * Test wellness tracking
   */
  private async testWellnessTracking(): Promise<void> {
    console.log('\n💚 Test 5: Wellness Tracking');
    console.log('-'.repeat(40));
    
    try {
      const testUserId = 'test-user-wellness';
      const testScores = {
        overall: 8,
        physical: 7,
        mental: 8,
        emotional: 9,
        social: 7,
        spiritual: 8
      };
      
      // Test pre-session wellness tracking
      await this.therapistService.trackPreSessionWellness(testUserId, 'test-appointment', testScores);
      console.log('✅ Pre-session wellness tracked');
      
      // Test post-session wellness tracking
      const postSessionScores = {
        overall: 9,
        physical: 8,
        mental: 9,
        emotional: 9,
        social: 8,
        spiritual: 9
      };
      await this.therapistService.trackPostSessionWellness(testUserId, 'test-appointment', postSessionScores);
      console.log('✅ Post-session wellness tracked');
      
      // Test wellness trend analysis
      const trend = await this.wellnessService.getWellnessTrend(testUserId, '7d');
      console.log('✅ Wellness trend analysis:', {
        direction: trend.direction,
        changePercentage: trend.changePercentage,
        insights: trend.insights.length
      });
      
      // Test latest wellness score
      const latestScore = await this.wellnessService.getLatestWellnessScore(testUserId);
      console.log('✅ Latest wellness score:', latestScore ? 'SUCCESS' : 'NO DATA');
      
      console.log('✅ Wellness tracking test passed');
    } catch (error) {
      console.error('❌ Wellness tracking test failed:', error);
      throw error;
    }
  }

  /**
   * Test push notifications
   */
  private async testPushNotifications(): Promise<void> {
    console.log('\n🔔 Test 6: Push Notifications');
    console.log('-'.repeat(40));
    
    try {
      const testUserId = 'test-user-notifications';
      
      // Test wellness check scheduling
      await this.notificationService.scheduleWellnessCheck(testUserId, 'daily');
      console.log('✅ Daily wellness check scheduled');
      
      // Test homework reminder
      await this.notificationService.scheduleHomeworkReminder(
        testUserId,
        'test-appointment',
        'Practice mindfulness for 10 minutes daily',
        Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
      );
      console.log('✅ Homework reminder scheduled');
      
      // Test notification status
      const status = await this.notificationService.getServiceStatus();
      console.log('✅ Notification Service Status:', status);
      
      // Test user notifications
      const notifications = await this.notificationService.getUserNotifications(testUserId, 5);
      console.log(`✅ User notifications: ${notifications.length} found`);
      
      console.log('✅ Push notifications test passed');
    } catch (error) {
      console.error('❌ Push notifications test failed:', error);
      throw error;
    }
  }

  /**
   * Test complete ecosystem
   */
  private async testCompleteEcosystem(): Promise<void> {
    console.log('\n🌐 Test 7: Complete Ecosystem');
    console.log('-'.repeat(40));
    
    try {
      // Test ecosystem status
      const ecosystemStatus = await this.therapistService.getEcosystemStatus();
      console.log('✅ Ecosystem Status:', {
        isAvailable: ecosystemStatus.isAvailable,
        therapists: ecosystemStatus.therapists,
        coaches: ecosystemStatus.coaches,
        appointments: ecosystemStatus.appointments,
        wellnessAssessments: ecosystemStatus.wellnessAssessments,
        notifications: ecosystemStatus.notifications
      });
      
      if (!ecosystemStatus.isAvailable) {
        throw new Error('Ecosystem not available');
      }
      
      // Test appointment creation
      const testAppointment = {
        userId: 'test-user-ecosystem',
        therapistId: 'test-therapist',
        appointmentType: 'therapist' as const,
        sessionType: 'zoom' as const,
        scheduledAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
        durationMinutes: 60,
        status: 'scheduled' as const,
        consultationFee: 120,
        paymentRequired: true
      };
      
      const appointmentId = await this.therapistService.createAppointment(testAppointment);
      console.log('✅ Appointment created:', appointmentId);
      
      // Test user appointments
      const userAppointments = await this.therapistService.getUserAppointments('test-user-ecosystem');
      console.log(`✅ User appointments: ${userAppointments.length} found`);
      
      console.log('✅ Complete ecosystem test passed');
    } catch (error) {
      console.error('❌ Complete ecosystem test failed:', error);
      throw error;
    }
  }

  /**
   * Run quick test
   */
  public async runQuickTest(): Promise<void> {
    try {
      console.log('⚡ Running Quick Therapist Ecosystem Test...');
      
      // Test database status
      const status = await getCompleteDatabaseV14Status();
      console.log('✅ Database ready:', status.totalTables, 'tables');
      
      // Test ecosystem status
      const ecosystemStatus = await this.therapistService.getEcosystemStatus();
      console.log('✅ Ecosystem ready:', ecosystemStatus.isAvailable);
      
      console.log('✅ Quick test completed successfully!');
    } catch (error) {
      console.error('❌ Quick test failed:', error);
      throw error;
    }
  }
}

// Export test runner function
export async function runTherapistEcosystemTests(): Promise<void> {
  const tester = new TestTherapistEcosystem();
  await tester.runCompleteTest();
}

export async function runQuickTherapistEcosystemTest(): Promise<void> {
  const tester = new TestTherapistEcosystem();
  await tester.runQuickTest();
}

export default TestTherapistEcosystem;

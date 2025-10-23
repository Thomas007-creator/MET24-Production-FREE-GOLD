// @ts-nocheck
/**
 * Therapist Ecosystem Service - Hoofd Service
 * 
 * Integreert alle therapeut ecosystem services:
 * - Therapist management
 * - ZoomSpace coaches
 * - Session management
 * - Wellness tracking
 * - Push notifications
 * - Encryption & privacy
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { completeDatabaseV14 } from '../../database/v14/completeDatabaseV14';
import { EncryptionService } from './EncryptionService';
import { HolisticWellnessService, WellnessAssessment } from './HolisticWellnessService';
import { PushNotificationService, NotificationSchedule } from './PushNotificationService';

export interface Therapist {
  id: string;
  name: string;
  email: string;
  specialty: string;
  mbtiSpecialization: string[];
  rating: number;
  experienceYears: number;
  consultationFee: number;
  location: string;
  region: string;
  externalBookingUrl?: string;
  bookingSystemType?: string;
  bio: string;
  languages: string[];
  isActive: boolean;
  isExistingPractice: boolean;
  websiteUrl?: string;
}

export interface ZoomSpaceCoach {
  id: string;
  name: string;
  email: string;
  specialty: string;
  mbtiSpecialization: string[];
  rating: number;
  experienceYears: number;
  consultationFee: number;
  zoomspaceId: string;
  bio: string;
  languages: string[];
  isActive: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  therapistId?: string;
  coachId?: string;
  appointmentType: 'therapist' | 'coach';
  sessionType: 'live' | 'zoom' | 'hybrid';
  scheduledAt: number;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  consultationFee: number;
  zoomMeetingUrl?: string;
  goals?: string[];
  sessionFocus?: string;
  paymentRequired: boolean;
  paymentStatus?: string;
}

export interface SessionNotes {
  id: string;
  userId: string;
  appointmentId: string;
  therapistId?: string;
  coachId?: string;
  notesEncrypted: string;
  sessionDate: number;
  sessionDuration: number;
  sessionType: 'therapist' | 'coach';
  homeworkAssigned?: string;
  nextSessionGoals?: string;
  progressNotes?: string;
  isEncrypted: boolean;
  syncToServer: boolean;
}

export class TherapistEcosystemService {
  private static instance: TherapistEcosystemService;
  private encryptionService: EncryptionService;
  private wellnessService: HolisticWellnessService;
  private notificationService: PushNotificationService;

  private constructor() {
    this.encryptionService = EncryptionService.getInstance();
    this.wellnessService = HolisticWellnessService.getInstance();
    this.notificationService = PushNotificationService.getInstance();
  }

  public static getInstance(): TherapistEcosystemService {
    if (!TherapistEcosystemService.instance) {
      TherapistEcosystemService.instance = new TherapistEcosystemService();
    }
    return TherapistEcosystemService.instance;
  }

  /**
   * Get recommended therapists based on MBTI and location
   */
  public async getRecommendedTherapists(
    userId: string, 
    userMbtiType: string, 
    userLocation: string
  ): Promise<Therapist[]> {
    try {
      console.log(`🔍 Getting recommended therapists for ${userMbtiType} in ${userLocation}`);

      const therapistsCollection = completeDatabaseV14.get('therapists');
      const therapists = await therapistsCollection
        .query()
        .where('is_active', true)
        .fetch();

      // Filter and rank therapists
      const recommendedTherapists = this.rankTherapistsByMBTI(therapists, userMbtiType, userLocation);

      return recommendedTherapists.map(therapist => ({
        id: therapist.id,
        name: therapist.name,
        email: therapist.email,
        specialty: therapist.specialty,
        mbtiSpecialization: JSON.parse(therapist.mbtiSpecialization),
        rating: therapist.rating,
        experienceYears: therapist.experienceYears,
        consultationFee: therapist.consultationFee,
        location: therapist.location,
        region: therapist.region,
        externalBookingUrl: therapist.externalBookingUrl,
        bookingSystemType: therapist.bookingSystemType,
        bio: therapist.bio,
        languages: JSON.parse(therapist.languages),
        isActive: therapist.isActive,
        isExistingPractice: therapist.isExistingPractice,
        websiteUrl: therapist.websiteUrl
      }));
    } catch (error) {
      console.error('❌ Failed to get recommended therapists:', error);
      return [];
    }
  }

  /**
   * Get ZoomSpace coaches
   */
  public async getZoomSpaceCoaches(userId: string, userMbtiType: string): Promise<ZoomSpaceCoach[]> {
    try {
      console.log(`🎯 Getting ZoomSpace coaches for ${userMbtiType}`);

      const coachesCollection = completeDatabaseV14.get('zoomspace_coaches');
      const coaches = await coachesCollection
        .query()
        .where('is_active', true)
        .fetch();

      // Filter and rank coaches
      const recommendedCoaches = this.rankCoachesByMBTI(coaches, userMbtiType);

      return recommendedCoaches.map(coach => ({
        id: coach.id,
        name: coach.name,
        email: coach.email,
        specialty: coach.specialty,
        mbtiSpecialization: JSON.parse(coach.mbtiSpecialization),
        rating: coach.rating,
        experienceYears: coach.experienceYears,
        consultationFee: coach.consultationFee,
        zoomspaceId: coach.zoomspaceId,
        bio: coach.bio,
        languages: JSON.parse(coach.languages),
        isActive: coach.isActive
      }));
    } catch (error) {
      console.error('❌ Failed to get ZoomSpace coaches:', error);
      return [];
    }
  }

  /**
   * Create appointment
   */
  public async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<string> {
    try {
      console.log('📅 Creating appointment:', appointment);

      let appointmentId: string;

      await completeDatabaseV14.write(async () => {
        const appointmentsCollection = completeDatabaseV14.get('appointments');
        const newAppointment = await appointmentsCollection.create(appointmentRecord => {
          appointmentRecord.userId = appointment.userId;
          appointmentRecord.therapistId = appointment.therapistId;
          appointmentRecord.coachId = appointment.coachId;
          appointmentRecord.appointmentType = appointment.appointmentType;
          appointmentRecord.sessionType = appointment.sessionType;
          appointmentRecord.scheduledAt = appointment.scheduledAt;
          appointmentRecord.durationMinutes = appointment.durationMinutes;
          appointmentRecord.status = appointment.status;
          appointmentRecord.consultationFee = appointment.consultationFee;
          appointmentRecord.zoomMeetingUrl = appointment.zoomMeetingUrl;
          appointmentRecord.goals = appointment.goals ? JSON.stringify(appointment.goals) : null;
          appointmentRecord.sessionFocus = appointment.sessionFocus;
          appointmentRecord.paymentRequired = appointment.paymentRequired;
          appointmentRecord.paymentStatus = appointment.paymentStatus;
          appointmentRecord.createdAt = Date.now();
          appointmentRecord.updatedAt = Date.now();
        });

        appointmentId = newAppointment.id;
      });

      // Schedule notifications
      await this.scheduleAppointmentNotifications(appointmentId, appointment);

      console.log('✅ Appointment created successfully:', appointmentId);
      return appointmentId;
    } catch (error) {
      console.error('❌ Failed to create appointment:', error);
      throw error;
    }
  }

  /**
   * Schedule appointment notifications
   */
  private async scheduleAppointmentNotifications(appointmentId: string, appointment: Omit<Appointment, 'id'>): Promise<void> {
    try {
      const schedule: NotificationSchedule = {
        appointmentId,
        userId: appointment.userId,
        sessionDate: appointment.scheduledAt,
        sessionType: appointment.appointmentType,
        therapistName: appointment.therapistId ? 'Uw therapeut' : undefined,
        coachName: appointment.coachId ? 'Uw coach' : undefined
      };

      await this.notificationService.scheduleAppointmentReminders(schedule);
    } catch (error) {
      console.error('❌ Failed to schedule appointment notifications:', error);
    }
  }

  /**
   * Save session notes
   */
  public async saveSessionNotes(notes: Omit<SessionNotes, 'id'>): Promise<string> {
    try {
      console.log('📝 Saving session notes:', notes);

      // Encrypt notes
      const encryptedNotes = await this.encryptionService.encryptSessionNotes(notes.notesEncrypted);

      let notesId: string;

      await completeDatabaseV14.write(async () => {
        const sessionNotesCollection = completeDatabaseV14.get('session_notes');
        const newNotes = await sessionNotesCollection.create(notesRecord => {
          notesRecord.userId = notes.userId;
          notesRecord.appointmentId = notes.appointmentId;
          notesRecord.therapistId = notes.therapistId;
          notesRecord.coachId = notes.coachId;
          notesRecord.notesEncrypted = encryptedNotes.ciphertext;
          notesRecord.sessionDate = notes.sessionDate;
          notesRecord.sessionDuration = notes.sessionDuration;
          notesRecord.sessionType = notes.sessionType;
          notesRecord.homeworkAssigned = notes.homeworkAssigned;
          notesRecord.nextSessionGoals = notes.nextSessionGoals;
          notesRecord.progressNotes = notes.progressNotes;
          notesRecord.isEncrypted = true;
          notesRecord.syncToServer = false; // Privacy-first
          notesRecord.createdAt = Date.now();
          notesRecord.updatedAt = Date.now();
        });

        notesId = newNotes.id;
      });

      console.log('✅ Session notes saved successfully:', notesId);
      return notesId;
    } catch (error) {
      console.error('❌ Failed to save session notes:', error);
      throw error;
    }
  }

  /**
   * Track pre-session wellness
   */
  public async trackPreSessionWellness(
    userId: string, 
    appointmentId: string, 
    scores: any
  ): Promise<void> {
    try {
      console.log('📊 Tracking pre-session wellness:', { userId, appointmentId });

      const assessment: WellnessAssessment = {
        userId,
        appointmentId,
        scores,
        assessmentType: 'pre_session',
        timePoint: 'T1' // Pre-session
      };

      await this.wellnessService.trackWellnessScore(assessment);
      console.log('✅ Pre-session wellness tracked successfully');
    } catch (error) {
      console.error('❌ Failed to track pre-session wellness:', error);
      throw error;
    }
  }

  /**
   * Track post-session wellness
   */
  public async trackPostSessionWellness(
    userId: string, 
    appointmentId: string, 
    scores: any
  ): Promise<void> {
    try {
      console.log('📊 Tracking post-session wellness:', { userId, appointmentId });

      const assessment: WellnessAssessment = {
        userId,
        appointmentId,
        scores,
        assessmentType: 'post_session',
        timePoint: 'T2' // Post-session
      };

      await this.wellnessService.trackWellnessScore(assessment);
      console.log('✅ Post-session wellness tracked successfully');
    } catch (error) {
      console.error('❌ Failed to track post-session wellness:', error);
      throw error;
    }
  }

  /**
   * Get user appointments
   */
  public async getUserAppointments(userId: string): Promise<Appointment[]> {
    try {
      const appointmentsCollection = completeDatabaseV14.get('appointments');
      const appointments = await appointmentsCollection
        .query()
        .where('user_id', userId)
        .sortBy('scheduled_at', 'desc')
        .fetch();

      return appointments.map(appointment => ({
        id: appointment.id,
        userId: appointment.userId,
        therapistId: appointment.therapistId,
        coachId: appointment.coachId,
        appointmentType: appointment.appointmentType,
        sessionType: appointment.sessionType,
        scheduledAt: appointment.scheduledAt,
        durationMinutes: appointment.durationMinutes,
        status: appointment.status,
        consultationFee: appointment.consultationFee,
        zoomMeetingUrl: appointment.zoomMeetingUrl,
        goals: appointment.goals ? JSON.parse(appointment.goals) : undefined,
        sessionFocus: appointment.sessionFocus,
        paymentRequired: appointment.paymentRequired,
        paymentStatus: appointment.paymentStatus
      }));
    } catch (error) {
      console.error('❌ Failed to get user appointments:', error);
      return [];
    }
  }

  /**
   * Rank therapists by MBTI compatibility
   */
  private rankTherapistsByMBTI(therapists: any[], userMbtiType: string, userLocation: string): any[] {
    return therapists
      .filter(therapist => {
        const mbtiSpecialization = JSON.parse(therapist.mbtiSpecialization);
        return mbtiSpecialization.includes(userMbtiType) || 
               therapist.location.toLowerCase().includes(userLocation.toLowerCase());
      })
      .sort((a, b) => {
        // Sort by rating, then by experience
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.experienceYears - a.experienceYears;
      });
  }

  /**
   * Rank coaches by MBTI compatibility
   */
  private rankCoachesByMBTI(coaches: any[], userMbtiType: string): any[] {
    return coaches
      .filter(coach => {
        const mbtiSpecialization = JSON.parse(coach.mbtiSpecialization);
        return mbtiSpecialization.includes(userMbtiType);
      })
      .sort((a, b) => {
        // Sort by rating, then by experience
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.experienceYears - a.experienceYears;
      });
  }

  /**
   * Get ecosystem status
   */
  public async getEcosystemStatus(): Promise<{
    isAvailable: boolean;
    therapists: number;
    coaches: number;
    appointments: number;
    wellnessAssessments: number;
    notifications: number;
    encryptionStatus: any;
  }> {
    try {
      const therapistsCollection = completeDatabaseV14.get('therapists');
      const coachesCollection = completeDatabaseV14.get('zoomspace_coaches');
      const appointmentsCollection = completeDatabaseV14.get('appointments');
      const wellnessCollection = completeDatabaseV14.get('wellness_scores');
      const notificationsCollection = completeDatabaseV14.get('push_notifications');

      const [therapists, coaches, appointments, wellnessAssessments, notifications] = await Promise.all([
        therapistsCollection.query().fetchCount(),
        coachesCollection.query().fetchCount(),
        appointmentsCollection.query().fetchCount(),
        wellnessCollection.query().fetchCount(),
        notificationsCollection.query().fetchCount()
      ]);

      const encryptionStatus = await this.encryptionService.getEncryptionStatus();

      return {
        isAvailable: true,
        therapists,
        coaches,
        appointments,
        wellnessAssessments,
        notifications,
        encryptionStatus
      };
    } catch (error) {
      console.error('❌ Failed to get ecosystem status:', error);
      return {
        isAvailable: false,
        therapists: 0,
        coaches: 0,
        appointments: 0,
        wellnessAssessments: 0,
        notifications: 0,
        encryptionStatus: { isAvailable: false }
      };
    }
  }
}

export default TherapistEcosystemService;

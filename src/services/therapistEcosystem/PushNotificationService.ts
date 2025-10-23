// @ts-nocheck
/**
 * Push Notification Service voor Therapist Ecosystem
 * 
 * Bevat alle functionaliteiten voor push berichten:
 * - Appointment reminders
 * - Session preparation
 * - Wellness checks
 * - Homework reminders
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { completeDatabaseV14 } from '../../database/v14/completeDatabaseV14';

export interface PushNotification {
  id?: string;
  userId: string;
  appointmentId?: string;
  title: string;
  message: string;
  type: 'appointment_reminder' | 'session_prep' | 'wellness_check' | 'homework_reminder';
  scheduledFor: number;
  sentAt?: number;
  isSent: boolean;
  isRead: boolean;
  actionUrl?: string;
  actionData?: any;
}

export interface NotificationSchedule {
  appointmentId: string;
  userId: string;
  sessionDate: number;
  sessionType: 'therapist' | 'coach';
  therapistName?: string;
  coachName?: string;
}

export class PushNotificationService {
  private static instance: PushNotificationService;

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private async initializeService() {
    try {
      console.log('🔔 Initializing Push Notification Service...');
      // Initialize push notification service
      // This would integrate with device push notification APIs
    } catch (error) {
      console.error('❌ Failed to initialize push notification service:', error);
      throw error;
    }
  }

  /**
   * Schedule appointment reminders
   */
  public async scheduleAppointmentReminders(schedule: NotificationSchedule): Promise<void> {
    try {
      console.log('📅 Scheduling appointment reminders:', schedule);

      const reminders = this.generateAppointmentReminders(schedule);
      
      for (const reminder of reminders) {
        await this.scheduleNotification(reminder);
      }

      console.log('✅ Appointment reminders scheduled successfully');
    } catch (error) {
      console.error('❌ Failed to schedule appointment reminders:', error);
      throw error;
    }
  }

  /**
   * Generate appointment reminder notifications
   */
  private generateAppointmentReminders(schedule: NotificationSchedule): PushNotification[] {
    const reminders: PushNotification[] = [];
    const sessionDate = new Date(schedule.sessionDate);
    const therapistName = schedule.therapistName || schedule.coachName || 'Uw therapeut/coach';

    // 24 hours before
    const dayBefore = new Date(sessionDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    
    reminders.push({
      userId: schedule.userId,
      appointmentId: schedule.appointmentId,
      title: 'Afspraak herinnering',
      message: `Uw afspraak met ${therapistName} is morgen om ${sessionDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`,
      type: 'appointment_reminder',
      scheduledFor: dayBefore.getTime(),
      isSent: false,
      isRead: false,
      actionUrl: `/appointments/${schedule.appointmentId}`,
      actionData: { appointmentId: schedule.appointmentId }
    });

    // 2 hours before
    const twoHoursBefore = new Date(sessionDate);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
    
    reminders.push({
      userId: schedule.userId,
      appointmentId: schedule.appointmentId,
      title: 'Sessie voorbereiding',
      message: `Uw sessie met ${therapistName} begint over 2 uur. Tijd om voor te bereiden!`,
      type: 'session_prep',
      scheduledFor: twoHoursBefore.getTime(),
      isSent: false,
      isRead: false,
      actionUrl: `/sessions/prepare/${schedule.appointmentId}`,
      actionData: { appointmentId: schedule.appointmentId, preparationType: 'pre_session' }
    });

    // 15 minutes before
    const fifteenMinutesBefore = new Date(sessionDate);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);
    
    reminders.push({
      userId: schedule.userId,
      appointmentId: schedule.appointmentId,
      title: 'Sessie start binnenkort',
      message: `Uw sessie met ${therapistName} begint over 15 minuten.`,
      type: 'appointment_reminder',
      scheduledFor: fifteenMinutesBefore.getTime(),
      isSent: false,
      isRead: false,
      actionUrl: `/sessions/join/${schedule.appointmentId}`,
      actionData: { appointmentId: schedule.appointmentId }
    });

    return reminders;
  }

  /**
   * Schedule wellness check notifications
   */
  public async scheduleWellnessCheck(userId: string, frequency: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    try {
      console.log(`💚 Scheduling ${frequency} wellness check for user ${userId}`);

      const wellnessCheck = this.generateWellnessCheckNotification(userId, frequency);
      await this.scheduleNotification(wellnessCheck);

      console.log('✅ Wellness check scheduled successfully');
    } catch (error) {
      console.error('❌ Failed to schedule wellness check:', error);
      throw error;
    }
  }

  /**
   * Generate wellness check notification
   */
  private generateWellnessCheckNotification(userId: string, frequency: string): PushNotification {
    const now = new Date();
    let scheduledFor: number;
    let message: string;

    switch (frequency) {
      case 'daily':
        scheduledFor = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0).getTime();
        message = 'Hoe voelt u zich vandaag? Neem even de tijd voor uw dagelijkse welzijn check.';
        break;
      case 'weekly':
        scheduledFor = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 10, 0).getTime();
        message = 'Tijd voor uw wekelijkse welzijn evaluatie. Hoe was uw week?';
        break;
      case 'monthly':
        scheduledFor = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), 11, 0).getTime();
        message = 'Maandelijkse welzijn check. Reflecteer op uw groei en welzijn.';
        break;
      default:
        scheduledFor = now.getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
        message = 'Hoe voelt u zich? Neem even de tijd voor uw welzijn check.';
    }

    return {
      userId,
      title: 'Welzijn Check',
      message,
      type: 'wellness_check',
      scheduledFor,
      isSent: false,
      isRead: false,
      actionUrl: '/wellness/check',
      actionData: { frequency, checkType: 'wellness_assessment' }
    };
  }

  /**
   * Schedule homework reminder
   */
  public async scheduleHomeworkReminder(
    userId: string, 
    appointmentId: string, 
    homeworkDescription: string,
    dueDate: number
  ): Promise<void> {
    try {
      console.log('📚 Scheduling homework reminder:', { userId, appointmentId, homeworkDescription });

      const reminder: PushNotification = {
        userId,
        appointmentId,
        title: 'Huiswerk herinnering',
        message: `Vergeet niet: ${homeworkDescription}`,
        type: 'homework_reminder',
        scheduledFor: dueDate,
        isSent: false,
        isRead: false,
        actionUrl: `/homework/${appointmentId}`,
        actionData: { appointmentId, homeworkDescription }
      };

      await this.scheduleNotification(reminder);
      console.log('✅ Homework reminder scheduled successfully');
    } catch (error) {
      console.error('❌ Failed to schedule homework reminder:', error);
      throw error;
    }
  }

  /**
   * Schedule notification in database
   */
  private async scheduleNotification(notification: PushNotification): Promise<void> {
    try {
      await completeDatabaseV14.write(async () => {
        const notificationsCollection = completeDatabaseV14.get('push_notifications');
        await notificationsCollection.create(notificationRecord => {
          notificationRecord.userId = notification.userId;
          notificationRecord.appointmentId = notification.appointmentId;
          notificationRecord.title = notification.title;
          notificationRecord.message = notification.message;
          notificationRecord.type = notification.type;
          notificationRecord.scheduledFor = notification.scheduledFor;
          notificationRecord.sentAt = notification.sentAt;
          notificationRecord.isSent = notification.isSent;
          notificationRecord.isRead = notification.isRead;
          notificationRecord.actionUrl = notification.actionUrl;
          notificationRecord.actionData = notification.actionData ? JSON.stringify(notification.actionData) : null;
          notificationRecord.createdAt = Date.now();
          notificationRecord.updatedAt = Date.now();
        });
      });
    } catch (error) {
      console.error('❌ Failed to schedule notification:', error);
      throw error;
    }
  }

  /**
   * Send pending notifications
   */
  public async sendPendingNotifications(): Promise<void> {
    try {
      console.log('📤 Sending pending notifications...');

      const notificationsCollection = completeDatabaseV14.get('push_notifications');
      const pendingNotifications = await notificationsCollection
        .query()
        .where('is_sent', false)
        .where('scheduled_for', '<=', Date.now())
        .fetch();

      for (const notification of pendingNotifications) {
        await this.sendNotification(notification);
      }

      console.log(`✅ Sent ${pendingNotifications.length} pending notifications`);
    } catch (error) {
      console.error('❌ Failed to send pending notifications:', error);
      throw error;
    }
  }

  /**
   * Send individual notification
   */
  private async sendNotification(notification: any): Promise<void> {
    try {
      // This would integrate with device push notification APIs
      console.log(`📱 Sending notification: ${notification.title}`);
      
      // Mark as sent
      await completeDatabaseV14.write(async () => {
        await notification.update(notificationRecord => {
          notificationRecord.isSent = true;
          notificationRecord.sentAt = Date.now();
          notificationRecord.updatedAt = Date.now();
        });
      });
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notificationsCollection = completeDatabaseV14.get('push_notifications');
      const notification = await notificationsCollection.find(notificationId);
      
      await completeDatabaseV14.write(async () => {
        await notification.update(notificationRecord => {
          notificationRecord.isRead = true;
          notificationRecord.updatedAt = Date.now();
        });
      });
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  public async getUserNotifications(userId: string, limit: number = 20): Promise<PushNotification[]> {
    try {
      const notificationsCollection = completeDatabaseV14.get('push_notifications');
      const notifications = await notificationsCollection
        .query()
        .where('user_id', userId)
        .sortBy('created_at', 'desc')
        .take(limit)
        .fetch();

      return notifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        appointmentId: notification.appointmentId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        scheduledFor: notification.scheduledFor,
        sentAt: notification.sentAt,
        isSent: notification.isSent,
        isRead: notification.isRead,
        actionUrl: notification.actionUrl,
        actionData: notification.actionData ? JSON.parse(notification.actionData) : null
      }));
    } catch (error) {
      console.error('❌ Failed to get user notifications:', error);
      return [];
    }
  }

  /**
   * Get service status
   */
  public async getServiceStatus(): Promise<{
    isAvailable: boolean;
    totalNotifications: number;
    pendingNotifications: number;
    sentNotifications: number;
  }> {
    try {
      const notificationsCollection = completeDatabaseV14.get('push_notifications');
      const totalNotifications = await notificationsCollection.query().fetchCount();
      const pendingNotifications = await notificationsCollection
        .query()
        .where('is_sent', false)
        .fetchCount();
      const sentNotifications = await notificationsCollection
        .query()
        .where('is_sent', true)
        .fetchCount();

      return {
        isAvailable: true,
        totalNotifications,
        pendingNotifications,
        sentNotifications
      };
    } catch (error) {
      console.error('❌ Failed to get service status:', error);
      return {
        isAvailable: false,
        totalNotifications: 0,
        pendingNotifications: 0,
        sentNotifications: 0
      };
    }
  }
}

export default PushNotificationService;

// @ts-nocheck
/**
 * Regional Therapist Data Service
 * 
 * Bevat alle regionale therapeuten en coaches data:
 * - 4 regionale therapeuten (Amsterdam, Utrecht, Den Haag, Rotterdam)
 * - ZoomSpace coaches voor online begeleiding
 * - MBTI-geoptimaliseerde matching
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { completeDatabaseV14 } from '../../database/v14/completeDatabaseV14';

export interface RegionalTherapist {
  name: string;
  email: string;
  phone?: string;
  specialty: string;
  mbtiSpecialization: string[];
  rating: number;
  experienceYears: number;
  consultationFee: number;
  location: string;
  region: string;
  availability: any;
  externalBookingUrl?: string;
  bookingSystemType?: string;
  bookingInstructions?: string;
  bio: string;
  languages: string[];
  certifications?: string[];
  isActive: boolean;
  isExistingPractice: boolean;
  websiteUrl?: string;
  lastSynced: number;
  syncRegion: string;
}

export interface ZoomSpaceCoach {
  name: string;
  email: string;
  specialty: string;
  mbtiSpecialization: string[];
  rating: number;
  experienceYears: number;
  consultationFee: number;
  zoomspaceId: string;
  zoomspaceProfileUrl?: string;
  zoomMeetingRoom?: string;
  bio: string;
  languages: string[];
  certifications?: string[];
  isActive: boolean;
  lastSynced: number;
  syncRegion: string;
}

export class RegionalTherapistDataService {
  private static instance: RegionalTherapistDataService;

  private constructor() {}

  public static getInstance(): RegionalTherapistDataService {
    if (!RegionalTherapistDataService.instance) {
      RegionalTherapistDataService.instance = new RegionalTherapistDataService();
    }
    return RegionalTherapistDataService.instance;
  }

  /**
   * Get all regional therapists data
   */
  public getRegionalTherapists(): RegionalTherapist[] {
    return [
      // Amsterdam - Dr. Sarah van der Berg
      {
        name: 'Dr. Sarah van der Berg',
        email: 'sarah@mbti-coaching-amsterdam.nl',
        phone: '+31 20 123 4567',
        specialty: 'MBTI Coaching & Persoonlijkheidsontwikkeling',
        mbtiSpecialization: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
        rating: 4.9,
        experienceYears: 8,
        consultationFee: 120.00,
        location: 'Amsterdam',
        region: 'Noord-Holland',
        availability: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
          saturday: { start: '10:00', end: '14:00' },
          sunday: 'closed'
        },
        externalBookingUrl: 'https://calendly.com/dr-sarah-van-der-berg',
        bookingSystemType: 'calendly',
        bookingInstructions: 'Klik op de link om direct een afspraak in te plannen via Calendly.',
        bio: 'Gespecialiseerd in creatieve therapie en persoonlijkheidsontwikkeling voor gevoelige types. Dr. Sarah helpt mensen hun unieke MBTI-stijl te omarmen en te ontwikkelen.',
        languages: ['Nederlands', 'Engels'],
        certifications: ['MBTI Practitioner', 'Creative Therapy Specialist', 'Personality Development Coach'],
        isActive: true,
        isExistingPractice: false,
        websiteUrl: 'https://mbti-coaching-amsterdam.nl',
        lastSynced: Date.now(),
        syncRegion: 'amsterdam'
      },

      // Utrecht - Dr. Michael Chen
      {
        name: 'Dr. Michael Chen',
        email: 'michael@relatie-coaching-utrecht.nl',
        phone: '+31 30 234 5678',
        specialty: 'Relatie Coaching & MBTI',
        mbtiSpecialization: ['INFJ', 'ENFJ', 'ISFJ', 'ESFJ'],
        rating: 4.8,
        experienceYears: 12,
        consultationFee: 110.00,
        location: 'Utrecht',
        region: 'Utrecht',
        availability: {
          monday: { start: '08:00', end: '18:00' },
          tuesday: { start: '08:00', end: '18:00' },
          wednesday: { start: '08:00', end: '18:00' },
          thursday: { start: '08:00', end: '18:00' },
          friday: { start: '08:00', end: '16:00' },
          saturday: 'closed',
          sunday: 'closed'
        },
        externalBookingUrl: 'https://dr-michael-chen.acuityscheduling.com',
        bookingSystemType: 'acuity',
        bookingInstructions: 'Plan uw afspraak via Acuity Scheduling. Selecteer uw voorkeurstijd en ontvang direct een bevestiging.',
        bio: 'Expert in relatiecoaching en MBTI-gedreven communicatie. Dr. Michael helpt stellen en individuen betere relaties op te bouwen door begrip van persoonlijkheidstypes.',
        languages: ['Nederlands', 'Engels', 'Mandarijn'],
        certifications: ['Relationship Coach', 'MBTI Practitioner', 'Communication Specialist'],
        isActive: true,
        isExistingPractice: false,
        websiteUrl: 'https://relatie-coaching-utrecht.nl',
        lastSynced: Date.now(),
        syncRegion: 'utrecht'
      },

      // Den Haag - Dr. Lisa van der Meer
      {
        name: 'Dr. Lisa van der Meer',
        email: 'lisa@carriere-transitie-denhaag.nl',
        phone: '+31 70 345 6789',
        specialty: 'Carrière Transitie & MBTI',
        mbtiSpecialization: ['INTJ', 'ENTJ', 'ISTJ', 'ESTJ'],
        rating: 4.7,
        experienceYears: 15,
        consultationFee: 115.00,
        location: 'Den Haag',
        region: 'Zuid-Holland',
        availability: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
          saturday: { start: '09:00', end: '13:00' },
          sunday: 'closed'
        },
        externalBookingUrl: 'https://dr-lisa-van-der-meer.youcanbook.me',
        bookingSystemType: 'youcanbookme',
        bookingInstructions: 'Boek uw carrière coaching sessie via YouCanBookMe. Kies uw gewenste tijd en ontvang direct een bevestiging.',
        bio: 'Gespecialiseerd in carrière transitie en MBTI-gedreven loopbaanbegeleiding. Dr. Lisa helpt professionals hun ideale carrièrepad te vinden gebaseerd op hun persoonlijkheidstype.',
        languages: ['Nederlands', 'Engels', 'Frans'],
        certifications: ['Career Coach', 'MBTI Practitioner', 'Executive Coach'],
        isActive: true,
        isExistingPractice: false,
        websiteUrl: 'https://carriere-transitie-denhaag.nl',
        lastSynced: Date.now(),
        syncRegion: 'den_haag'
      },

      // Utrecht & Houten - Drs. Thomas M. Pfaff (Jouw Praktijk)
      {
        name: 'Drs. Thomas M. Pfaff',
        email: 'thomas@psychosomatische-osteopathie.nl',
        phone: '+31 644 24 82 60',
        specialty: 'Psychosomatische Osteopathie & MBTI',
        mbtiSpecialization: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
        rating: 4.9,
        experienceYears: 20,
        consultationFee: 120.00,
        location: 'Utrecht & Houten',
        region: 'Utrecht',
        availability: {
          monday: { start: '08:00', end: '18:00' },
          tuesday: { start: '08:00', end: '18:00' },
          wednesday: { start: '08:00', end: '18:00' },
          thursday: { start: '08:00', end: '18:00' },
          friday: { start: '08:00', end: '16:00' },
          saturday: { start: '09:00', end: '13:00' },
          sunday: 'closed'
        },
        externalBookingUrl: 'https://psychosomatische-osteopathie.nl/afspraak-maken/',
        bookingSystemType: 'custom',
        bookingInstructions: 'Maak een afspraak via onze website. Unieke combinatie van psychosomatische osteopathie en MBTI voor sensorische en beoordelende types. Praktijk in Utrecht en Houten.',
        bio: 'Psychosomatische osteopaat gespecialiseerd in de verbinding tussen lichaam en geest. Unieke combinatie van osteopathie en MBTI voor sensorische en beoordelende types. Enige therapeut in Nederland die psychosomatische osteopathie combineert met MBTI. Praktijk in Utrecht en Houten.',
        languages: ['Nederlands', 'Engels', 'Duits'],
        certifications: ['Osteopaat D.O.', 'Psychosomatische Osteopathie Specialist', 'MBTI Practitioner'],
        isActive: true,
        isExistingPractice: true,
        websiteUrl: 'https://psychosomatische-osteopathie.nl',
        lastSynced: Date.now(),
        syncRegion: 'utrecht_houten'
      }
    ];
  }

  /**
   * Get ZoomSpace coaches data
   */
  public getZoomSpaceCoaches(): ZoomSpaceCoach[] {
    return [
      {
        name: 'Emma de Vries',
        email: 'emma@zoomspace-coaching.nl',
        specialty: 'Mindfulness & MBTI',
        mbtiSpecialization: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
        rating: 4.8,
        experienceYears: 6,
        consultationFee: 0, // Gratis
        zoomspaceId: 'emma-devries-coach',
        zoomspaceProfileUrl: 'https://zoomspace.nl/coaches/emma-devries',
        zoomMeetingRoom: 'https://zoomspace.nl/meet/emma-devries',
        bio: 'Online mindfulness coach gespecialiseerd in MBTI-gedreven meditatie en stressreductie. Gratis sessies voor gevoelige types.',
        languages: ['Nederlands', 'Engels'],
        certifications: ['Mindfulness Coach', 'MBTI Practitioner', 'Meditation Teacher'],
        isActive: true,
        lastSynced: Date.now(),
        syncRegion: 'online'
      },
      {
        name: 'Alex van der Berg',
        email: 'alex@zoomspace-coaching.nl',
        specialty: 'Stress Management & MBTI',
        mbtiSpecialization: ['INTJ', 'ENTJ', 'ISTJ', 'ESTJ'],
        rating: 4.7,
        experienceYears: 8,
        consultationFee: 0, // Gratis
        zoomspaceId: 'alex-van-der-berg-coach',
        zoomspaceProfileUrl: 'https://zoomspace.nl/coaches/alex-van-der-berg',
        zoomMeetingRoom: 'https://zoomspace.nl/meet/alex-van-der-berg',
        bio: 'Online stress management coach gespecialiseerd in MBTI-gedreven coping strategieën. Gratis sessies voor analytische types.',
        languages: ['Nederlands', 'Engels'],
        certifications: ['Stress Management Coach', 'MBTI Practitioner', 'Cognitive Behavioral Therapy'],
        isActive: true,
        lastSynced: Date.now(),
        syncRegion: 'online'
      }
    ];
  }

  /**
   * Load regional therapists into database
   */
  public async loadRegionalTherapists(): Promise<void> {
    try {
      console.log('🏥 Loading regional therapists into database...');

      const therapists = this.getRegionalTherapists();
      
      await completeDatabaseV14.write(async () => {
        const therapistsCollection = completeDatabaseV14.get('therapists');
        
        for (const therapist of therapists) {
          await therapistsCollection.create(therapistRecord => {
            therapistRecord.name = therapist.name;
            therapistRecord.email = therapist.email;
            therapistRecord.phone = therapist.phone;
            therapistRecord.specialty = therapist.specialty;
            therapistRecord.mbtiSpecialization = JSON.stringify(therapist.mbtiSpecialization);
            therapistRecord.rating = therapist.rating;
            therapistRecord.experienceYears = therapist.experienceYears;
            therapistRecord.consultationFee = therapist.consultationFee;
            therapistRecord.location = therapist.location;
            therapistRecord.region = therapist.region;
            therapistRecord.availability = JSON.stringify(therapist.availability);
            therapistRecord.externalBookingUrl = therapist.externalBookingUrl;
            therapistRecord.bookingSystemType = therapist.bookingSystemType;
            therapistRecord.bookingInstructions = therapist.bookingInstructions;
            therapistRecord.bio = therapist.bio;
            therapistRecord.languages = JSON.stringify(therapist.languages);
            therapistRecord.certifications = therapist.certifications ? JSON.stringify(therapist.certifications) : null;
            therapistRecord.isActive = therapist.isActive;
            therapistRecord.isExistingPractice = therapist.isExistingPractice;
            therapistRecord.websiteUrl = therapist.websiteUrl;
            therapistRecord.lastSynced = therapist.lastSynced;
            therapistRecord.syncRegion = therapist.syncRegion;
            therapistRecord.createdAt = Date.now();
            therapistRecord.updatedAt = Date.now();
            therapistRecord.createdBy = 'system';
          });
        }
      });

      console.log(`✅ Loaded ${therapists.length} regional therapists successfully`);
    } catch (error) {
      console.error('❌ Failed to load regional therapists:', error);
      throw error;
    }
  }

  /**
   * Load ZoomSpace coaches into database
   */
  public async loadZoomSpaceCoaches(): Promise<void> {
    try {
      console.log('🎯 Loading ZoomSpace coaches into database...');

      const coaches = this.getZoomSpaceCoaches();
      
      await completeDatabaseV14.write(async () => {
        const coachesCollection = completeDatabaseV14.get('zoomspace_coaches');
        
        for (const coach of coaches) {
          await coachesCollection.create(coachRecord => {
            coachRecord.name = coach.name;
            coachRecord.email = coach.email;
            coachRecord.specialty = coach.specialty;
            coachRecord.mbtiSpecialization = JSON.stringify(coach.mbtiSpecialization);
            coachRecord.rating = coach.rating;
            coachRecord.experienceYears = coach.experienceYears;
            coachRecord.consultationFee = coach.consultationFee;
            coachRecord.zoomspaceId = coach.zoomspaceId;
            coachRecord.zoomspaceProfileUrl = coach.zoomspaceProfileUrl;
            coachRecord.zoomMeetingRoom = coach.zoomMeetingRoom;
            coachRecord.bio = coach.bio;
            coachRecord.languages = JSON.stringify(coach.languages);
            coachRecord.certifications = coach.certifications ? JSON.stringify(coach.certifications) : null;
            coachRecord.isActive = coach.isActive;
            coachRecord.lastSynced = coach.lastSynced;
            coachRecord.syncRegion = coach.syncRegion;
            coachRecord.createdAt = Date.now();
            coachRecord.updatedAt = Date.now();
            coachRecord.createdBy = 'system';
          });
        }
      });

      console.log(`✅ Loaded ${coaches.length} ZoomSpace coaches successfully`);
    } catch (error) {
      console.error('❌ Failed to load ZoomSpace coaches:', error);
      throw error;
    }
  }

  /**
   * Get MBTI matching recommendations
   */
  public getMBTIMatchingRecommendations(userMbtiType: string): {
    therapists: string[];
    coaches: string[];
    specialty: string;
  } {
    const mbtiMatching = {
      // Analytische & Intuïtieve Types
      'INTP': {
        specialty: 'MBTI Coaching & Persoonlijkheidsontwikkeling',
        therapists: ['Dr. Sarah van der Berg'],
        coaches: ['Emma de Vries']
      },
      'INTJ': {
        specialty: 'Carrière Transitie & MBTI',
        therapists: ['Dr. Lisa van der Meer'],
        coaches: ['Alex van der Berg']
      },
      'ENTP': {
        specialty: 'MBTI Coaching & Persoonlijkheidsontwikkeling',
        therapists: ['Dr. Sarah van der Berg'],
        coaches: ['Emma de Vries']
      },
      'ENTJ': {
        specialty: 'Carrière Transitie & MBTI',
        therapists: ['Dr. Lisa van der Meer'],
        coaches: ['Alex van der Berg']
      },
      
      // Sensorische & Beoordelende Types (Psychosomatische Osteopathie)
      'ISTP': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Alex van der Berg']
      },
      'ISFP': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Emma de Vries']
      },
      'ESTP': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Alex van der Berg']
      },
      'ESFP': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Emma de Vries']
      },
      
      // Andere types...
      'INFJ': {
        specialty: 'Relatie Coaching & MBTI',
        therapists: ['Dr. Michael Chen'],
        coaches: ['Emma de Vries']
      },
      'ENFJ': {
        specialty: 'Relatie Coaching & MBTI',
        therapists: ['Dr. Michael Chen'],
        coaches: ['Emma de Vries']
      },
      'ISFJ': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Emma de Vries']
      },
      'ESFJ': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Emma de Vries']
      },
      'ISTJ': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Alex van der Berg']
      },
      'ESTJ': {
        specialty: 'Psychosomatische Osteopathie & MBTI',
        therapists: ['Drs. Thomas M. Pfaff'],
        coaches: ['Alex van der Berg']
      }
    };

    return mbtiMatching[userMbtiType] || {
      specialty: 'MBTI Coaching & Persoonlijkheidsontwikkeling',
      therapists: ['Dr. Sarah van der Berg'],
      coaches: ['Emma de Vries']
    };
  }

  /**
   * Get service status
   */
  public async getServiceStatus(): Promise<{
    isAvailable: boolean;
    regionalTherapists: number;
    zoomspaceCoaches: number;
    totalMBTITypes: number;
  }> {
    try {
      const therapistsCollection = completeDatabaseV14.get('therapists');
      const coachesCollection = completeDatabaseV14.get('zoomspace_coaches');
      
      const [regionalTherapists, zoomspaceCoaches] = await Promise.all([
        therapistsCollection.query().fetchCount(),
        coachesCollection.query().fetchCount()
      ]);

      return {
        isAvailable: true,
        regionalTherapists,
        zoomspaceCoaches,
        totalMBTITypes: 16
      };
    } catch (error) {
      console.error('❌ Failed to get service status:', error);
      return {
        isAvailable: false,
        regionalTherapists: 0,
        zoomspaceCoaches: 0,
        totalMBTITypes: 0
      };
    }
  }
}

export default RegionalTherapistDataService;

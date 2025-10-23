/**
 * V14 Database Schema
 * 
 * Schema definitie voor WatermelonDB V14
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { appSchema } from "@nozbe/watermelondb";

// Import modulaire schema's
import { userManagementSchema } from "./schemas/userManagement";
import { onboardingSchema } from "./schemas/onboarding";
import { chatJournalSchema } from "./schemas/chatJournal";
import { aiMachineLearningSchema } from "./schemas/aiMachineLearning";
import { contentManagementSchema } from "./schemas/contentManagement";
import { subscriptionPaymentSchema } from "./schemas/subscriptionPayment";
import { met24DomainsSchema } from "./schemas/met24Domains";
import { levensgebiedenSchema } from "./schemas/levensgebieden";
import { tasksProductivitySchema } from "./schemas/tasksProductivity";
import { syncStatusSchema } from "./schemas/syncStatus";
import { analyticsTrackingSchema } from "./schemas/analyticsTracking";
import { extensionsSchema } from "./schemas/extensions";
import { activeImaginationSchema } from "./schemas/activeImagination";
import { enhancedJournalingSchema } from "./schemas/enhancedJournaling";
import { challengesSchema } from "./schemas/challenges";

// Combineer alle schema's tot V14
export const schemaV14 = appSchema({
  version: 14,
  tables: [
    ...userManagementSchema,
    ...onboardingSchema,
    ...chatJournalSchema,
    ...aiMachineLearningSchema,
    ...contentManagementSchema,
    ...subscriptionPaymentSchema,
    ...met24DomainsSchema,
    ...levensgebiedenSchema,
    ...tasksProductivitySchema,
    ...syncStatusSchema,
    ...analyticsTrackingSchema,
    ...extensionsSchema,
    ...activeImaginationSchema,
    ...enhancedJournalingSchema,
    ...challengesSchema,
  ],
});

export default schemaV14;


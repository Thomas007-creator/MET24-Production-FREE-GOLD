# 🚀 MET24 Discourse Integration Architecture

## 🏗️ **DISCOURSE + MET24 UNIFIED ARCHITECTURE**

### **Service Architecture:**

```yaml
version: '3.8'

services:
  # Existing MET24 Services
  met24-user-app:
    # Current React/TypeScript PWA
    
  met24-mcp-bridge:
    # Current AI orchestration service
    
  # NEW: Discourse Integration
  discourse:
    image: discourse/discourse:latest
    container_name: met24-discourse
    environment:
      - DISCOURSE_HOSTNAME=community.your-future-self.app
      - DISCOURSE_SITE_NAME=MET24 Community
      - DISCOURSE_SITE_DESCRIPTION=MBTI Coach Community Platform
      - DISCOURSE_MBTI_INTEGRATION_ENABLED=true
      - DISCOURSE_MET24_API_URL=https://www.your-future-self.app/api
      - DISCOURSE_MET24_API_KEY=${DISCOURSE_MET24_API_KEY}
      - DISCOURSE_DISCOURSE_CONNECT_URL=https://www.your-future-self.app/api/auth/discourse
      - DISCOURSE_DISCOURSE_CONNECT_SECRET=${DISCOURSE_DISCOURSE_CONNECT_SECRET}
      - DISCOURSE_ENABLE_DISCOURSE_CONNECT=true
      - DISCOURSE_DEFAULT_LOCALE=en
    networks:
      - coolify
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.discourse.rule=Host(`community.your-future-self.app`)"
      - "traefik.http.routers.discourse.entrypoints=websecure"
      - "traefik.http.routers.discourse.tls.certresolver=letsencrypt"
      - "traefik.http.services.discourse.loadbalancer.server.port=80"

  discourse-db:
    image: postgres:13
    container_name: met24-discourse-db
    environment:
      - POSTGRES_DB=discourse
      - POSTGRES_USER=discourse
      - POSTGRES_PASSWORD=${DISCOURSE_DB_PASSWORD}
    volumes:
      - discourse-db-data:/var/lib/postgresql/data
    networks:
      - coolify

  discourse-redis:
    image: redis:6
    container_name: met24-discourse-redis
    networks:
      - coolify

volumes:
  discourse-db-data:

networks:
  coolify:
    external: true
```

## 🔗 **SINGLE SIGN-ON (SSO) INTEGRATIE**

### **MET24 → Discourse Authentication Flow:**

```typescript
// src/services/discourseSSO.ts
export class DiscourseSSO {
  async authenticateUser(userData: UserData): Promise<DiscourseAuthResult> {
    const ssoPayload = {
      external_id: userData.id,
      username: userData.name?.replace(/\s+/g, ''),
      email: userData.email,
      name: userData.name,
      mbti_type: userData.mbtiType,
      user_fields: {
        1: userData.mbtiType,        // Custom field: MBTI Type
        2: userData.interests?.join(','), // Custom field: Interests  
        3: userData.wellness?.overall_score || 0, // Custom field: Wellness Score
      },
      avatar_url: userData.avatar,
      bio: userData.bio,
      groups: this.getMBTIGroups(userData.mbtiType),
      moderator: userData.role === 'admin',
      admin: userData.role === 'super_admin'
    };
    
    return await this.createDiscourseSSOToken(ssoPayload);
  }
  
  private getMBTIGroups(mbtiType: string): string[] {
    const groups = [mbtiType]; // e.g. ['INTJ']
    
    // Add temperament groups
    if (['NT'].some(t => mbtiType.includes('NT'))) groups.push('NT_Rationals');
    if (['NF'].some(t => mbtiType.includes('NF'))) groups.push('NF_Idealists');
    if (['SP'].some(t => mbtiType.includes('SP'))) groups.push('SP_Artisans');
    if (['SJ'].some(t => mbtiType.includes('SJ'))) groups.push('SJ_Guardians');
    
    // Add function groups
    if (['INTJ', 'INFJ'].includes(mbtiType)) groups.push('Ni_Dominant');
    if (['ENTJ', 'ENFJ'].includes(mbtiType)) groups.push('Te_Auxiliary');
    
    return groups;
  }
}
```

## 📊 **MBTI-AWARE FORUM STRUKTUR**

### **Automated Category Creation:**

```typescript
// src/services/discourseIntegration.ts
export class DiscourseMBTIIntegration {
  async setupMBTICategories(): Promise<void> {
    const categories = [
      // Individual MBTI Types
      ...MBTI_TYPES.map(type => ({
        name: `${type} - ${getMBTIDescription(type)}`,
        slug: type.toLowerCase(),
        color: getMBTIColor(type),
        description: `Dedicated space for ${type} personality types`,
        permissions: {
          [type]: 'full_access',
          'moderators': 'moderate'
        }
      })),
      
      // Temperament Groups  
      {
        name: 'NT Rationals - Strategic Thinking',
        slug: 'nt-rationals',
        color: '0066CC',
        subcategories: ['INTJ', 'INTP', 'ENTJ', 'ENTP']
      },
      
      // Wellness Domains
      {
        name: 'Wellness & Personal Growth',
        slug: 'wellness',
        subcategories: [
          'Physical Wellness', 'Emotional Wellness', 
          'Social Connections', 'Financial Health',
          'Professional Development', 'Active Imagination'
        ]
      },
      
      // AI Coaching Discussion
      {
        name: 'AI Coaching & Technology',
        slug: 'ai-coaching',
        description: 'Discuss AI-powered personality coaching experiences'
      }
    ];
    
    await this.createDiscourseCategories(categories);
  }
}
```

## 🎯 **USER EXPERIENCE INTEGRATIE**

### **Seamless MET24 ↔ Discourse Navigation:**

```typescript
// src/components/CommunityIntegration.tsx
export const CommunityButton: React.FC = () => {
  const { userData } = useAppStore();
  
  const openCommunity = async () => {
    // Auto-authenticate user in Discourse
    const ssoUrl = await discourseSSO.generateSSOUrl(userData);
    
    // Open in embedded iframe or new window
    window.open(ssoUrl, '_blank');
    
    // Track engagement
    analytics.track('community_accessed', {
      mbtiType: userData.mbtiType,
      source: 'main_app'
    });
  };
  
  return (
    <Button 
      onClick={openCommunity}
      className="bg-purple-600 hover:bg-purple-700"
    >
      🏛️ Join {userData.mbtiType} Community
    </Button>
  );
};
```

## 📊 **COMMUNITY ANALYTICS & INSIGHTS**

### **Cross-Platform Data Sync:**

```typescript
// src/services/communityAnalytics.ts
export class CommunityAnalytics {
  async syncDiscourseActivity(): Promise<void> {
    const activities = await discourse.api.getUserActivity(userData.id);
    
    // Store in WatermelonDB for offline access
    await database.write(async () => {
      await database.collections.get('community_activities').create(activity => {
        activity.userId = userData.id;
        activity.platform = 'discourse';
        activity.activityType = activities.type; // post, like, topic_created
        activity.mbtiRelevance = activities.category_mbti_types;
        activity.engagementScore = this.calculateEngagement(activities);
      });
    });
  }
  
  async getMBTIEngagementReport(): Promise<MBTIEngagementReport> {
    return {
      mostActiveTypes: ['ENFP', 'ENTP', 'ESFJ'], // Community engagement leaders
      topicsPerType: {
        'INTJ': ['Strategic Planning', 'Systems Thinking'],
        'ENFP': ['Creative Projects', 'Inspiration']
      },
      crossTypeInteractions: {
        'INTJ-ENFP': { frequency: 'high', sentiment: 'positive' }
      }
    };
  }
}
```
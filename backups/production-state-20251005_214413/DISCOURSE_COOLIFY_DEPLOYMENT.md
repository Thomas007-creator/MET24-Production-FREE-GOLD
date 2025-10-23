# 🚀 DISCOURSE COMMUNITY DEPLOYMENT - COOLIFY INSTRUCTIES

## **STAP 1: ENVIRONMENT VARIABLES TOEVOEGEN**

Ga naar je **Coolify project** → **Environment Variables** en voeg toe:

```bash
# Discourse Core
DISCOURSE_SSO_SECRET=met24_discourse_sso_secret_2024_secure_token
DISCOURSE_DB_PASSWORD=discourse_secure_database_password_2024

# SMTP (Gmail App Password)
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=osteomedica.utrecht@gmail.com
SMTP_PASSWORD=your_gmail_app_password_here

# Admin Configuration
DISCOURSE_ADMIN_EMAIL=osteomedica.utrecht@gmail.com
DISCOURSE_ADMIN_USERNAME=MET24Admin
DISCOURSE_ADMIN_PASSWORD=secure_admin_password_2024
```

## **STAP 2: DNS VERIFICATIE** ✅

Je DNS is al correct geconfigureerd:
```
✅ A    community     165.227.136.245
```

## **STAP 3: DOCKER COMPOSE DEPLOYMENT**

De nieuwe `docker-compose.yml` bevat nu:
- **discourse**: Hoofd community platform
- **discourse-postgres**: Database service
- **discourse-redis**: Cache service

**Auto-deployment** via Coolify Git trigger na commit.

## **STAP 4: EERSTE SETUP**

Na deployment, ga naar:
```
https://community.your-future-self.app/admin/wizard
```

1. **Admin account**: `osteomedica.utrecht@gmail.com`
2. **Site title**: "MET24 Community"
3. **Site description**: "Connect with fellow MBTI enthusiasts"

## **STAP 5: MBTI CATEGORIEËN MAKEN**

Via Admin → Categories, maak:

```
🧠 INTJ Strategists (intj-strategists) - Paars
💫 ENFP Champions (enfp-champions) - Roze  
🛡️ ISFJ Protectors (isfj-protectors) - Groen
⚡ ESTP Entrepreneurs (estp-entrepreneurs) - Oranje
💬 General Chat (general-chat) - Paars
🎯 Coaching Support (coaching-support) - Blauw
🏆 Success Stories (success-stories) - Groen
🎪 Daily Challenges (daily-challenges) - Rood-oranje
🏥 Holistic Wellness (holistic-wellness) - Turquoise
🤖 AI Insights (ai-insights) - Grijs
```

## **STAP 6: SSO CONFIGURATIE**

Admin → Settings → Login:
1. **Enable SSO**: ✅
2. **SSO URL**: `https://www.your-future-self.app/discourse-sso`
3. **SSO Secret**: `met24_discourse_sso_secret_2024_secure_token`

## **STAP 7: TESTING**

Test directe connectie vanuit PWA:
1. Ga naar https://www.your-future-self.app
2. Klik **💬 Chat** → Should open MBTI-specific community
3. Klik **👥 Community's** → Should open categories overview
4. Klik **🎯 Challenges** → Should open daily challenges

## **🎉 VERWACHT RESULTAAT**

```
🌐 https://community.your-future-self.app - LIVE
📱 PWA knoppen → Direct naar Discourse
🔗 Naadloze MBTI integratie
🔒 SSL certificaat automatisch
```

## **TROUBLESHOOTING**

**Als Discourse niet start:**
```bash
# Check logs
docker logs met24-discourse

# Check database
docker logs met24-discourse-postgres

# Restart services
docker-compose restart discourse
```

**Als SSL niet werkt:**
- Wacht 2-3 minuten voor Let's Encrypt
- Check Traefik logs in Coolify

**Als PWA buttons niet werken:**
- Check browser console voor errors
- Fallback naar `/communities` werkt altijd

## **SUCCESS METRICS**

✅ Community platform live op `community.your-future-self.app`  
✅ MBTI categorieën geconfigureerd  
✅ PWA directe connectie werkend  
✅ SSL certificaat actief  
✅ Admin panel toegankelijk  

**🚀 MET24 Community is LIVE! 🎉**
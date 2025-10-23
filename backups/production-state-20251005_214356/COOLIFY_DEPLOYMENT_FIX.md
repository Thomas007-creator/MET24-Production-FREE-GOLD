# 🚀 COOLIFY DEPLOYMENT FIX - MET24 PWA

## 🎯 **PROBLEEM OPGELOST**

De PWA werkt perfect lokaal, maar Coolify deployment faalt door **environment variable problemen**.

---

## ✅ **WAT IS GEFIXT**

### 🔧 **Code Updates:**
1. **CORS Configuratie** - MCP Bridge accepteert nu `https://www.your-future-self.app`
2. **Environment Variables** - Fallbacks toegevoegd in docker-compose.yml
3. **Production Logging** - Toont correcte URLs in logs

### 📁 **Gewijzigde Bestanden:**
- `server/mcp-bridge.js` - CORS + logging fixes
- `docker-compose.yml` - Environment variable fallbacks

---

## 🚀 **COOLIFY DEPLOYMENT STAPPEN**

### **Optie 1: Fix Bestaande Deployment**

1. **Ga naar Coolify Dashboard**
2. **Preview Environment** → Environment Variables
3. **Delete locked variables:**
   - `SERVICE_URL_MET24_MCP_BRIDGE` (Locked Secret)
   - `SERVICE_URL_MET24_USER_APP` (Locked Secret)

4. **Voeg opnieuw toe:**
   ```
   SERVICE_URL_MET24_MCP_BRIDGE = https://www.your-future-self.app/mcp
   SERVICE_URL_MET24_USER_APP = https://www.your-future-self.app
   ```

5. **Redeploy**

### **Optie 2: Clean Deployment (AANBEVOLEN)**

1. **Nieuwe Coolify Project**
2. **Import van GitHub:** `MET24-READY-FOR-COOLIFY`
3. **Set Environment Variables:**
   ```
   # Supabase (Verplicht)
   REACT_APP_SUPABASE_URL = https://wdwtwuljuewbkfozjkbq.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # AI Services (Optioneel - voor AI features)
   MCP_API_KEY = your-mcp-key
   GROK_API_KEY = your-grok-key
   OPENAI_API_KEY = your-openai-key
   ANTHROPIC_API_KEY = your-anthropic-key
   
   # VAPID Keys (Voor Push Notifications)
   VAPID_PUBLIC_KEY = your-vapid-public-key
   VAPID_PRIVATE_KEY = your-vapid-private-key
   VAPID_EMAIL = your-email@domain.com
   
   # SSL Email (Voor Let's Encrypt)
   SSL_EMAIL = your-email@domain.com
   ```

4. **Deploy**

---

## 🎯 **VERWACHTE RESULTATEN**

### ✅ **Na Fix:**
- `https://www.your-future-self.app` → PWA laadt correct
- `https://www.your-future-self.app/mcp` → MCP Bridge health check
- `https://www.your-future-self.app/health` → User App health check

### 🔍 **Health Check URLs:**
```bash
# User App
curl https://www.your-future-self.app/health
# Expected: "healthy"

# MCP Bridge  
curl https://www.your-future-self.app/mcp/health
# Expected: {"status":"healthy","service":"mcp-bridge",...}
```

---

## 🛠️ **TROUBLESHOOTING**

### **Als het nog niet werkt:**

1. **Check Coolify Logs:**
   - Ga naar Coolify → Project → Logs
   - Zoek naar CORS errors of environment variable errors

2. **Verify Environment Variables:**
   - Alle `SERVICE_URL_*` variabelen moeten `https://` prefix hebben
   - Geen trailing slashes (behalve `/mcp`)

3. **Check Traefik Labels:**
   - Labels zijn hardcoded in docker-compose.yml
   - Moeten overeenkomen met je domain

### **Alternative Hosting:**
Als Coolify problemen blijft geven:
- **Vercel** (simpeler deployment)
- **Railway** (Docker support)
- **DigitalOcean App Platform**

---

## 🎉 **CONCLUSIE**

**De PWA code is perfect!** Het probleem was puur **Coolify environment variable management**.

**Aanbeveling:** Start met **Optie 2 (Clean Deployment)** voor de beste kans op succes.

**Succes met de deployment!** 🚀

# 🔧 Environment Variables Guide voor Coolify Deployment

## 🚨 **KRITIEK: Environment Variables Probleem**

De deployment faalt waarschijnlijk omdat **Environment Variables** niet correct zijn ingesteld in Coolify voor de `main-k0g4wgck0g0wgw4owwoocs84` resource.

## 📋 **Stappen om Environment Variables in te stellen:**

### **1. Ga naar Coolify Dashboard**
- Open je Coolify dashboard
- Zoek de resource: `main-k0g4wgck0g0wgw4owwoocs84`

### **2. Ga naar Environment Variables**
- Klik op de resource
- Ga naar "Environment Variables" tab
- Klik op "Add" om nieuwe variabelen toe te voegen

### **3. Voeg de volgende variabelen toe:**

#### **🔑 KRITIEKE VARIABELEN (VERPLICHT):**

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# VAPID Keys (KRITIEK - deze ontbreken waarschijnlijk!)
VAPID_PUBLIC_KEY=your_vapid_public_key_here
VAPID_PRIVATE_KEY=your_vapid_private_key_here
VAPID_EMAIL=mailto:your-email@domain.com

# AI Provider Keys
MCP_API_KEY=your_mcp_api_key_here
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# SSL Configuration
SSL_EMAIL=your-email@domain.com
```

#### **⚙️ OPTIONELE VARIABELEN (AANBEVOLEN):**

```bash
# Node Environment
NODE_ENV=production
REACT_APP_NODE_ENV=production

# API URLs
REACT_APP_API_URL=https://www.your-future-self.app/api
REACT_APP_MCP_BRIDGE_URL=https://www.your-future-self.app/mcp
```

## 🔍 **Hoe te controleren welke variabelen ontbreken:**

### **Methode 1: Coolify Dashboard**
1. Ga naar de resource in Coolify
2. Klik op "Environment Variables"
3. Controleer of alle bovenstaande variabelen aanwezig zijn

### **Methode 2: Deployment Logs**
1. Start een nieuwe deployment
2. Bekijk de build logs
3. Zoek naar errors zoals:
   - `VAPID_PUBLIC_KEY is not defined`
   - `Environment variable missing`
   - `Build failed due to missing variables`

## 🚨 **Meest Waarschijnlijke Oorzaak:**

De **VAPID keys** ontbreken waarschijnlijk, wat ervoor zorgt dat de build faalt omdat deze variabelen worden gebruikt in de Dockerfile.

## 📝 **VAPID Keys Genereren (als je ze niet hebt):**

Als je geen VAPID keys hebt, kun je ze genereren met:

```bash
# Installeer web-push CLI
npm install -g web-push

# Genereer VAPID keys
web-push generate-vapid-keys
```

Dit geeft je output zoals:
```
=======================================

Public Key:
BEl62iUYgUivxIkv69yViEuiBIa40HI8F7Y8z9ZW2Xg

Private Key:
yHJ3P6bnVpfzW2m8fQz8cQ3mF9vN2pL8xR5sT1uV7w

=======================================
```

## ✅ **Na het instellen van Environment Variables:**

1. **Sla de variabelen op** in Coolify
2. **Start een nieuwe deployment**
3. **Monitor de build logs** voor succes
4. **Test de applicatie** na succesvolle deployment

## 🔧 **Troubleshooting:**

### **Probleem: Build faalt nog steeds**
- Controleer of alle variabelen correct zijn gespeld
- Zorg ervoor dat er geen extra spaties zijn
- Controleer of de waarden correct zijn (geen placeholder tekst)

### **Probleem: VAPID keys werken niet**
- Zorg ervoor dat VAPID_EMAIL begint met `mailto:`
- Controleer of de keys correct zijn gekopieerd (geen extra karakters)

### **Probleem: Supabase verbinding faalt**
- Controleer of de Supabase URL correct is
- Controleer of de anon key correct is
- Zorg ervoor dat de Supabase project actief is

## 📞 **Hulp nodig?**

Als je hulp nodig hebt met het instellen van Environment Variables:
1. Controleer de `env-template.txt` file voor voorbeelden
2. Gebruik het `scripts/validate-env-vars.sh` script om te controleren
3. Bekijk de deployment logs voor specifieke error messages

---

**🎯 Na het instellen van alle Environment Variables zou de deployment moeten slagen!**

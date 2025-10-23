# Mullvad VPN Setup voor MET2.4.2

## 🔒 **VPN Configuratie Stappen:**

### **Stap 1: Mullvad Account**
1. Ga naar [mullvad.net](https://mullvad.net)
2. Maak account aan of log in
3. Ga naar "WireGuard keys" sectie

### **Stap 2: WireGuard Key Genereren**
1. Klik op "Generate new key"
2. Kopieer de gegenereerde **Private Key**
3. Kopieer de **Public Key** (voor later)

### **Stap 3: Server Selecteren**
1. Ga naar "Select location"
2. Kies een server (bijv. Amsterdam, Frankfurt)
3. Kopieer de **Endpoint IP** en **Port**

### **Stap 4: Environment Variables**
Vul deze waarden in je `.env` bestand:

```bash
# Mullvad VPN Configuration
MULLVAD_PRIVATE_KEY=your-private-key-here
MULLVAD_ADDRESSES=10.64.0.1/32
MULLVAD_ENDPOINT_IP=your-endpoint-ip-here
MULLVAD_ENDPOINT_PORT=51820
MULLVAD_PRESHARED_KEY=your-preshared-key-here
VPN_ENABLED=true
```

### **Stap 5: GitHub Secrets**
Voeg deze toe aan je GitHub repository secrets:

```
MULLVAD_PRIVATE_KEY=your-private-key
MULLVAD_ADDRESSES=10.64.0.1/32
MULLVAD_ENDPOINT_IP=your-endpoint-ip
MULLVAD_ENDPOINT_PORT=51820
MULLVAD_PRESHARED_KEY=your-preshared-key
```

### **Stap 6: Coolify Environment**
Voeg dezelfde variabelen toe aan Coolify environment variables.

## 🚀 **Deployment:**

Na het instellen van de environment variables:

1. **Commit en push** de wijzigingen
2. **Trigger deployment** in Coolify
3. **Test VPN connectie**:
   ```bash
   curl http://165.227.136.245:3000/health
   curl http://165.227.136.245:3001/health
   ```

## 🔍 **VPN Status Check:**

Om te controleren of VPN werkt:

```bash
# Check VPN container logs
docker logs mullvad-vpn

# Check VPN status
curl http://localhost:8000/v1/openvpn/status
```

## ⚠️ **Belangrijk:**

- **Alle traffic** gaat nu via Mullvad VPN
- **IP adres** wordt verborgen
- **Supabase connectie** gaat via VPN
- **Performance** kan iets trager zijn

## 🎯 **Resultaat:**

Na setup draait je applicatie volledig via Mullvad VPN:
- ✅ **Privacy**: IP adres verborgen
- ✅ **Security**: Versleutelde verbinding
- ✅ **Geolocation**: Server lijkt in ander land
- ✅ **DDoS bescherming**: Minder zichtbaar

---
**Status**: 🔒 VPN Ready
**Last Updated**: $(date)

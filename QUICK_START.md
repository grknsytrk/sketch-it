# 🚀 HIZLI BAŞLANGIÇ - Render.com Deployment

## ⚡ 5 Dakikada Canlıya Alın!

### ADIM 1: GitHub'a Yükleyin (2 dakika)

```powershell
# Projenizin ana klasöründe
git init
git add .
git commit -m "Ready for deployment"

# GitHub'da yeni repo oluşturun, sonra:
git remote add origin https://github.com/KULLANICI-ADINIZ/game-online.git
git branch -M main
git push -u origin main
```

### ADIM 2: Backend Deploy (2 dakika)

1. **render.com**'a gidin → GitHub ile giriş yapın
2. **New +** → **Web Service**
3. Repository'nizi seçin
4. Ayarlar:
   - Name: `game-online-server`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - **Environment Variables:**
     - `PORT` = `3001`
     - `NODE_ENV` = `production`
5. **Create Web Service** → **Backend URL'ini kopyalayın!**

### ADIM 3: Frontend Deploy (1 dakika)

1. **New +** → **Static Site**
2. Aynı repo'yu seçin
3. Ayarlar:
   - Name: `game-online`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - **Environment Variables:**
     - `VITE_API_URL` = `ADIM 2'deki backend URL'nizi buraya yapıştırın!`
4. **Create Static Site**

### ADIM 4: Oyna! 🎉

Frontend URL'inizi açın ve oyunun tadını çıkarın!

---

## ❓ Sorun mu var?

### "Can't connect to server" hatası
→ Frontend'in Environment Variables kısmında `VITE_API_URL`'nin doğru olduğundan emin olun

### Build hatası
→ Render dashboard'da **Logs** sekmesine bakın

### Daha fazla yardım?
→ `DEPLOYMENT_GUIDE.md` dosyasına bakın (detaylı açıklamalar)

---

## 🎮 Oyun Özellikleri

- ✅ Gerçek zamanlı çizim
- ✅ Kelime tahmin sistemi
- ✅ Skor tablosu
- ✅ Oda sistemi
- ✅ Chat sistemi
- ✅ Bot desteği

**Tamamen ücretsiz, WebSocket desteği, otomatik SSL!**

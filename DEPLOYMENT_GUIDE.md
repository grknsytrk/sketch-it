# 🚀 Render.com'a Deployment Rehberi

Bu rehber, **Gartic.io** benzeri çizim oyununuzu **tamamen ücretsiz** olarak canlıya almanızı sağlar.

## 📋 Gereksinimler

- GitHub hesabı
- Render.com hesabı (GitHub ile giriş yapabilirsiniz)

---

## 🎯 ADIM 1: Projenizi GitHub'a Yükleyin

### 1.1 GitHub Repository Oluşturun
1. [GitHub.com](https://github.com) adresine gidin
2. Sağ üstten **"New Repository"** tıklayın
3. Repository adı girin (örn: `game-online`)
4. **Public** seçin
5. **"Create repository"** tıklayın

### 1.2 Projenizi GitHub'a Push Edin

```powershell
# Terminal'de projenizin ana klasörüne gidin
cd c:\Users\LENOVO\Desktop\Game_Online

# Git başlatın (eğer daha önce yapmadıysanız)
git init

# Tüm dosyaları ekleyin
git add .

# İlk commit'i yapın
git commit -m "Initial commit - Drawing game ready for deployment"

# GitHub repository'nizi bağlayın (YOUR-USERNAME yerine kendi kullanıcı adınızı yazın)
git remote add origin https://github.com/YOUR-USERNAME/game-online.git

# Ana branch'ı ayarlayın
git branch -M main

# GitHub'a yükleyin
git push -u origin main
```

---

## 🚀 ADIM 2: Backend'i Render'a Deploy Edin

### 2.1 Render.com'a Giriş Yapın
1. [Render.com](https://render.com) adresine gidin
2. **"Sign Up"** veya **"Log In"** tıklayın
3. GitHub hesabınızla giriş yapın
4. Repository erişimi verin

### 2.2 Backend Web Service Oluşturun
1. Dashboard'da **"New +"** butonuna tıklayın
2. **"Web Service"** seçin
3. GitHub repository'nizi bulun ve **"Connect"** tıklayın
4. Aşağıdaki ayarları yapın:

**Genel Ayarlar:**
- **Name:** `game-online-server` (veya istediğiniz isim)
- **Region:** Frankfurt (veya size en yakın)
- **Branch:** `main`
- **Root Directory:** `server`
- **Runtime:** `Node`

**Build & Deploy Ayarları:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Plan:**
- **Free** seçin

**Environment Variables:**
- `PORT` = `3001`
- `NODE_ENV` = `production`

5. **"Create Web Service"** tıklayın
6. Deploy tamamlanana kadar bekleyin (3-5 dakika)
7. **Backend URL'nizi kopyalayın** (örn: `https://game-online-server.onrender.com`)

---

## 🎨 ADIM 3: Frontend'i Render'a Deploy Edin

### 3.1 Frontend Static Site Oluşturun
1. Dashboard'da tekrar **"New +"** butonuna tıklayın
2. **"Static Site"** seçin
3. Aynı GitHub repository'nizi seçin
4. Aşağıdaki ayarları yapın:

**Genel Ayarlar:**
- **Name:** `game-online` (veya istediğiniz isim)
- **Branch:** `main`
- **Root Directory:** `client`

**Build Ayarları:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

**Environment Variables:**
- `VITE_API_URL` = **ADIM 2.2'de kopyaladığınız backend URL'ini buraya yapıştırın**
  
  Örnek: `https://game-online-server.onrender.com`

5. **"Create Static Site"** tıklayın
6. Deploy tamamlanana kadar bekleyin (3-5 dakika)

---

## 🎉 ADIM 4: Oyununuzu Test Edin!

### 4.1 Frontend URL'inizi Açın
- Render dashboard'unuzda frontend sitenizin URL'ini kopyalayın
- Tarayıcınızda açın (örn: `https://game-online.onrender.com`)

### 4.2 Test Senaryosu
1. Bir oda oluşturun
2. Başka bir tarayıcı/sekme/telefon ile aynı odaya katılın
3. Oyunu başlatın ve çizim yapın!

---

## ⚠️ Önemli Notlar

### Ücretsiz Plan Kısıtlamaları
- **Backend:** 15 dakika kullanılmazsa uyku moduna girer
- **İlk erişim:** 30-50 saniye bekleme süresi olabilir
- **Aktif kullanımda:** Hiçbir gecikme olmaz

### SSL/HTTPS
- Render otomatik olarak SSL sertifikası sağlar
- Oyununuz güvenli HTTPS ile çalışır

### Custom Domain (Opsiyonel)
Eğer kendi domain'iniz varsa:
1. Frontend sitenizde **"Settings"** → **"Custom Domain"**
2. Domain'inizi ekleyin ve DNS ayarlarını yapın

---

## 🔧 Güncelleme Yapmak

Oyununuzda değişiklik yaptığınızda:

```powershell
git add .
git commit -m "Güncellemelerinizin açıklaması"
git push
```

Render otomatik olarak yeni versiyonu deploy eder!

---

## 🆘 Sorun Giderme

### Backend'e Bağlanamıyorum
1. Backend URL'in doğru olduğundan emin olun
2. Frontend environment variable'ları kontrol edin
3. Browser console'da hata mesajlarına bakın

### "Application Error" Hatası
1. Render dashboard'da **"Logs"** sekmesini kontrol edin
2. Build hatalarını düzeltin
3. Manual Deploy ile tekrar deneyin

### WebSocket Bağlantı Sorunu
- Render free tier WebSocket'leri destekler
- CORS ayarlarınızı kontrol edin (server/src/index.ts)

---

## 📞 Yardım

Sorun yaşarsanız:
- Render'ın [documentation](https://render.com/docs)
- [Community forum](https://community.render.com/)

---

## 🎮 Tebrikler!

Oyununuz artık canlıda! Arkadaşlarınızla paylaşabilir ve oynayabilirsiniz! 🎉

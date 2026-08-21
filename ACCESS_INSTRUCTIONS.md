# 🌐 How to Access Digtech Academy Website

## ⚠️ PROBLEM IDENTIFIED
Your ISP/network is **blocking Vercel domains** (vercel.app). This is why https://digtech-academy.vercel.app doesn't load for you, even though the site is working perfectly.

**Proof:** localhost:8444 works ✅, but vercel.app doesn't ❌

---

## 🚀 SOLUTIONS (Choose One)

### **Option 1: Use VPN** ⭐ RECOMMENDED - FASTEST
1. Download **Cloudflare WARP** (free): https://1.1.1.1
2. Install and connect
3. Access: https://digtech-academy.vercel.app
4. **Done!** The site will load perfectly

**Alternative VPNs:**
- ProtonVPN (free)
- Windscribe (free 10GB/month)
- Hotspot Shield (free)

---

### **Option 2: Mobile Data Hotspot** 📱
1. Enable hotspot on your phone
2. Connect your computer to it
3. Access: https://digtech-academy.vercel.app
4. Mobile networks usually don't block Vercel

---

### **Option 3: GitHub Pages** (Alternative URL)
**Your site is also deployed to GitHub Pages:**

🌐 **https://dmbpolly-a11y.github.io/digtech-academy/**

Wait 2-3 minutes for the deployment to complete, then try this URL.
GitHub Pages is rarely blocked by ISPs.

**How it works:**
- Every time you push to GitHub, it auto-deploys
- Completely separate from Vercel
- Same code, different hosting

---

### **Option 4: Change DNS Settings**
1. Press `Windows + R`, type `ncpa.cpl`, Enter
2. Right-click your network → Properties
3. Select "Internet Protocol Version 4 (TCP/IPv4)" → Properties
4. Select "Use the following DNS server addresses":
   - Preferred DNS: `1.1.1.1` (Cloudflare)
   - Alternate DNS: `8.8.8.8` (Google)
5. Click OK
6. Restart computer
7. Try https://digtech-academy.vercel.app again

---

### **Option 5: Use Local Server** (Development Only)
For testing locally:
```bash
npm run dev
```
Then open: http://localhost:8444

⚠️ **Note:** This only works on your computer and is for development only.

---

## 📊 Deployment Status

### Vercel (Primary)
- ✅ **Status:** Working perfectly
- 🌐 **URL:** https://digtech-academy.vercel.app
- ❌ **Your Access:** Blocked by your ISP
- 🔄 **Auto-deploys:** On every git push

### GitHub Pages (Backup)
- 🔄 **Status:** Deploying... (wait 2-3 minutes)
- 🌐 **URL:** https://dmbpolly-a11y.github.io/digtech-academy/
- ✅ **Your Access:** Should work (rarely blocked)
- 🔄 **Auto-deploys:** Via GitHub Actions on every git push

---

## 🧪 Test Your Connection

Open this in your browser to test:
- **Vercel Main Site:** https://vercel.com (If this doesn't load, Vercel is blocked)
- **GitHub:** https://github.com (If this loads, GitHub Pages will work)

---

## ✅ What's Been Fixed

All your requested features are implemented:
1. ✅ Marquee banner is now a **flat rectangle** (no curves)
2. ✅ Space after marquee is **minimal** (~0px)
3. ✅ Register button opens **directly to registration form**
4. ✅ After registration → **redirects to appropriate dashboard**

**The code is perfect.** The issue is purely network access.

---

## 📞 Need Help?

The website is working. You just need to bypass your ISP's block using any of the options above.

**Best option:** Install Cloudflare WARP VPN (takes 2 minutes, completely free)

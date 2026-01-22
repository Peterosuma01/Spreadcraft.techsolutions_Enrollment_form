# 🎓 SpreadCraft Tech Solutions - Course Enrollment PWA

A Progressive Web App (PWA) for SpreadCraft Tech Solutions' Advanced Microsoft Excel with Applications to Data Analytics course enrollment.

## Features

- ✅ **Installable**: Can be installed on mobile and desktop devices
- 📱 **Responsive**: Works seamlessly on all screen sizes
- 🔄 **Offline-Ready**: Core app loads even without internet connection
- 🎨 **Beautiful UI**: Professional gradient design with smooth interactions
- 🚀 **Fast**: Cached assets load instantly
- 💾 **Google Sheets Integration**: Submissions stored directly in Google Sheets

## Deployment to GitHub Pages

### Step 1: Create Icons

You need to create PWA icons. Use one of these free tools:

1. **[PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)**
   - Upload a logo (min 512x512px)
   - Download the icons
   - Extract and place in `/icons/` folder

2. **[Favicon.io](https://favicon.io/favicon-converter/)**
   - Upload your logo
   - Generate and download
   - Rename files to `icon-192x192.png` and `icon-512x512.png`

**Required files:**
- `icons/icon-192x192.png` (192x192 pixels)
- `icons/icon-512x512.png` (512x512 pixels)

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `spreadcraft-enrollment`)
3. Make it **Public** (required for GitHub Pages)
4. Don't initialize with README (we already have one)

### Step 3: Upload Files

**Option A: Via GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop all files:
   - `index.html`
   - `app.js`
   - `service-worker.js`
   - `manifest.json`
   - `README.md`
   - `icons/` folder with both PNG files
3. Commit changes

**Option B: Via Git Command Line**
```bash
git init
git add .
git commit -m "Initial commit: SpreadCraft Enrollment PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main

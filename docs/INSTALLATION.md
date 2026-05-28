# SmartSpend Setup & Installation Guide

Follow this guide to perform a clean, fresh setup of the SmartSpend Personal Finance Hub on your machine.

---

## 1. Prerequisites

Make sure the following system tools are installed:

- **Node.js:** v18.0.0 or higher (LTS recommended)
- **npm:** v9.0.0 or higher (distributed with Node.js)
- **Git:** for cloning the repository

---

## 2. Environment Configuration

1. Locate the `.env.example` template at the root level of the project.
2. Duplicate this file and rename it to `.env` in the same root directory.
3. Verify it contains the correct local backend service URL:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

---

## 3. Quick Setup (Recommended Unified Method)

SmartSpend is equipped with a unified process runner. You can install all dependencies and start both the React frontend and Node.js backend simultaneously with just a few simple commands:

1. **Clone & Enter Folder:**
   ```bash
   git clone https://github.com/BeastBoii24/smart-spend.git
   cd smart-spend
   ```
2. **Install Root Packages & Setup:**
   ```bash
   npm install
   ```
3. **Start the Integrated Workspace:**
   ```bash
   npm run dev
   ```

Both applications will boot in your terminal and be available instantly:
- **Frontend URL:** `http://localhost:5173`
- **Backend API URL:** `http://localhost:3001`

---

## 4. Manual Setup (Alternative Split-Terminal Method)

If you prefer to run the frontend and backend in separate terminal contexts:

### Terminal 1: React Frontend (Root Folder)
```bash
npm install
npm run dev:frontend
```
*Local URL: `http://localhost:5173`*

### Terminal 2: Node.js/Express Backend (`/backend` Folder)
```bash
cd backend
npm install
npm run start
```
*Local URL: `http://localhost:3001`*

---

## 5. Production Compilation & Packaging

To compile a highly optimized static build for deployment or production environments:

1. **Build Production Assets:**
   ```bash
   npm run build
   ```
   *Compiles all assets and deposits them in the root `/dist` directory.*
2. **Preview Compiled Distribution:**
   ```bash
   npm run preview
   ```
   *Boots a local static server hosting the `/dist` application for client verification.*

---

## 6. Comprehensive Troubleshooting

- **Port Conflict Errors (`EADDRINUSE`):**
  If port `3001` or `5173` is already occupied, find and kill the process or set a fallback port:
  - On Windows: `netstat -ano | findstr :3001` then `taskkill /PID <PID> /F`
  - Or simply use: `PORT=3002 npm run dev`
- **API Call Failures (CORS / Connection Refused):**
  Ensure that the Express backend is running and that your root `.env` file correctly defines `VITE_API_BASE_URL=http://localhost:3001`. Do not forget to restart your terminal after modifying `.env`.
- **Node Modules Missing Imports:**
  If you run into missing dependency warnings, execute a clean reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm cache clean --force
  npm install
  ```

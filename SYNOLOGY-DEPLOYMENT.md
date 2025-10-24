# Synology NAS Deployment Guide

This guide covers deploying the Prayer Tracker application on a Synology NAS using Docker with persistent SQLite storage.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Method 1: Using Docker Compose (Recommended)](#method-1-using-docker-compose-recommended)
- [Method 2: Using Synology Container Manager UI](#method-2-using-synology-container-manager-ui)
- [Accessing the Application](#accessing-the-application)
- [Backup and Restore](#backup-and-restore)
- [Troubleshooting](#troubleshooting)
- [Updating the Application](#updating-the-application)

## Prerequisites

1. **Synology NAS** running DSM 7.0 or later
2. **Container Manager** package installed (formerly Docker package)
3. **SSH access** enabled (for Docker Compose method)
4. At least **500MB free space** on your NAS

### Install Container Manager

1. Open **Package Center** on your Synology
2. Search for **Container Manager**
3. Click **Install**
4. Wait for installation to complete

## Quick Start

### Enable SSH (if using Docker Compose method)

1. Go to **Control Panel** > **Terminal & SNMP**
2. Enable **SSH service**
3. Note your NAS IP address

### Create Storage Directory

Using **File Station**, create this directory structure:
```
/docker/prayer-tracker/
└── data/          # SQLite database will be stored here
```

Or via SSH:
```bash
ssh admin@YOUR_NAS_IP
sudo mkdir -p /volume1/docker/prayer-tracker/data
sudo chmod 755 /volume1/docker/prayer-tracker/data
```

## Method 1: Using Docker Compose (Recommended)

### Step 1: Transfer Files to NAS

1. **Using File Station**:
   - Create folder `/docker/prayer-tracker/app`
   - Upload the entire Prayer Tracker project to this folder

2. **Or using SCP**:
   ```bash
   scp -r /path/to/PrayerTracker admin@YOUR_NAS_IP:/volume1/docker/prayer-tracker/app
   ```

### Step 2: Configure Environment

SSH into your NAS:
```bash
ssh admin@YOUR_NAS_IP
cd /volume1/docker/prayer-tracker/app
```

Create `.env` file:
```bash
cp .env.synology.example .env
nano .env
```

Update with your NAS IP:
```bash
NAS_IP=192.168.1.100  # Your NAS IP
NAS_HOSTNAME=nas.local
```

### Step 3: Build and Deploy

Still in SSH session:

```bash
# Navigate to the app directory
cd /volume1/docker/prayer-tracker/app

# Build and start containers
sudo docker-compose -f docker-compose.synology.yml up -d

# Check status
sudo docker-compose -f docker-compose.synology.yml ps

# View logs
sudo docker-compose -f docker-compose.synology.yml logs -f
```

### Step 4: Verify Deployment

1. Open browser to `http://YOUR_NAS_IP:8080`
2. You should see the Prayer Tracker interface
3. Check API docs at `http://YOUR_NAS_IP:8000/docs`

## Method 2: Using Synology Container Manager UI

### Step 1: Build Docker Images

First, build the images on your computer:

```bash
# Build backend
cd backend
docker build -t prayer-tracker-api:latest .

# Build frontend (replace with your NAS IP)
cd ../frontend
docker build --build-arg VITE_API_URL=http://192.168.1.100:8000 -t prayer-tracker-frontend:latest .

# Save images to files
docker save prayer-tracker-api:latest -o prayer-tracker-api.tar
docker save prayer-tracker-frontend:latest -o prayer-tracker-frontend.tar
```

### Step 2: Import Images to Synology

1. Open **Container Manager** on your NAS
2. Go to **Image** section
3. Click **Add** > **Add from File**
4. Upload `prayer-tracker-api.tar`
5. Repeat for `prayer-tracker-frontend.tar`

### Step 3: Create Backend Container

1. In Container Manager, go to **Container** tab
2. Click **Create**
3. Select `prayer-tracker-api:latest` image
4. Click **Next**

**Container Settings:**
- Container name: `prayer-tracker-api`
- Enable **Auto-restart**

**Port Settings:**
- Local Port: `8000` → Container Port: `8000`

**Volume Settings:**
- Click **Add Folder**
- Select or create `/docker/prayer-tracker/data`
- Mount path: `/data`
- Read/Write permissions

**Environment Variables:**
- `DATABASE_URL` = `sqlite:////data/prayer_tracker.db`
- `CORS_ORIGINS` = `http://192.168.1.100:8080` (use your NAS IP)

5. Click **Next**, then **Done**

### Step 4: Create Frontend Container

1. Click **Create** again
2. Select `prayer-tracker-frontend:latest`
3. Click **Next**

**Container Settings:**
- Container name: `prayer-tracker-frontend`
- Enable **Auto-restart**

**Port Settings:**
- Local Port: `8080` → Container Port: `8080`

**Links** (optional but recommended):
- Link to: `prayer-tracker-api`
- Alias: `api`

4. Click **Next**, then **Done**

### Step 5: Start Containers

1. Start `prayer-tracker-api` first
2. Wait 10 seconds
3. Start `prayer-tracker-frontend`

## Accessing the Application

### Local Network Access

- **Frontend**: `http://YOUR_NAS_IP:8080`
- **Backend API**: `http://YOUR_NAS_IP:8000`
- **API Docs**: `http://YOUR_NAS_IP:8000/docs`

### Remote Access (Optional)

To access from outside your network:

#### Option 1: Synology Reverse Proxy

1. Go to **Control Panel** > **Login Portal** > **Advanced** > **Reverse Proxy**
2. Click **Create**

**Frontend Proxy:**
- Description: `Prayer Tracker`
- Source: `prayer.yourdomain.com` (your DDNS)
- Port: `443` (HTTPS)
- Enable HSTS
- Destination: `localhost`
- Port: `8080`

**Backend Proxy:**
- Description: `Prayer Tracker API`
- Source: `prayer-api.yourdomain.com`
- Port: `443`
- Destination: `localhost`
- Port: `8000`

3. Update backend CORS_ORIGINS environment variable:
   ```bash
   CORS_ORIGINS=http://192.168.1.100:8080,https://prayer.yourdomain.com
   ```

#### Option 2: Port Forwarding

1. Forward port `8080` (frontend) and `8000` (backend) in your router
2. Use Synology QuickConnect or DDNS
3. Access via `http://your-ddns:8080`

**Security Warning**: If using port forwarding, consider:
- Using a reverse proxy with SSL
- Implementing authentication
- Regular security updates

## Backup and Restore

### Backup Database

The SQLite database is stored at `/volume1/docker/prayer-tracker/data/prayer_tracker.db`

**Automatic Backup with Hyper Backup:**
1. Open **Hyper Backup**
2. Create new backup task
3. Add `/docker/prayer-tracker/data` to backup
4. Configure schedule (recommended: daily)

**Manual Backup:**
```bash
# SSH into NAS
ssh admin@YOUR_NAS_IP

# Copy database
sudo cp /volume1/docker/prayer-tracker/data/prayer_tracker.db \
     /volume1/docker/prayer-tracker/data/prayer_tracker.db.backup.$(date +%Y%m%d)
```

**Download Backup:**
Use File Station to download from `/docker/prayer-tracker/data/`

### Restore Database

1. Stop the backend container
2. Replace database file:
   ```bash
   sudo cp /volume1/docker/prayer-tracker/data/prayer_tracker.db.backup.YYYYMMDD \
        /volume1/docker/prayer-tracker/data/prayer_tracker.db
   ```
3. Start the backend container

## Troubleshooting

### Containers Won't Start

**Check logs in Container Manager:**
1. Go to **Container** tab
2. Select container
3. Click **Details** > **Log** tab

**Or via SSH:**
```bash
sudo docker-compose -f docker-compose.synology.yml logs backend
sudo docker-compose -f docker-compose.synology.yml logs frontend
```

### Database Permission Errors

```bash
ssh admin@YOUR_NAS_IP
sudo chown -R root:root /volume1/docker/prayer-tracker/data
sudo chmod 755 /volume1/docker/prayer-tracker/data
```

### Frontend Can't Connect to Backend

1. Check backend is running: `http://YOUR_NAS_IP:8000/health`
2. Verify CORS settings include your NAS IP
3. Rebuild frontend with correct API URL:
   ```bash
   docker build --build-arg VITE_API_URL=http://YOUR_ACTUAL_NAS_IP:8000 -t prayer-tracker-frontend:latest ./frontend
   ```

### Port Already in Use

If ports 8000 or 8080 are already used:

1. Edit `docker-compose.synology.yml`
2. Change port mappings:
   ```yaml
   ports:
     - "8001:8000"  # Use 8001 instead of 8000
   ```
3. Update environment variables accordingly

### Database File Not Found

Verify volume mount:
```bash
# Check if data directory exists
ls -la /volume1/docker/prayer-tracker/data

# Verify container can access it
sudo docker exec prayer-tracker-api ls -la /data
```

## Updating the Application

### Update via Docker Compose

```bash
ssh admin@YOUR_NAS_IP
cd /volume1/docker/prayer-tracker/app

# Pull latest code (if using git)
sudo git pull

# Rebuild and restart
sudo docker-compose -f docker-compose.synology.yml down
sudo docker-compose -f docker-compose.synology.yml build --no-cache
sudo docker-compose -f docker-compose.synology.yml up -d
```

### Update via Container Manager

1. Build new images on your computer
2. Save to `.tar` files
3. Import to Synology
4. Stop old containers
5. Delete old containers (data persists)
6. Create new containers using new images
7. Start containers

**Note**: Your database in `/volume1/docker/prayer-tracker/data` will be preserved.

## Resource Usage

Expected resource usage on Synology:
- **CPU**: 2-5% idle, 10-20% under load
- **RAM**: ~150MB backend, ~50MB frontend
- **Storage**: ~50MB images + database size

Recommended Synology models:
- DS220+, DS720+, DS920+ or newer
- Any DS/RS model with Container Manager support

## Security Best Practices

1. **Change default ports** if exposing to internet
2. **Use reverse proxy** with SSL for external access
3. **Regular backups** of the database
4. **Keep DSM updated** for security patches
5. **Firewall rules** if exposing to internet
6. **Consider** adding authentication if needed

## Additional Configuration

### Enable HTTPS

1. Install SSL certificate in DSM
2. Configure reverse proxy (see Remote Access section)
3. Update CORS_ORIGINS to include https:// URLs

### Multiple Instances

To run multiple instances:
1. Use different port mappings
2. Use separate data directories
3. Give containers unique names

Example:
```yaml
services:
  backend-church:
    ports:
      - "8000:8000"
    volumes:
      - /volume1/docker/prayer-tracker/church/data:/data

  backend-family:
    ports:
      - "8001:8000"
    volumes:
      - /volume1/docker/prayer-tracker/family/data:/data
```

## Support

For Synology-specific issues:
- [Synology Container Manager Documentation](https://kb.synology.com/en-global/DSM/help/ContainerManager/docker_desc)
- [Synology Community Forum](https://community.synology.com/)

For application issues:
- See main [README.md](README.md)
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

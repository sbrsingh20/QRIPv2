# QRIP Streamlit Deployment Architecture

## Overview

This document explains how QRIP is deployed on Streamlit Cloud and how the components interact.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Streamlit Cloud                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   streamlit_app.py                        │ │
│  │                   (Python Wrapper)                        │ │
│  │                                                           │ │
│  │  • Loads HTML/CSS/JS files                               │ │
│  │  • Embeds in Streamlit iframe                            │ │
│  │  • Serves static assets                                  │ │
│  │  • Applies custom theme                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Streamlit Components                         │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌─────────────────────────────────┐   │ │
│  │  │  Sidebar    │  │  Main Content (HTML iframe)     │   │ │
│  │  │             │  │                                 │   │ │
│  │  │  • Logo     │  │  ┌──────────────────────────┐  │   │ │
│  │  │  • Info     │  │  │    index.html            │  │   │ │
│  │  │  • Creds    │  │  │                          │  │   │ │
│  │  │  • Features │  │  │  • Login page            │  │   │ │
│  │  │             │  │  │  • Module selection      │  │   │ │
│  │  └─────────────┘  │  │  • Navigation            │  │   │ │
│  │                   │  └──────────────────────────┘  │   │ │
│  │                   │                                 │   │ │
│  │                   │  ┌──────────────────────────┐  │   │ │
│  │                   │  │    dashboard.html        │  │   │ │
│  │                   │  │                          │  │   │ │
│  │                   │  │  • Radar displays        │  │   │ │
│  │                   │  │  • 29 modules            │  │   │ │
│  │                   │  │  • Real-time tracking    │  │   │ │
│  │                   │  └──────────────────────────┘  │   │ │
│  │                   └─────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   Static Assets                           │ │
│  │                                                           │ │
│  │  • /js/           - JavaScript modules                    │ │
│  │  • /styles/       - CSS stylesheets                       │ │
│  │  • /assets/       - Images, icons                         │ │
│  │  • *.html         - HTML pages                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   ┌────────────────┐
                   │  End User      │
                   │  Browser       │
                   │                │
                   │  • Chrome      │
                   │  • Firefox     │
                   │  • Edge        │
                   │  • Safari      │
                   └────────────────┘
```

## Component Details

### 1. Streamlit App (streamlit_app.py)

**Purpose**: Python wrapper that serves the HTML/JS application

**Functionality**:
- Reads `index.html` and other HTML files
- Injects CSS from `styles/main.css`
- Injects JavaScript from `js/` directory
- Uses `streamlit.components.html()` to embed content
- Adds sidebar with app information

**Configuration**:
- `.streamlit/config.toml` - Theme and server settings
- `requirements.txt` - Python dependencies
- `packages.txt` - System dependencies (if needed)

### 2. HTML/JavaScript Application

**Purpose**: Original QRIP application (unchanged)

**Components**:
- `index.html` - Login and module selection
- `dashboard.html` - Main operational interface
- `profile.html` - User profile management
- `admin-users.html` - User administration
- `audit-viewer.html` - Audit log viewer
- `bug-viewer.html` - Bug report viewer
- `modules.html` - Individual module pages

### 3. JavaScript Modules

**Purpose**: Application logic and functionality

**Key Modules**:
- `js/rbac.js` - Authentication & authorization
- `js/audit-logger.js` - Activity logging
- `js/bug-reporter.js` - Error tracking
- `js/app.js` - Dashboard controller
- `js/radar.js` - Radar display engine
- `js/detection.js` - Threat intelligence
- `js/ml-engine.js` - Machine learning
- `js/fusion-engine.js` - Multi-sensor fusion

### 4. Static Assets

**Purpose**: Styling and media files

**Contents**:
- `styles/main.css` - Main stylesheet (37KB)
- `assets/` - Images, icons, fonts

## Data Flow

### User Access Flow

```
1. User visits Streamlit URL
   ↓
2. Streamlit Cloud loads streamlit_app.py
   ↓
3. streamlit_app.py reads index.html
   ↓
4. HTML embedded in Streamlit iframe
   ↓
5. Browser loads JavaScript modules
   ↓
6. User interacts with application
   ↓
7. JavaScript handles all logic locally
   ↓
8. SessionStorage stores user session
```

### Authentication Flow

```
1. User enters credentials on index.html
   ↓
2. JavaScript (rbac.js) validates locally
   ↓
3. Session stored in SessionStorage
   ↓
4. User redirected to modules.html or dashboard.html
   ↓
5. Each page checks session validity
   ↓
6. Module access controlled by RBAC
```

### Deployment Flow

```
1. Developer pushes code to GitHub
   ↓
2. Streamlit Cloud detects changes
   ↓
3. Streamlit installs dependencies (requirements.txt)
   ↓
4. Streamlit runs streamlit_app.py
   ↓
5. Application becomes available at URL
   ↓
6. Auto-redeploys on new pushes
```

## Key Features

### Zero Code Changes
- Original HTML/JS application unchanged
- All existing functionality preserved
- No migration or refactoring needed

### Embedded Architecture
- Streamlit serves as hosting wrapper
- JavaScript runs in browser iframe
- Full client-side functionality maintained

### Secure Deployment
- HTTPS by default on Streamlit Cloud
- SessionStorage isolated per session
- No sensitive data in configuration

### Responsive Design
- Works on desktop and mobile
- Iframe adjusts to viewport
- Original responsive CSS preserved

## Configuration Files

### requirements.txt
```
streamlit>=1.28.0
```
- Minimal Python dependencies
- Only Streamlit framework needed

### .streamlit/config.toml
```toml
[theme]
primaryColor="#00d4ff"      # Cyan accent
backgroundColor="#000428"    # Dark blue background
secondaryBackgroundColor="#004e92"  # Blue secondary
textColor="#ffffff"         # White text

[server]
headless = true             # Run without GUI
port = 8501                # Default Streamlit port
enableCORS = false         # Disable CORS
enableXsrfProtection = true # Enable XSRF protection

[browser]
gatherUsageStats = false   # Privacy: no usage stats
```

### packages.txt
```
# Empty - no system dependencies needed
```

## Limitations & Considerations

### SessionStorage
- Isolated to iframe context
- Persists within browser session
- Cleared on logout or tab close

### Local Processing
- All JavaScript runs in browser
- No backend processing in this deployment
- Suitable for frontend-only applications

### API Calls
- If app makes external API calls
- Ensure CORS is properly configured
- May need proxy for some APIs

### File Size
- Large files increase load time
- Consider minification for production
- Streamlit Cloud has storage limits

## Monitoring & Maintenance

### Logs
- Access via Streamlit Cloud dashboard
- View Python application logs
- Check deployment status

### Updates
- Push to GitHub to trigger redeploy
- Takes ~2 minutes for changes to go live
- No manual server management needed

### Performance
- Monitor via Streamlit analytics
- Check browser console for JS errors
- Use browser dev tools for debugging

## Security Best Practices

1. **Authentication**: Current system uses local credentials
   - Consider adding real authentication for production
   - Integrate with SSO if needed

2. **Secrets**: Use Streamlit secrets for sensitive data
   - API keys
   - Database credentials
   - Service tokens

3. **HTTPS**: Enabled by default on Streamlit Cloud
   - All traffic encrypted
   - Secure by default

4. **Access Control**: RBAC implemented in JavaScript
   - 4-tier permission system
   - Module-level access control
   - Audit logging enabled

## Scaling Considerations

### Current Setup
- Single Streamlit instance
- Client-side processing
- Suitable for small-medium teams

### Future Enhancements
- Add backend API for data persistence
- Implement real database
- Add caching for better performance
- Consider custom Streamlit component

## Support & Resources

- **Streamlit Docs**: https://docs.streamlit.io/
- **Deployment Guide**: STREAMLIT_DEPLOYMENT.md
- **Quick Start**: QUICKSTART_STREAMLIT.md
- **GitHub**: https://github.com/aurthur001-oss/QRIP

---

**Last Updated**: December 2024
**Version**: 2.4.0
**Status**: Production-Ready

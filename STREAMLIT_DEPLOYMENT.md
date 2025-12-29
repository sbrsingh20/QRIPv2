# QRIP Streamlit Deployment Guide

This guide provides step-by-step instructions for deploying the QRIP (Quantum Radar Intelligence Platform) application on Streamlit Cloud.

## Overview

QRIP is a JavaScript-based frontend application that has been wrapped with a Python Streamlit interface to enable deployment on Streamlit Cloud.

## Prerequisites

- GitHub account
- Streamlit Cloud account (free at https://streamlit.io/cloud)
- Git repository with QRIP code

## Files Added for Streamlit Deployment

1. **streamlit_app.py** - Main entry point for Streamlit Cloud
2. **requirements.txt** - Python dependencies (streamlit)
3. **.streamlit/config.toml** - Streamlit configuration (theme, server settings)

## Deployment Steps

### Method 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Streamlit deployment configuration"
   git push origin main
   ```

2. **Go to Streamlit Cloud**
   - Visit https://share.streamlit.io/
   - Sign in with your GitHub account

3. **Create a new app**
   - Click "New app" button
   - Select your repository: `aurthur001-oss/QRIP`
   - Branch: `main` (or your deployment branch)
   - Main file path: `streamlit_app.py`
   - Click "Deploy"

4. **Wait for deployment**
   - Streamlit Cloud will automatically install dependencies
   - The app will be available at: `https://[your-app-name].streamlit.app`

### Method 2: Local Testing Before Deployment

1. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Streamlit app locally**
   ```bash
   streamlit run streamlit_app.py
   ```

3. **Open in browser**
   - The app will automatically open at http://localhost:8501
   - Test all functionality before deploying to Streamlit Cloud

## Configuration

### Streamlit Theme

The app uses a custom theme matching the QRIP military-grade design:
- Primary Color: `#00d4ff` (Cyan)
- Background Color: `#000428` (Dark Blue)
- Secondary Background: `#004e92` (Blue)
- Text Color: `#ffffff` (White)

These settings are in `.streamlit/config.toml` and can be customized.

### Environment Variables (Optional)

If your application requires API keys or secrets:

1. In Streamlit Cloud dashboard, go to your app settings
2. Click on "Secrets" in the left sidebar
3. Add your secrets in TOML format:
   ```toml
   API_KEY = "your-api-key"
   DATABASE_URL = "your-database-url"
   ```

4. Access in code:
   ```python
   import streamlit as st
   api_key = st.secrets["API_KEY"]
   ```

## Default Credentials

The application comes with these test credentials:

- **User:** `user/user123` (7 modules access)
- **Data Analyst:** `data/data123` (17 modules access)
- **Admin:** `admin/admin123` (23 modules access)
- **Super Admin:** `superadmin/super123` (29 modules - full access)

## Features Available on Streamlit

- ✅ Full HTML/CSS/JavaScript application embedded
- ✅ Responsive design
- ✅ All 29 modules accessible
- ✅ RBAC (Role-Based Access Control)
- ✅ Audit logging
- ✅ Bug reporting system
- ✅ User management
- ✅ Real-time radar visualization

## Limitations

1. **LocalStorage/SessionStorage:** These work within the iframe but are isolated to the Streamlit session
2. **Multiple Pages:** The app navigates within a single Streamlit page using the iframe
3. **External APIs:** If your app calls external APIs, ensure CORS is properly configured

## Troubleshooting

### App Won't Start

**Issue:** Requirements installation fails
```
Solution:
1. Check requirements.txt has correct format
2. Ensure streamlit>=1.28.0 is specified
3. Check Streamlit Cloud logs for specific errors
```

### HTML Content Not Displaying

**Issue:** Blank page or errors
```
Solution:
1. Verify index.html exists in repository root
2. Check file paths in streamlit_app.py
3. Ensure all JS/CSS files are committed to repository
```

### JavaScript Not Working

**Issue:** Interactive features don't respond
```
Solution:
1. Check browser console for JavaScript errors
2. Verify all JS files are being loaded
3. Test locally first with `streamlit run streamlit_app.py`
```

### Login System Not Working

**Issue:** Cannot authenticate users
```
Solution:
1. Ensure rbac.js is loaded correctly
2. Check browser console for errors
3. Verify sessionStorage is accessible in iframe
```

## Updating Your Deployment

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
3. Streamlit Cloud will automatically redeploy your app

## Custom Domain (Optional)

To use a custom domain:

1. In Streamlit Cloud app settings, go to "Settings"
2. Under "General", find "Custom domain"
3. Follow instructions to configure DNS records
4. Add your custom domain

## Monitoring and Logs

- **View Logs:** Click on "Manage app" → "Logs" in Streamlit Cloud dashboard
- **Resource Usage:** Monitor CPU and memory in the "Manage app" section
- **Analytics:** Use Streamlit's built-in analytics or integrate with external tools

## Security Considerations

1. **Secrets Management:** Use Streamlit secrets for sensitive data
2. **HTTPS:** Streamlit Cloud provides HTTPS by default
3. **Authentication:** Consider adding Streamlit authentication for production
4. **Rate Limiting:** Streamlit Cloud has built-in rate limiting

## Production Checklist

- [ ] All code committed and pushed to GitHub
- [ ] requirements.txt contains all Python dependencies
- [ ] .streamlit/config.toml configured for your app
- [ ] Test locally with `streamlit run streamlit_app.py`
- [ ] Default credentials documented or changed
- [ ] Secrets configured in Streamlit Cloud (if needed)
- [ ] Custom domain configured (if desired)
- [ ] Monitoring and alerting set up

## Support and Resources

- **Streamlit Documentation:** https://docs.streamlit.io/
- **Streamlit Community:** https://discuss.streamlit.io/
- **QRIP Repository:** https://github.com/aurthur001-oss/QRIP
- **Streamlit Cloud:** https://streamlit.io/cloud

## Example Deployment URL

After deployment, your app will be available at:
```
https://qrip-quantum-radar.streamlit.app
```

(The exact URL depends on your app name and Streamlit Cloud availability)

## Advanced Configuration

### Multiple Pages

To add multiple pages to your Streamlit app:

1. Create a `pages/` directory
2. Add Python files: `pages/1_Dashboard.py`, `pages/2_Analytics.py`, etc.
3. Each page can render different HTML content

### Custom Components

For more complex interactions, consider creating custom Streamlit components:

```python
import streamlit.components.v1 as components

# Create a custom component
my_component = components.declare_component(
    "my_component",
    path="path/to/frontend"
)
```

## Conclusion

Your QRIP application is now ready for deployment on Streamlit Cloud! Follow the steps above to get your military-grade quantum radar intelligence platform running in the cloud.

For questions or issues, please refer to the resources listed above or open an issue on the GitHub repository.

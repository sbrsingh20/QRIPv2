# 🚀 Quick Start: Deploy QRIP on Streamlit Cloud

Get your QRIP application running on Streamlit Cloud in 5 minutes!

## Option 1: Deploy Directly to Streamlit Cloud (Fastest)

### Step 1: Prepare Your Repository
Your repository already has all the necessary files:
- ✅ `streamlit_app.py` - Main application file
- ✅ `requirements.txt` - Python dependencies
- ✅ `.streamlit/config.toml` - Configuration

### Step 2: Deploy to Streamlit Cloud

1. **Visit Streamlit Cloud**
   - Go to: https://share.streamlit.io/
   - Click "Sign in with GitHub"

2. **Create New App**
   - Click "New app" button
   - Repository: `aurthur001-oss/QRIP`
   - Branch: `main` (or your branch name)
   - Main file path: `streamlit_app.py`
   - App URL: Choose your preferred subdomain

3. **Deploy!**
   - Click "Deploy" button
   - Wait 2-3 minutes for deployment
   - Your app will be live at: `https://[your-app-name].streamlit.app`

### Step 3: Test Your App
- Open the deployed URL
- Login with test credentials:
  - User: `user/user123`
  - Admin: `admin/admin123`
  - Super Admin: `superadmin/super123`

## Option 2: Test Locally First

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Local Setup

```bash
# 1. Clone the repository (if not already done)
git clone https://github.com/aurthur001-oss/QRIP.git
cd QRIP

# 2. Install Streamlit
pip install -r requirements.txt

# 3. Run the app
streamlit run streamlit_app.py

# 4. Open browser
# The app will automatically open at http://localhost:8501
```

## What Gets Deployed?

✅ **Full QRIP Application**
- All 29 specialized modules
- Complete HTML/CSS/JavaScript frontend
- RBAC authentication system
- Audit logging
- Bug reporting
- User management
- Real-time radar visualization

✅ **Streamlit Features**
- Custom military-grade theme
- Sidebar with quick info
- Responsive design
- HTTPS by default
- Automatic updates on git push

## Default Credentials

Test the application with these built-in accounts:

| Role | Username | Password | Modules |
|------|----------|----------|---------|
| User | user | user123 | 7 |
| Data Analyst | data | data123 | 17 |
| Admin | admin | admin123 | 23 |
| Super Admin | superadmin | super123 | 29 |

## Troubleshooting

### "App is starting up..."
- Normal during first deployment
- Usually takes 2-3 minutes
- Streamlit is installing dependencies

### "Module not found" error
- Check that `requirements.txt` exists in your repo
- Ensure it contains: `streamlit>=1.28.0`
- Redeploy from Streamlit Cloud dashboard

### App shows blank page
- Check browser console for errors
- Verify `index.html` exists in repository root
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Login not working
- Check browser's JavaScript console
- Verify that JavaScript is enabled
- Try in a different browser

## Post-Deployment

### Update Your App
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
3. Streamlit Cloud auto-deploys changes (takes ~2 minutes)

### Monitor Your App
- View logs: Streamlit Cloud → Your App → "Manage app" → "Logs"
- Check resource usage in the dashboard
- Set up notifications for errors

### Share Your App
Your app URL: `https://[your-app-name].streamlit.app`

Share this link with:
- Team members
- Stakeholders
- End users

## Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Streamlit Cloud settings
   - Configure DNS records
   - Example: `qrip.yourdomain.com`

2. **Authentication** (Production)
   - Add Streamlit authentication
   - Or integrate with your SSO system
   - Restrict access to authorized users

3. **Secrets Management**
   - Add API keys in Streamlit Cloud secrets
   - Access via `st.secrets["KEY_NAME"]`
   - Keep sensitive data secure

## Support

- 📖 **Full Guide**: See [STREAMLIT_DEPLOYMENT.md](STREAMLIT_DEPLOYMENT.md)
- 🌐 **Streamlit Docs**: https://docs.streamlit.io/
- 💬 **Community**: https://discuss.streamlit.io/
- 🐛 **Issues**: https://github.com/aurthur001-oss/QRIP/issues

## Success! 🎉

Your QRIP application is now live on Streamlit Cloud!

**Deployment URL**: `https://[your-app-name].streamlit.app`

Access your military-grade quantum radar intelligence platform from anywhere in the world.

---

**Need help?** Open an issue on GitHub or check the full deployment guide.

# Installation Requirements for Streamlit Deployment

This document explains all the installation and configuration files required for deploying QRIP on Streamlit Cloud.

## Required Files

### 1. `requirements.txt` (REQUIRED)
**Location:** Root directory of the repository  
**Purpose:** Specifies Python package dependencies

```txt
# Streamlit Cloud requires explicit version specifications
# Using a stable, well-tested version range
streamlit>=1.28.0,<2.0.0
```

**Key Points:**
- Must be in the root directory
- Contains one package per line
- Uses version constraints to ensure compatibility
- Streamlit Cloud will automatically install these packages before running your app

### 2. `packages.txt` (OPTIONAL)
**Location:** Root directory of the repository  
**Purpose:** Specifies system-level (apt-get) dependencies

```txt
# System dependencies for Streamlit deployment
# Add any apt-get packages needed here
# Currently no system packages required for QRIP
```

**Key Points:**
- Used for Linux system packages (not Python packages)
- Empty for QRIP since no system packages are needed
- Examples of what might go here: `libgl1-mesa-dev`, `ffmpeg`, `poppler-utils`

### 3. `.python-version` (RECOMMENDED)
**Location:** Root directory of the repository  
**Purpose:** Specifies Python version for version managers

```txt
3.11
```

**Key Points:**
- Used by pyenv and similar Python version managers
- Ensures consistent Python version across environments
- Python 3.11 is stable and well-supported by Streamlit Cloud

### 4. `runtime.txt` (RECOMMENDED)
**Location:** Root directory of the repository  
**Purpose:** Specifies Python version for Streamlit Cloud

```txt
python-3.11
```

**Key Points:**
- Explicitly tells Streamlit Cloud which Python version to use
- Format: `python-X.Y` (e.g., `python-3.11`)
- Helps avoid compatibility issues

### 5. `.streamlit/config.toml` (OPTIONAL)
**Location:** `.streamlit/` directory in the repository root  
**Purpose:** Configures Streamlit theme and server settings

```toml
[theme]
primaryColor="#00d4ff"
backgroundColor="#000428"
secondaryBackgroundColor="#004e92"
textColor="#ffffff"
font="sans serif"

[server]
headless = true
port = 8501
enableCORS = false
enableXsrfProtection = true

[browser]
gatherUsageStats = false
```

**Key Points:**
- Customizes the look and feel of your Streamlit app
- Server settings optimize for cloud deployment
- Can be omitted to use Streamlit defaults

### 6. `streamlit_app.py` (REQUIRED)
**Location:** Root directory of the repository  
**Purpose:** Main entry point for the Streamlit application

**Key Points:**
- Must be named `streamlit_app.py` or `app.py`
- Contains the Streamlit application code
- Streamlit Cloud looks for this file by default

## File Structure Overview

```
QRIPv2/
├── .streamlit/
│   └── config.toml          # Streamlit configuration (optional)
├── js/                       # JavaScript files
├── styles/                   # CSS files
├── .gitignore               # Git ignore rules
├── .python-version          # Python version (recommended)
├── packages.txt             # System packages (optional, empty for QRIP)
├── requirements.txt         # Python packages (REQUIRED)
├── runtime.txt              # Python version for Streamlit Cloud (recommended)
├── streamlit_app.py         # Main application (REQUIRED)
└── index.html               # Main HTML file
```

## Installation Process on Streamlit Cloud

When you deploy to Streamlit Cloud, the following happens automatically:

1. **Repository Clone:** Streamlit Cloud clones your GitHub repository
2. **Python Setup:** Installs Python version specified in `runtime.txt` or `.python-version`
3. **System Packages:** Installs packages listed in `packages.txt` using apt-get (if any)
4. **Python Packages:** Installs packages from `requirements.txt` using pip
5. **Configuration:** Loads settings from `.streamlit/config.toml` (if present)
6. **App Launch:** Runs `streamlit run streamlit_app.py`

## Common Installation Errors and Solutions

### Error: "Error installing requirements"

**Possible Causes:**
1. Missing `requirements.txt` file
2. Incorrect package names or versions in `requirements.txt`
3. Package conflicts or incompatibilities

**Solutions:**
1. Ensure `requirements.txt` exists in the root directory
2. Use version constraints: `streamlit>=1.28.0,<2.0.0` instead of just `streamlit`
3. Test installation locally: `pip install -r requirements.txt`

### Error: "Python version not supported"

**Solution:**
- Add `runtime.txt` with a supported Python version (3.9, 3.10, or 3.11)
- Example: `python-3.11`

### Error: "Module not found"

**Solution:**
- Add the missing module to `requirements.txt`
- Ensure all dependencies are explicitly listed

## Testing Requirements Locally

Before deploying to Streamlit Cloud, test your requirements locally:

```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the app
streamlit run streamlit_app.py

# If successful, you'll see the app at http://localhost:8501
```

## Best Practices

1. **Pin Versions:** Use specific version ranges to avoid breaking changes
   - Good: `streamlit>=1.28.0,<2.0.0`
   - Bad: `streamlit` (installs latest, may break)

2. **Minimal Dependencies:** Only include packages you actually use
   - QRIP only needs `streamlit` and its dependencies

3. **Test Before Deploy:** Always test installation locally first
   - `pip install -r requirements.txt` should complete without errors

4. **Version Control:** Keep Python version consistent
   - Use both `runtime.txt` and `.python-version` for clarity

5. **Documentation:** Comment your requirements files
   - Helps future maintainers understand dependencies

## Updating Requirements

When adding new features that require additional packages:

1. Add the package to `requirements.txt`
2. Test installation locally
3. Commit and push changes
4. Streamlit Cloud will automatically reinstall dependencies

## Support and Resources

- **Streamlit Documentation:** https://docs.streamlit.io/
- **Requirements Format:** https://pip.pypa.io/en/stable/reference/requirements-file-format/
- **Python Versions:** https://docs.streamlit.io/deploy/streamlit-cloud/deploy-your-app#python-versions
- **Troubleshooting:** https://docs.streamlit.io/deploy/streamlit-cloud/troubleshoot-common-issues

## Summary

For QRIP deployment, you need:

✅ **REQUIRED:**
- `requirements.txt` - Contains `streamlit>=1.28.0,<2.0.0`
- `streamlit_app.py` - Main application file

✅ **RECOMMENDED:**
- `runtime.txt` - Contains `python-3.11`
- `.python-version` - Contains `3.11`

✅ **OPTIONAL:**
- `packages.txt` - Empty for QRIP (no system packages needed)
- `.streamlit/config.toml` - Theme and server configuration

All these files are now properly configured in the repository and ready for deployment!

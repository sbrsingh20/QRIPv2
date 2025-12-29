"""
QRIP - Quantum Radar Intelligence Platform
Streamlit Deployment Wrapper

This file serves as the entry point for Streamlit Cloud deployment.
It embeds the existing HTML/JavaScript application within Streamlit.
"""

import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

# Page configuration
st.set_page_config(
    page_title="QRIP - Quantum Radar Intelligence Platform",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to remove Streamlit branding and make it fullscreen
st.markdown("""
    <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
        .block-container {
            padding-top: 0rem;
            padding-bottom: 0rem;
            padding-left: 0rem;
            padding-right: 0rem;
            max-width: 100%;
        }
        iframe {
            border: none;
        }
    </style>
""", unsafe_allow_html=True)

# Get the directory of the current script
current_dir = Path(__file__).parent

# Read the index.html file
index_path = current_dir / "index.html"
with open(index_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Read and inject CSS
css_path = current_dir / "styles" / "main.css"
if css_path.exists():
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
    # Inject CSS into HTML
    html_content = html_content.replace('</head>', f'<style>{css_content}</style></head>')

# Read and inject JS files
js_files = [
    "js/rbac.js",
    "js/audit-logger.js",
    "js/bug-reporter.js"
]

for js_file in js_files:
    js_path = current_dir / js_file
    if js_path.exists():
        with open(js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
        # Inject JS into HTML
        html_content = html_content.replace('</body>', f'<script>{js_content}</script></body>')

# Display the HTML content with enough height
components.html(html_content, height=1200, scrolling=True)

# Information in sidebar
with st.sidebar:
    st.title("🛡️ QRIP")
    st.markdown("### Quantum Radar Intelligence Platform")
    st.markdown("---")
    st.markdown("**Version:** 2.4.0")
    st.markdown("**Status:** Production-Ready")
    st.markdown("---")
    st.markdown("#### Default Credentials")
    st.markdown("""
    - **User:** `user/user123`
    - **Data Analyst:** `data/data123`
    - **Admin:** `admin/admin123`
    - **Super Admin:** `superadmin/super123`
    """)
    st.markdown("---")
    st.markdown("#### Features")
    st.markdown("""
    - 29 Specialized Modules
    - Real-Time Tracking
    - 4-Tier RBAC
    - Enterprise Security
    - Audit Logging
    """)
    st.markdown("---")
    st.markdown("📘 [Documentation](https://github.com/aurthur001-oss/QRIP)")

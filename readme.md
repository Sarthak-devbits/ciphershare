🔐 SecureVault – End-to-End Encrypted File Sharing

SecureVault is a modern, privacy-focused file sharing platform that allows users to encrypt files client-side and securely share them via a link. The encryption happens entirely in the browser, ensuring that sensitive data never leaves the user's device unprotected.

This repository covers Functionality #1: Secure Client-Side File Encryption and Upload — the core of SecureVault’s trust model.

Features:
- 🔐 AES-256-GCM encryption directly in the browser
- 🔑 Optional password-based encryption (PBKDF2 + AES-GCM)
- ☁️ Upload encrypted files to Cloudinary (or S3)
- 📎 Generate secure, shareable download links
- ✂️ No plaintext or key ever leaves the browser unencrypted

Tech Stack:
- Frontend: React, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, Prisma, PostgreSQL
- Cloud Storage: Cloudinary or AWS S3
- Cryptography: Web Crypto API (AES-GCM, PBKDF2)
- Infrastructure: Docker, .env configuration, FormData API

Security Highlights:
- Each file is encrypted using a new AES key per upload
- If password is provided, AES key is encrypted using PBKDF2-derived key
- Encrypted AES key, salt, IVs are stored for future decryption
- No key or password ever stored in plaintext on the server

Usage (Functionality 1):
1. User uploads a file via drag & drop or file selector.
2. File is encrypted using AES-256-GCM in-browser.
3. If user enters a password, the AES key is wrapped using PBKDF2.
4. Encrypted file is uploaded to backend.
5. Backend uploads the encrypted file to Cloudinary and stores metadata.
6. A secure shareable download link is returned to the frontend.

Folder Structure:
- `/frontend` — React encryption UI (EncryptPage.tsx)
- `/backend` — Node.js API for file handling & database integration

Future Features:
- Secure Drop Zones (anonymous inboxes)
- Shamir Secret Sharing (threshold-based key recovery)
- Self-destructing links and expiration policies
- Encrypted previews and in-browser decryption

License:
MIT License — use and modify freely.

---

Made with 🛡️ by Sarthak.
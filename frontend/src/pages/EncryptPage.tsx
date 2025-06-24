import React, { useCallback, useState } from "react";
import { Upload, X, Lock, Copy, Download, Check } from "lucide-react";
import { addFile } from "@/services/webApis/webApis";

type FileStatus = "idle" | "encrypting" | "uploading" | "complete" | "error";

export function EncryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<FileStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [shareLink, setShareLink] = useState("");
  const [saveLater, setSaveLater] = useState(false);
  const [savePassword, setSavePassword] = useState("");
  const [copied, setCopied] = useState(false);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    },
    []
  );
  const handleClearFile = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setShareLink("");
  }, []);

  const handleAddFile = async ({
    encryptedFile,
    iv,
    keyIv,
    encryptedKey,
    fileName,
    salt,
    fileSize,
  }: {
    encryptedFile: Blob;
    iv: Uint8Array<ArrayBuffer>;
    keyIv: Uint8Array<ArrayBuffer>;
    encryptedKey: ArrayBuffer;
    fileName: string;
    salt: Uint8Array<ArrayBuffer>;
    fileSize: number;
  }) => {
    try {
      alert("reached");
      const userId = 1;
      const formData = new FormData();
      formData.append("file", encryptedFile, fileName);
      formData.append("userId", userId.toString());
      formData.append("iv", btoa(String.fromCharCode(...iv)));
      formData.append("keyIv", btoa(String.fromCharCode(...keyIv)));
      formData.append("salt", btoa(String.fromCharCode(...salt)));
      formData.append("fileSize", fileSize.toString());
      formData.append(
        "encryptedKey",
        btoa(String.fromCharCode(...new Uint8Array(encryptedKey)))
      );
      const response = await addFile(formData);
      console.log("✅ File uploaded:", response);
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
    }
  };

  const handleEncrypt = useCallback(async () => {
    if (!file) return;
    setStatus("encrypting");
    setProgress(0);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    const fileSize = file.size;
    const fileName = file.name;

    const fileBuffer = await file.arrayBuffer();
    setProgress(25);

    const encryptedFile = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      fileBuffer
    );

    const encryptedBlob = new Blob([encryptedFile]);

    const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
    let encryptedKey, keyIv, salt;

    if (password) {
      salt = crypto.getRandomValues(new Uint8Array(16));
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 100_000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      keyIv = crypto.getRandomValues(new Uint8Array(12));

      encryptedKey = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: keyIv },
        derivedKey,
        rawAesKey
      );

      await handleAddFile({
        encryptedFile: encryptedBlob,
        iv: iv,
        keyIv: keyIv,
        encryptedKey: encryptedKey,
        fileName,
        salt: salt,
        fileSize,
      });
    }
  }, [file]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareLink]);
  const handleSaveLater = useCallback(() => {
    // Simulate saving the encryption key with password protection
    setTimeout(() => {
      setSaveLater(false);
      setSavePassword("");
      alert(
        "Encryption key secured with your password. You can share this file anytime later."
      );
    }, 1000);
  }, [savePassword]);
  return (
    <div className="container py-12 max-w-3xl">
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-2xl md:text-3xl font-medium mb-4">
          Encrypt Your Files
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          Files are encrypted in your browser before being uploaded. Only people
          with the link can access them.
        </p>
      </div>
      <div className="space-y-8">
        {/* File Upload Area */}
        {status === "idle" || !file ? (
          <div
            className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-12 text-center hover:border-primary/30 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                Choose a File to Encrypt
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="border rounded-xl p-6 bg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Selected File</h3>
              {status !== "complete" && (
                <button
                  onClick={handleClearFile}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {status === "encrypting" || status === "uploading" ? (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      {status === "encrypting"
                        ? "Encrypting..."
                        : "Uploading..."}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : status === "complete" ? (
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Secure Link Generated
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-background border rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-r-md border-y border-r transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Anyone with the link can decrypt this file unless you've
                    protected it with a password.
                  </p>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        Want to share this file later?
                      </label>
                      <button
                        className={`w-10 h-5 rounded-full p-0.5 ${
                          saveLater ? "bg-primary" : "bg-muted-foreground/30"
                        } transition-colors`}
                        onClick={() => setSaveLater(!saveLater)}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                            saveLater ? "translate-x-5" : "translate-x-0"
                          }`}
                        ></div>
                      </button>
                    </div>
                    {saveLater && (
                      <div className="mt-2 space-y-2">
                        <div className="relative">
                          <input
                            type="password"
                            value={savePassword}
                            onChange={(e) => setSavePassword(e.target.value)}
                            placeholder="Create a password to secure this file"
                            className="w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <button
                          onClick={handleSaveLater}
                          disabled={!savePassword}
                          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Secure with Password
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
        {/* Password Protection (before encryption) */}
        {file && status === "idle" && (
          <div className="border rounded-xl p-6 bg-card">
            <h3 className="font-medium mb-4">Password Protection</h3>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Optional: Add a password to protect your file"
                  className="w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Lock className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Adding a password requires recipients to enter it before they
                can decrypt the file.
              </p>
            </div>
          </div>
        )}
        {/* Action Button */}
        {file && status === "idle" && (
          <button
            onClick={handleEncrypt}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Encrypt and Upload
          </button>
        )}
        {status === "complete" && (
          <div className="flex justify-between">
            <button
              onClick={handleClearFile}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              Encrypt Another File
            </button>
            <button
              onClick={() => alert("Downloading encryption key...")}
              className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors inline-flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Encryption Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

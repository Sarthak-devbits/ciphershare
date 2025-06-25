import React, { useCallback, useState } from "react";
import { Upload, X, Lock, Copy, Download, Check } from "lucide-react";
import { addFile } from "@/services/webApis/webApis";
import { set } from "@cloudinary/url-gen/actions/variable";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type FileStatus = "idle" | "encrypting" | "uploading" | "complete" | "error";

export function EncryptPage({ isDropdown }: { isDropdown: boolean }) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<FileStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [shareLink, setShareLink] = useState("");
  const [saveLater, setSaveLater] = useState(false);
  const [savePassword, setSavePassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);

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
    setPassword("");
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
      setStatus("uploading");
      // const id = isDropdown && userId ? atob(userId?.toString()) : 1;
      const id = 1;
      const formData = new FormData();
      formData.append("file", encryptedFile, fileName);
      formData.append("fileName", fileName);
      formData.append("userId", id.toString());
      formData.append("iv", btoa(String.fromCharCode(...iv)));
      formData.append("keyIv", btoa(String.fromCharCode(...keyIv)));
      formData.append("salt", btoa(String.fromCharCode(...salt)));
      formData.append("fileSize", fileSize.toString());
      formData.append(
        "encryptedKey",
        btoa(String.fromCharCode(...new Uint8Array(encryptedKey)))
      );
      setProgress(Math.random() * 75 + 25); // Randomize progress between 25 and 100
      const response = await addFile(formData);
      setUploadedFileId(response.data.file.id);
      console.log("✅ File uploaded:", response);

      setProgress(100);
      setStatus("complete");
      const linkToShare = `http://localhost:5173/decrypt/${btoa(
        response.data.file.id?.toString() || ""
      )}`;
      console.log(linkToShare);
      setShareLink(linkToShare); // fallback if response is dummy
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
      setStatus("error");
      alert("❌ Upload failed. Please try again.");
    }
  };

  const handleEncrypt = useCallback(async () => {
    if (!file) {
      alert("❗ No file selected.");
      return;
    }
    if (!password) {
      alert("❗ Password is required to encrypt the file.");
      return;
    }

    try {
      setStatus("encrypting");
      setProgress(10);

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
      setProgress(40);

      const salt = crypto.getRandomValues(new Uint8Array(16));

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
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      setProgress(55);
      const keyIv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedKey = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: keyIv },
        derivedKey,
        rawAesKey
      );

      setProgress(70);
      await handleAddFile({
        encryptedFile: encryptedBlob,
        iv,
        keyIv,
        encryptedKey,
        fileName,
        salt,
        fileSize,
      });
    } catch (error) {
      console.error("❌ Encryption failed:", error);
      setStatus("error");
      alert("❌ Encryption failed. Please check the file and try again.");
    }
  }, [file, password]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("🔗 Link copied to clipboard!");
  }, [shareLink]);

  const handleSaveLater = useCallback(() => {
    setTimeout(() => {
      setSaveLater(false);
      setSavePassword("");
      alert("🔐 Encryption key secured with your password.");
    }, 1000);
  }, [savePassword]);

  const handleDownloadFile = () => {};

  return (
    <div className="container py-12 max-w-3xl">
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-2xl md:text-3xl font-medium mb-4">
          {isDropdown ? "Secure Drop Zone" : "Encrypt Your Files"}
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          {isDropdown
            ? "Drop a file to send securely. Only the recipient can decrypt it."
            : `  Files are encrypted in your browser before being uploaded. Only people
          with the link can access them.`}
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
                <>
                  <div className="mt-2 p-4 bg-muted rounded-lg border">
                    {isDropdown ? (
                      <>
                        <div className=" inset-0 flex items-center justify-center z-50">
                          <div className="  p-6 text-center space-y-2  max-w-sm w-full">
                            <div className="text-4xl">📁✅</div>
                            <p className="text-lg font-semibold">
                              File dropped successfully!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Your file is being securely uploaded and encrypted
                              in your browser and user has been notified.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
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
                          Anyone with the link can decrypt this file unless
                          you've protected it with a password.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}

        {file && status === "idle" && (
          <div className="border rounded-xl p-6 bg-card">
            <h3 className="font-medium mb-4">Password Protection*</h3>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Add a password to protect your file"
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
        {status === "complete" && !isDropdown && (
          <div className="flex justify-between">
            <button
              onClick={handleClearFile}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              Encrypt Another File
            </button>
            <button
              onClick={() => {
                navigate(`/decrypt/${btoa(uploadedFileId?.toString() || "")}`);
              }}
              className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors inline-flex items-center"
            >
              View File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

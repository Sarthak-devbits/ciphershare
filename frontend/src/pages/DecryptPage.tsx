import React, { useCallback, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Download, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFile } from "@/services/webApis/webApis";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import InvalidFileComponent from "@/components/InvalidFileComponent";
import { base64ToUint8Array } from "@/lib/utils";
type DecryptStatus = "idle" | "decrypting" | "complete" | "error";
export function DecryptPage() {
  const { fileId } = useParams();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<DecryptStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!fileId || isNaN(parseInt(atob(fileId)))) {
    return <InvalidFileComponent />;
  }

  const { isFetching, data } = useQuery({
    queryKey: ["file", atob(fileId || "")],
    queryFn: () => getFile(atob(fileId || "")),
    enabled: !!fileId,
  });

  const [progress, setProgress] = useState(0);
  // Check if key is in URL fragment
  useEffect(() => {
    const fragment = location.hash;
  }, [location.hash]);

  const handleDecrypt = useCallback(async () => {
    try {
      const fileSrc = data?.src;
      const iv = base64ToUint8Array(data.iv); // For file decryption
      const keyIv = base64ToUint8Array(data.keyIv); // For AES key decryption
      const salt = base64ToUint8Array(data.salt); // For PBKDF2
      const encryptedAesKey = base64ToUint8Array(data.encryptedAesKey); // Encrypted AES key

      if (!fileSrc || !iv || !keyIv || !salt || !encryptedAesKey) {
        setErrorMessage("File data is incomplete or corrupted.");
        setStatus("error");
        return;
      }
      if (!password) {
        setErrorMessage("Please enter the password to decrypt the file.");
        setStatus("error");
        return;
      }
      setStatus("decrypting");
      setProgress(0);

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
        ["decrypt"]
      );
      setProgress(35);

      const rawAesKey = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: keyIv,
        },
        derivedKey,
        encryptedAesKey.buffer
      );

      const decryptedAesKey = await crypto.subtle.importKey(
        "raw",
        rawAesKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const response = await fetch(fileSrc);
      const encyptedBuffer = await response.arrayBuffer();
      setProgress(70);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        decryptedAesKey,
        encyptedBuffer
      );

      setProgress(100);
      setStatus("complete");

      // here creating a blob are triggering the download
      const blob = new Blob([decryptedBuffer], {
        type: data.mimeType || "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.name || "decrypted_file";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Decryption failed:", error);
      setProgress(0);
      setStatus("error");
      if (error instanceof DOMException && error.name === "OperationError") {
        setErrorMessage("Incorrect password. Please try again.");
      } else {
        setErrorMessage(
          "Decryption failed. Please check the file or password."
        );
      }
      setPassword("");
    }
  }, [password]);

  const handleDownload = useCallback(() => {
    // Simulate file download
    alert("Starting download...");
  }, []);
  return (
    <>
      {isFetching ? (
        <CardSkeleton />
      ) : (
        <div className="container py-12 max-w-lg">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-2xl md:text-3xl font-medium mb-4">
              You've received a secure file
            </h1>
            <p className="text-muted-foreground text-center">
              This file will be decrypted in your browser for maximum privacy.
            </p>
          </div>
          <div className="border rounded-xl overflow-hidden bg-card">
            {/* File Info */}
            {data && (
              <div className="p-6 border-b">
                <h3 className="font-medium mb-2">File Details</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {data.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Size:</span>{" "}
                    {(data.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {data.expiresIn && (
                    <p>
                      <span className="text-muted-foreground">Expires in:</span>{" "}
                      23 hours
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="p-6">
              {/* Password Input (if needed) */}
              {status === "idle" && location.hash.indexOf("key=") === -1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      This file is password protected
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to unlock file"
                        className="w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <button
                    onClick={handleDecrypt}
                    disabled={!password}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Decrypt File
                  </button>
                </div>
              )}
              {/* Decryption Progress */}
              {status === "decrypting" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Decrypting file...</span>
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
                  <p className="text-xs text-muted-foreground text-center">
                    Decryption happens entirely in your browser. Your data
                    remains private.
                  </p>
                </div>
              )}
              {/* Error State */}
              {status === "error" && (
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-md flex items-start">
                    <div className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">
                        {errorMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please try again with the correct password or contact
                        the sender.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              {/* Success State */}
              {status === "complete" && (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-md flex items-start">
                    <div className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        File successfully decrypted
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your file is ready to download. It was decrypted locally
                        in your browser.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFile } from "@/services/webApis/webApis";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import InvalidFileComponent from "@/components/InvalidFileComponent";
import { base64ToUint8Array } from "@/lib/utils";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

type DecryptStatus = "idle" | "decrypting" | "complete" | "error";

export function DecryptPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const { fileId } = useParams();
  const location = useLocation();

  const locationState = (location.state as { from?: string })?.from;
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<DecryptStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);

  if (!fileId || isNaN(parseInt(atob(fileId)))) {
    return <InvalidFileComponent />;
  }

  const { isFetching, data } = useQuery({
    queryKey: ["file", atob(fileId || "")],
    queryFn: () => getFile(atob(fileId || "")),
    enabled: !!fileId,
  });

  const handleDecrypt = async (propData: any) => {
    try {
      const fileSrc = propData?.src;
      const iv = base64ToUint8Array(propData.iv);
      const keyIv = base64ToUint8Array(propData.keyIv);
      const salt = base64ToUint8Array(propData.salt);
      const encryptedAesKey = base64ToUint8Array(propData.encryptedAesKey);

      if (!fileSrc || !iv || !keyIv || !salt || !encryptedAesKey) {
        throw new Error("Missing file data.");
      }

      if (!password) {
        setErrorMessage("Password is required.");
        setStatus("error");
        return;
      }

      setStatus("decrypting");
      setProgress(10);

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

      setProgress(40);

      const rawAesKey = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: keyIv },
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
      const encryptedBuffer = await response.arrayBuffer();

      setProgress(70);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        decryptedAesKey,
        encryptedBuffer
      );

      setProgress(100);
      setStatus("complete");

      const blob = new Blob([decryptedBuffer], {
        type: propData.mimeType || "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = propData.name || "decrypted_file";
      a.click();
      setShowConfetti(true);
      URL.revokeObjectURL(url);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Decryption failed. Please check your password or the file."
      );
      setPassword("");
      setProgress(0);
    }
  };

  return (
    <div className="container max-w-2xl py-12 space-y-6">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500} // more confetti
        recycle={false}
        run={showConfetti}
      />

      {isFetching ? (
        <CardSkeleton />
      ) : (
        <div className="space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-semibold">Secure File Access</h1>
            <p className="text-muted-foreground text-sm">
              {locationState === "myFiles"
                ? "You're decrypting your uploaded file."
                : "Decrypt this file securely in your browser. Your data never leaves your device."}
            </p>
          </header>

          <section className="rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-2">File Details</h2>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>Name:</strong> {data.name}
                </li>
                <li>
                  <strong>Size:</strong> {(data.size / 1024 / 1024).toFixed(2)}{" "}
                  MB
                </li>
                {data.expiresIn && (
                  <li>
                    <strong>Expires in:</strong> 23 hours
                  </li>
                )}
              </ul>
            </div>
            <div className="p-6">
              {status === "idle" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <button
                    disabled={!password}
                    onClick={() => handleDecrypt(data)}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Decrypt File
                  </button>
                </div>
              )}

              {status === "decrypting" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Decrypting file...
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === "complete" && (
                <div className="p-4 bg-green-100 rounded-md flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium">
                    File successfully decrypted and downloaded.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-red-100 rounded-md flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      {errorMessage}
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

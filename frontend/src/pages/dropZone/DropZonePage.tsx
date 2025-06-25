import React, { useCallback, useState } from "react";
import { Upload, Loader2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export function DropZonePage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "complete">(
    "idle"
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    },
    []
  );

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");

    // Simulate encryption/upload delay
    setProgress(30);
    await new Promise((r) => setTimeout(r, 500));

    setProgress(80);
    await new Promise((r) => setTimeout(r, 1000));

    setProgress(100);
    setStatus("complete");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Secure Drop Zone</h2>
        <p className="text-muted-foreground text-sm">
          Drop a file to send securely. Only the recipient can decrypt it.
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-muted-foreground/40 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 bg-muted hover:border-primary transition-colors"
      >
        {!file ? (
          <>
            <Upload className="w-8 h-8 text-primary" />
            <p className="font-medium text-sm">
              Drag & drop or click to upload
            </p>
            <Input
              type="file"
              onChange={handleFileChange}
              className="w-auto cursor-pointer"
            />
          </>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setProgress(0);
                  setStatus("idle");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {status === "uploading" && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">
                  Uploading and encrypting...
                </p>
              </div>
            )}

            {status === "complete" && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <Check className="h-4 w-4" />
                File uploaded securely!
              </div>
            )}

            {status === "idle" && (
              <Button className="w-full mt-2" onClick={handleUpload}>
                Encrypt & Upload
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

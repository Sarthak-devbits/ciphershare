import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Download, Lock } from 'lucide-react';
type DecryptStatus = 'idle' | 'decrypting' | 'complete' | 'error';
export function DecryptPage() {
  const {
    fileId
  } = useParams();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<DecryptStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    expiresIn?: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  // Check if key is in URL fragment
  useEffect(() => {
    const fragment = location.hash;
    if (fragment && fragment.includes('key=')) {
      // Auto decrypt with key from fragment
      setFileInfo({
        name: 'confidential-document.pdf',
        size: 2.4 * 1024 * 1024,
        expiresIn: '23 hours'
      });
      handleAutoDecrypt();
    } else {
      // Need password
      setFileInfo({
        name: 'confidential-document.pdf',
        size: 2.4 * 1024 * 1024,
        expiresIn: '23 hours'
      });
    }
  }, [location.hash]);
  const handleAutoDecrypt = useCallback(() => {
    setStatus('decrypting');
    setProgress(0);
    const decryptInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(decryptInterval);
          setStatus('complete');
          return 100;
        }
        return newProgress;
      });
    }, 100);
  }, []);
  const handleDecrypt = useCallback(() => {
    setStatus('decrypting');
    setProgress(0);
    setErrorMessage('');
    const decryptInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(decryptInterval);
          // Simulate password validation
          if (password === 'correct') {
            setStatus('complete');
          } else {
            setStatus('error');
            setErrorMessage('Decryption failed. Please check your password.');
          }
          return newProgress >= 100 ? 100 : newProgress;
        }
        return newProgress;
      });
    }, 100);
  }, [password]);
  const handleDownload = useCallback(() => {
    // Simulate file download
    alert('Starting download...');
  }, []);
  return <div className="container py-12 max-w-lg">
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
        {fileInfo && <div className="p-6 border-b">
            <h3 className="font-medium mb-2">File Details</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{' '}
                {fileInfo.name}
              </p>
              <p>
                <span className="text-muted-foreground">Size:</span>{' '}
                {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {fileInfo.expiresIn && <p>
                  <span className="text-muted-foreground">Expires in:</span>{' '}
                  {fileInfo.expiresIn}
                </p>}
            </div>
          </div>}
        <div className="p-6">
          {/* Password Input (if needed) */}
          {status === 'idle' && location.hash.indexOf('key=') === -1 && <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  This file is password protected
                </label>
                <div className="relative">
                  <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password to unlock file" className="w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <button onClick={handleDecrypt} disabled={!password} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Decrypt File
              </button>
            </div>}
          {/* Decryption Progress */}
          {status === 'decrypting' && <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Decrypting file...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out" style={{
                width: `${progress}%`
              }}></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Decryption happens entirely in your browser. Your data remains
                private.
              </p>
            </div>}
          {/* Error State */}
          {status === 'error' && <div className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-md flex items-start">
                <div className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    {errorMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please try again with the correct password or contact the
                    sender.
                  </p>
                </div>
              </div>
              <button onClick={() => setStatus('idle')} className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                Try Again
              </button>
            </div>}
          {/* Success State */}
          {status === 'complete' && <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-md flex items-start">
                <div className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    File successfully decrypted
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your file is ready to download. It was decrypted locally in
                    your browser.
                  </p>
                </div>
              </div>
              <button onClick={handleDownload} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center justify-center">
                <Download className="mr-2 h-4 w-4" />
                Download File
              </button>
            </div>}
        </div>
      </div>
    </div>;
}
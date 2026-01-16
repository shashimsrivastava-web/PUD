
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

interface ScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Could not access camera. Please ensure permissions are granted.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Mock scan for demonstration as browser environment barcode API is experimental
  const simulateScan = () => {
    const mockCode = "TAG-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    onScan(mockCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 bg-slate-900 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Camera size={24} className="text-blue-400" />
            Scan Barcode
          </h3>
          <p className="text-slate-400 text-sm mt-1">Point your camera at the asset tag.</p>
        </div>

        <div className="aspect-square bg-black relative flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-center p-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 mx-auto bg-slate-800 px-4 py-2 rounded-lg text-white">
                <RefreshCw size={18} /> Retry
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/50 m-12 pointer-events-none rounded-xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500/50 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </>
          )}
        </div>

        <div className="p-6 flex flex-col gap-3">
          <button 
            onClick={simulateScan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Simulate Scan (Demo)
          </button>
          <p className="text-xs text-center text-slate-500">
            Real hardware decoding requires HTTPS and specific browser APIs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scanner;

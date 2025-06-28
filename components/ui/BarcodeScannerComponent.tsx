"use client"; // <<< ENSURE THIS IS THE ABSOLUTE FIRST LINE OF THE FILE

import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onScan: (barcode: string, scanTimeMs: number) => void;
}

export function BarcodeScannerComponent({ onScan }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanStartTime, setScanStartTime] = useState<number | null>(null);

  // Use useZxing hook directly.
  // The 'ref' is always passed to the <video> element.
  // The 'paused' prop controls whether the camera stream is active.
  const { ref } = useZxing({
    onDecodeResult(result) {
      if (scanStartTime !== null) {
        const scanEndTime = performance.now();
        const scanDuration = scanEndTime - scanStartTime;
        onScan(result.getText(), scanDuration);
        // Automatically stop scanning after a successful scan
        setScanning(false);
        setScanStartTime(null);
      }
    },
    onError(error) {
      console.error("ZXing Error:", error);
      // You can add more user-friendly error display here, e.g., a toast or message box
    },
    // CRITICAL: Specify constraints, including facingMode for the camera
    constraints: {
      video: {
        facingMode: 'environment', // Prioritize the back camera for scanning
        // You can also try 'user' for the front camera, or simply true for default behavior.
        // For production, you might want to allow the user to select the camera.
      },
      audio: false, // No audio needed for barcode scanning
    },
    // CRITICAL: Control the camera stream activation with the 'paused' prop.
    // When 'scanning' is false, the camera stream will be paused.
    // When 'scanning' is true, the camera stream will be active.
    paused: !scanning,
  });

  const handleScanStart = () => {
    setScanStartTime(performance.now());
    setScanning(true);
  };

  const handleScanStop = () => {
    setScanning(false);
    setScanStartTime(null);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Barcode Scanner</h2>

      {/* Always render the video element and its container.
        Control its visibility using CSS 'display' property.
        This ensures the 'ref' is always attached to a mounted DOM element
        for useZxing to work consistently.
      */}
      <div
        className="relative w-full max-w-md aspect-video bg-gray-200 rounded-lg overflow-hidden"
        style={{ display: scanning ? 'block' : 'none' }} // Hide/show the video container
      >
        {/* The video element itself, managed by useZxing via the ref */}
        <video ref={ref} className="w-full h-full object-cover" />

        {/* Overlay and Stop button, only visible when scanning is active */}
        {scanning && (
          <>
            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-2/4 border-2 border-green-500 rounded-lg animate-pulse"></div>
            </div> */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-3/4 h-2/4 rounded-lg overflow-hidden">
                {/* 4 Corner Borders */}
                <div className="absolute top-0 left-0 w-8 h-1 bg-green-500 rounded-sm" />
                <div className="absolute top-0 left-0 w-1 h-8 bg-green-500 rounded-sm" />

                <div className="absolute top-0 right-0 w-8 h-1 bg-green-500 rounded-sm" />
                <div className="absolute top-0 right-0 w-1 h-8 bg-green-500 rounded-sm" />

                <div className="absolute bottom-0 left-0 w-8 h-1 bg-green-500 rounded-sm" />
                <div className="absolute bottom-0 left-0 w-1 h-8 bg-green-500 rounded-sm" />

                <div className="absolute bottom-0 right-0 w-8 h-1 bg-green-500 rounded-sm" />
                <div className="absolute bottom-0 right-0 w-1 h-8 bg-green-500 rounded-sm" />

                {/* Scan Line */}
                <div
                  className="absolute left-0 w-full h-0.5 bg-red-400 animate-[scan_2s_ease-in-out_infinite]"
                  style={{
                    animationName: "scan",
                    animationDuration: "2s",
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                    animationDirection: "alternate",
                    position: "absolute",
                    top: 0,
                    animationFillMode: "forwards",
                  }}
                />
              </div>

              {/* Global keyframes */}
              <style jsx global>{`
                  @keyframes scan {
                    0% {
                        top: 0%;
                      }
                    100% {
                          top: 90%;
                        }
                    }
                  `}
              </style>
            </div>
            <Button className="mt-4" onClick={handleScanStop}>Stop Scanning</Button>
          </>
        )}
      </div>

      {/* Show the "Start Scanning" button only when not currently scanning */}
      {!scanning && (
        <Button onClick={handleScanStart}>Start Scanning</Button>
      )}
    </div>
  );
}
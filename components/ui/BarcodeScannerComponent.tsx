// "use client";

// import React, { useState, useRef } from 'react';
// import { BarcodeScanner } from 'react-barcode-detection';
// import { Button } from './button';

// interface BarcodeScannerProps {
//     onScan: (barcode: string, scanTimeMs: number) => void;
// }

// export function BarcodeScannerComponent({ onScan }: BarcodeScannerProps) {
//     const [scanning, setScanning] = useState(false);
//     const [barcodeData, setBarcodeData] = useState<string | undefined>(undefined);
//     const [scanStartTime, setScanStartTime] = useState<number | null>(null);
//     const videoRef = useRef<HTMLVideoElement>(null);

//     const handleScanStart = () => {
//         setBarcodeData(undefined);
//         setScanStartTime(performance.now());
//         setScanning(true);
//     };

//     const handleScanStop = () => {
//         setScanning(false);
//         setScanStartTime(null);
//     };

//     const handleBarcodeDetected = (data: string | undefined) => {
//         if (data && scanStartTime !== null) {
//             const scanEndTime = performance.now();
//             const scanDuration = scanEndTime - scanStartTime;
//             setBarcodeData(data);
//             onScan(data, scanDuration);
//             handleScanStop(); // Stop scanning after a successful detection
//         }
//     };

//     return (
//         <div className="flex flex-col items-center p-4">
//             <h2 className="text-2xl font-bold mb-4">Barcode Scanner</h2>
//             {scanning ? (
//                 <div className="relative w-full max-w-md aspect-video bg-gray-200 rounded-lg overflow-hidden">
//                     <BarcodeScanner
//                         onData={handleBarcodeDetected}
//                         videoRef={videoRef}
//                         video={<video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />}
//                         facingMode="environment"
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                         <div className="w-3/4 h-1/4 border-2 border-green-500 rounded-lg animate-pulse"></div>
//                     </div>
//                     <Button className="mt-4" onClick={handleScanStop}>Stop Scanning</Button>
//                 </div>
//             ) : (
//                 <Button onClick={handleScanStart}>Start Scanning</Button>
//             )}

//             {barcodeData && (
//                 <div className="mt-4 text-center">
//                     <p className="text-lg">Last Scanned Barcode: <span className="font-semibold">{barcodeData}</span></p>
//                 </div>
//             )}
//         </div>
//     );
// }

// components/BarcodeScannerComponent.tsx
"use client"; // Keep this at the very top!

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useZxing } from 'react-zxing';

interface BarcodeScannerProps {
    onScan: (barcode: string, scanTimeMs: number) => void;
}

export function BarcodeScannerComponent({ onScan }: BarcodeScannerProps) {
    const [scanning, setScanning] = useState(false);
    const [scanStartTime, setScanStartTime] = useState<number | null>(null);

    // Use useZxing hook directly
    const { ref } = useZxing({
        onDecodeResult(result) {
            if (scanStartTime !== null) {
                const scanEndTime = performance.now();
                const scanDuration = scanEndTime - scanStartTime;
                onScan(result.getText(), scanDuration);
                // You might want to stop scanning automatically after a successful scan
                setScanning(false); // Stop the scanner
                setScanStartTime(null);
            }
        },
        onError(error) {
            console.error("ZXing Error:", error);
            // Handle error, e.g., show an alert or message to the user
        },
        // Optional: specify allowed formats if you only want certain types of barcodes
        // formats: ["ean_13", "qr_code", "code_128"],
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
            {scanning ? (
                <div className="relative w-full max-w-md aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {/* The video element is managed by useZxing hook via the ref */}
                    <video ref={ref} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-3/4 h-1/4 border-2 border-green-500 rounded-lg animate-pulse"></div>
                    </div>
                    <Button className="mt-4" onClick={handleScanStop}>Stop Scanning</Button>
                </div>
            ) : (
                <Button onClick={handleScanStart}>Start Scanning</Button>
            )}
        </div>
    );
}
"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { BarcodeScannerComponent } from '@/components/ui/BarcodeScannerComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductInfo {
  barcode: string;
  name: string;
  price: number;
}

interface ScannedProduct extends ProductInfo {
  scanTime: string; // Formatted date and time
  scanDurationMs: number; // Time it took to scan
}

// Mock product database
const mockProducts: ProductInfo[] = [
  { barcode: "123456789012", name: "Milk (1 Liter)", price: 1.99 },
  { barcode: "987654321098", name: "Bread (Whole Wheat)", price: 2.50 },
  { barcode: "555111222333", name: "Eggs (Dozen)", price: 3.20 },
  { barcode: "112233445566", name: "Apple Juice (1L)", price: 2.80 },
  { barcode: "667788990011", name: "Cereal (Corn Flakes)", price: 4.50 },
];

const getProductInfo = (barcode: string): ProductInfo | null => {
  return mockProducts.find(p => p.barcode === barcode) || null;
};

export default function HomePage() {
  const [scannedItems, setScannedItems] = useState<ScannedProduct[]>([]);
   const [manualBarcode, setManualBarcode] = useState<string>('');

  const handleBarcodeScan = (barcode: string, scanDurationMs: number) => {
    const product = getProductInfo(barcode);
    if (product) {
      const newScannedItem: ScannedProduct = {
        ...product,
        scanTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        scanDurationMs: parseFloat(scanDurationMs.toFixed(2)), // Round to 2 decimal places
      };
      setScannedItems(prevItems => [...prevItems, newScannedItem]);
    } else {
      alert(`Product not found for barcode: ${barcode}`);
      // Optionally add a generic item for unknown barcodes
      setScannedItems(prevItems => [...prevItems, {
        barcode,
        name: "Unknown Product",
        price: 0.00,
        scanTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        scanDurationMs: parseFloat(scanDurationMs.toFixed(2)),
      }]);
    }
  };

    // New handler for manual input
  const handleManualScan = () => {
    if (manualBarcode.trim()) {
      // Use a dummy scan duration, or a small random number
      handleBarcodeScan(manualBarcode.trim(), Math.random() * 50 + 100); // 100-150ms
      setManualBarcode(''); // Clear the input field
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center mb-8">Barcode Scanner App</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Scan Barcode</CardTitle>
        </CardHeader>
        <CardContent>
          <BarcodeScannerComponent onScan={handleBarcodeScan} />
          {/* Manual Input Section */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Manual Barcode Entry</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter barcode manually"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={(e) => { // Allow pressing Enter to scan
                  if (e.key === 'Enter') {
                    handleManualScan();
                  }
                }}
              />
              <Button onClick={handleManualScan}>Add Manually</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scanned Products</CardTitle>
        </CardHeader>
        <CardContent>
          {scannedItems.length === 0 ? (
            <p className="text-center text-gray-500">No products scanned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barcode</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Scan Time (UTC)</TableHead>
                    <TableHead>Scan Duration (ms)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scannedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.barcode}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.scanTime}</TableCell>
                      <TableCell>{item.scanDurationMs} ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Laptop, Smartphone, Upload, QrCode, Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useState, useEffect } from 'react';

const devices = [
  { icon: <Laptop className="h-5 w-5 text-muted-foreground" />, name: 'Chrome on macOS', location: 'New York, USA', lastActive: 'Active now' },
  { icon: <Smartphone className="h-5 w-5 text-muted-foreground" />, name: 'WaChat for iOS', location: 'London, UK', lastActive: '2 hours ago' },
  { icon: <Laptop className="h-5 w-5 text-muted-foreground" />, name: 'Firefox on Windows', location: 'Paris, France', lastActive: '1 day ago' },
];

export default function SettingsClient() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const generateDeviceLinkToken = async () => {
    if (!user || !firestore) return null;
    setIsGeneratingQr(true);
    try {
      // This is a simplified token generation. In a real app, use a secure random string.
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // In a real implementation, you would store this token in a secure 'deviceLinkTokens' collection in Firestore
      // with a short TTL (e.g., 5 minutes).

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wachat-app.vercel.app';
      const linkUrl = `${appUrl}/link?token=${token}`;
      
      setQrCodeData(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(linkUrl)}`);

    } catch (error) {
      console.error("Error generating QR code token:", error);
      setQrCodeData(null);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'qrcode' && !qrCodeData) {
      generateDeviceLinkToken();
    }
  };

  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="devices">Linked Devices</TabsTrigger>
              <TabsTrigger value="qrcode">My QR Code</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Change Photo
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.displayName || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea id="about" placeholder="Hey there! I am using WaChat." />
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Update Profile</Button>
              </div>
            </TabsContent>
            <TabsContent value="devices" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Device Management</h3>
                    <p className="text-sm text-muted-foreground">
                      These devices are currently linked to your WaChat account.
                    </p>
                  </div>
                   <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Link New Device</Button>
                </div>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {devices.map((device, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              {device.icon}
                              {device.name}
                            </div>
                          </TableCell>
                          <TableCell>{device.location}</TableCell>
                          <TableCell>{device.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Log out</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="qrcode" className="mt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-white rounded-lg border h-[216px] w-[216px] flex items-center justify-center">
                  {isGeneratingQr && !qrCodeData && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
                  {qrCodeData && (
                    <Image
                      src={qrCodeData}
                      alt="Your device linking QR Code"
                      width={200}
                      height={200}
                      data-ai-hint="qr code"
                      unoptimized // Necessary for external dynamic images
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Link a Device</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    To use WaChat on another device, scan this QR code with the new device.
                  </p>
                </div>
                <Button variant="outline" onClick={generateDeviceLinkToken} disabled={isGeneratingQr}>
                  {isGeneratingQr ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Regenerating...</> : 'Regenerate Code'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

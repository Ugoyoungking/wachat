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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Laptop, Smartphone, Upload, QrCode } from 'lucide-react';

const devices = [
  { icon: <Laptop className="h-5 w-5 text-muted-foreground" />, name: 'Chrome on macOS', location: 'New York, USA', lastActive: 'Active now' },
  { icon: <Smartphone className="h-5 w-5 text-muted-foreground" />, name: 'WaChat for iOS', location: 'London, UK', lastActive: '2 hours ago' },
  { icon: <Laptop className="h-5 w-5 text-muted-foreground" />, name: 'Firefox on Windows', location: 'Paris, France', lastActive: '1 day ago' },
];

export default function SettingsClient() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');
  const qrCodeImage = PlaceHolderImages.find((p) => p.id === 'qr-code');

  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="devices">Linked Devices</TabsTrigger>
              <TabsTrigger value="qrcode">My QR Code</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Change Photo
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="john.doe@example.com" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea id="about" defaultValue="Hey there! I am using WaChat." />
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
                <div className="p-4 bg-white rounded-lg border">
                  {qrCodeImage && (
                    <Image
                      src={qrCodeImage.imageUrl}
                      alt="Your QR Code"
                      width={200}
                      height={200}
                      data-ai-hint={qrCodeImage.imageHint}
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Your QR Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Friends can scan this code to add you on WaChat.
                  </p>
                </div>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import FilesService from '@/service/FilesService';

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProfileImageUploadProps {
  currentImage?: string;
  userInitials?: string;
  onImageUpdate?: (imageUrl: string) => void;
  userId?: number;
  token?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImage,
  userInitials = "?",
  onImageUpdate,
  userId,
  token
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    console.log("onCropComplete called:", { croppedArea, croppedAreaPixels });
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!FilesService.isValidImageFormat(file)) {
      toast.error("Please select a valid image file (JPEG, JPG, or PNG)");
      return;
    }

    // Validate file size (5MB limit)
    if (!FilesService.isValidFileSize(file, 5)) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      const imageUrl = await FilesService.createPreviewUrl(file);
      setSelectedImage(imageUrl);
      setOriginalFile(file);
      setIsDialogOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      toast.error("Failed to load image");
    }
  };

  const createCroppedImage = useCallback(async (): Promise<File | null> => {
    if (!selectedImage || !croppedAreaPixels || !originalFile) {
      console.error("Missing required data for cropping:", { selectedImage: !!selectedImage, croppedAreaPixels: !!croppedAreaPixels, originalFile: !!originalFile });
      return null;
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();

      image.onload = () => {
        try {
          const { width, height } = croppedAreaPixels;
          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            // Clear canvas with transparent background
            ctx.clearRect(0, 0, width, height);
            
            ctx.drawImage(
              image,
              croppedAreaPixels.x,
              croppedAreaPixels.y,
              width,
              height,
              0,
              0,
              width,
              height
            );

            canvas.toBlob((blob) => {
              if (blob) {
                const croppedFile = new File([blob], `cropped_${originalFile.name}`, {
                  type: originalFile.type,
                  lastModified: Date.now()
                });
                console.log("Cropped file created:", croppedFile);
                resolve(croppedFile);
              } else {
                console.error("Failed to create blob from canvas");
                reject(new Error("Failed to create blob from canvas"));
              }
            }, originalFile.type, 0.9);
          } else {
            console.error("Failed to get canvas context");
            reject(new Error("Failed to get canvas context"));
          }
        } catch (error) {
          console.error("Error in image.onload:", error);
          reject(error);
        }
      };

      image.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(new Error("Failed to load image"));
      };

      image.crossOrigin = 'anonymous';
      image.src = selectedImage;
    });
  }, [selectedImage, croppedAreaPixels, originalFile]);

  const handleCropSave = async () => {
    console.log("Starting crop save process...");
    console.log("Current state:", { 
      croppedAreaPixels: !!croppedAreaPixels, 
      userId, 
      token: !!token,
      selectedImage: !!selectedImage,
      originalFile: !!originalFile
    });

    if (!croppedAreaPixels || userId === undefined || userId === null || !token) {
      console.error("Missing required data for upload");
      toast.error("Missing required data for upload");
      return;
    }

    setIsUploading(true);
    try {
      console.log("Creating cropped image...");
      const croppedFile = await createCroppedImage();
      
      if (!croppedFile) {
        console.error("Failed to create cropped image");
        toast.error("Failed to crop image");
        return;
      }

      console.log("Uploading cropped image...", croppedFile);
      const result = await FilesService.uploadProfilePicture(croppedFile, userId, token);
      console.log("Upload result:", result);
      
      if (result.statusCode === 200 && result.fileUrl) {
        console.log("Upload successful:", result.fileUrl);
        setPreviewUrl(result.fileUrl);
        onImageUpdate?.(result.fileUrl);
        toast.success("Profile picture updated successfully!");
        setIsDialogOpen(false);
        handleDialogClose();
      } else {
        console.error("Upload failed:", result);
        toast.error(result.message || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error in handleCropSave:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDialogClose = () => {
    setSelectedImage(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsDialogOpen(false);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpdate?.("");
    toast.success("Profile picture removed");
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          {displayImage ? (
            <AvatarImage src={displayImage} alt="Profile" className="object-cover" />
          ) : (
            <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {userInitials}
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* Camera Icon Overlay */}
        <div className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-2 cursor-pointer transition-colors">
          <Label htmlFor="profile-image" className="cursor-pointer">
            <Camera size={16} className="text-white" />
          </Label>
        </div>
      </div>

      {/* Hidden File Input */}
      <Input
        id="profile-image"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Crop Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Cropper */}
            {selectedImage && (
              <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
            )}
            
            {/* Zoom Control */}
            <div className="space-y-2">
              <Label htmlFor="zoom">Zoom</Label>
              <Input
                id="zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropSave}
              disabled={isUploading || !croppedAreaPixels || userId === undefined || userId === null || !token}
            >
              {isUploading ? "Uploading..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileImageUpload;

import axios from "axios";

// Type definitions matching backend FilesReqRes DTO
interface FilesReqRes {
  statusCode?: number;
  error?: string;
  message?: string;
  fileUrl?: string;
}

class FilesService {
  static BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /**
   * Upload profile picture for a user
   * @param file - The image file to upload (JPEG, JPG, PNG)
   * @param userId - The ID of the user
   * @param token - Authentication token
   * @returns Promise with upload response
   */
  static async uploadProfilePicture(
    file: File, 
    userId: number, 
    token: string
  ): Promise<FilesReqRes> {
    try {
      // Validate file type on frontend
      if (!this.isValidImageFormat(file)) {
        return {
          statusCode: 400,
          error: "Invalid file format",
          message: "Only JPEG, JPG, and PNG image formats are allowed"
        };
      }

      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${this.BASE_URL}/file/upload/profile_pic/${userId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorData: FilesReqRes = error.response.data;
        return {
          statusCode: error.response.status,
          error: errorData.error || "Upload failed",
          message: errorData.message || "Failed to upload profile picture"
        };
      }
      
      return {
        statusCode: 500,
        error: "Network Error",
        message: "Failed to upload profile picture. Please try again."
      };
    }
  }

  /**
   * Upload lesson picture
   * @param file - The image file to upload (JPEG, JPG, PNG)
   * @param lessonId - The ID of the lesson
   * @param token - Authentication token
   * @returns Promise with upload response
   */
  static async uploadLessonPicture(
    file: File, 
    lessonId: number, 
    token: string
  ): Promise<FilesReqRes> {
    try {
      // Validate file type on frontend
      if (!this.isValidImageFormat(file)) {
        return {
          statusCode: 400,
          error: "Invalid file format",
          message: "Only JPEG, JPG, and PNG image formats are allowed"
        };
      }

      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${this.BASE_URL}/file/upload/lesson_pic/${lessonId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading lesson picture:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorData: FilesReqRes = error.response.data;
        return {
          statusCode: error.response.status,
          error: errorData.error || "Upload failed",
          message: errorData.message || "Failed to upload lesson picture"
        };
      }
      
      return {
        statusCode: 500,
        error: "Network Error",
        message: "Failed to upload lesson picture. Please try again."
      };
    }
  }

  /**
   * Validate if the file is a valid image format
   * @param file - The file to validate
   * @returns boolean indicating if the format is valid
   */
  static isValidImageFormat(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png'
    ];
    return validTypes.includes(file.type);
  }

  /**
   * Validate file size (optional - add size limits)
   * @param file - The file to validate
   * @param maxSizeMB - Maximum size in MB (default: 5MB)
   * @returns boolean indicating if the size is valid
   */
  static isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    return file.size <= maxSizeBytes;
  }

  /**
   * Get file size in human readable format
   * @param bytes - File size in bytes
   * @returns formatted string (e.g., "2.5 MB")
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Create a preview URL for the selected file
   * @param file - The file to create preview for
   * @returns Promise with the preview URL
   */
  static createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export default FilesService;

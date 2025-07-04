
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import LessonsService from "@/service/LessonsService";
import FilesService from "@/service/FilesService";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  instrument: z.string().min(1, "Instrument is required").max(50, "Instrument must be less than 50 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  locationType: z.enum(["ONLINE", "IN_PERSON", "HYBRID"], {
    required_error: "Please select a location type",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  meetingLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  physicalAddress: z.string().max(200, "Address must be less than 200 characters").optional(),
  image: z.instanceof(FileList).optional(),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
);

type FormData = z.infer<typeof formSchema>;

const CreateLesson = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Get token from localStorage
  const token = localStorage.getItem('token') || "";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      instrument: "",
      description: "",
      startTime: "",
      endTime: "",
      meetingLink: "",
      physicalAddress: "",
    },
  });

  const locationType = form.watch("locationType");
  const imageFiles = form.watch("image");

  // Handle image preview
  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Clean up image preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        setImagePreview(null);
      }
    };
  }, [imagePreview]);

  const onSubmit = async (data: FormData) => {
    console.log("user: ", user);
    console.log("token: ", token);
    if (!user?.id || !token) {
      toast.error("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare lesson data for backend
      const lessonData = {
        title: data.title,
        instrument: data.instrument,
        description: data.description,
        location: data.locationType,
        startDate: format(data.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(data.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        startTime: `${format(data.startDate, "yyyy-MM-dd")}T${data.startTime}:00`,
        endTime: `${format(data.endDate, "yyyy-MM-dd")}T${data.endTime}:00`,
        meetingLink: data.meetingLink || undefined,
        physicalAddress: data.physicalAddress || undefined,
      };

      // Step 1: Create the lesson
      console.log("Creating lesson with data:", lessonData);
      const createResponse = await LessonsService.createLesson(lessonData, user.id, token);
      
      if (createResponse.statusCode !== 200 || !createResponse.lesson) {
        throw new Error(createResponse.message || "Failed to create lesson");
      }

      const createdLesson = createResponse.lesson;
      console.log("Lesson created successfully:", createdLesson);

      // Step 2: Upload image if provided
      if (data.image?.[0] && createdLesson.id) {
        console.log("Uploading lesson image...");
        const uploadResponse = await FilesService.uploadLessonPicture(
          data.image[0], 
          createdLesson.id, 
          token
        );
        
        if (uploadResponse.statusCode !== 200) {
          console.warn("Image upload failed:", uploadResponse.message);
          // Don't fail the entire process if image upload fails
          toast.success("Lesson created successfully, but image upload failed. You can add an image later.");
        } else {
          console.log("Image uploaded successfully:", uploadResponse.fileUrl);
          toast.success("Lesson created successfully!");
        }
      } else {
        toast.success("Lesson created successfully!");
      }

      // Step 3: Navigate back to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Error creating lesson:", error);
      if (error instanceof Error) {
        toast.error(`Failed to create lesson: ${error.message}`);
      } else {
        toast.error("Failed to create lesson. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showMeetingLink = locationType === "ONLINE" || locationType === "HYBRID";
  const showPhysicalAddress = locationType === "IN_PERSON" || locationType === "HYBRID";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Lesson</h1>
          <p className="text-gray-600">Fill out the details for your music lesson</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Piano Fundamentals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Instrument */}
              <FormField
                control={form.control}
                name="instrument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrument *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Piano" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Piano lesson for beginners covering basic scales and simple songs"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Lesson Image *</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Lesson preview"
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setImagePreview(null);
                                onChange(null);
                                // Reset the file input value so the same file can be selected again
                                const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.value = '';
                                }
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                        
                        {/* Upload Area */}
                        {!imagePreview && (
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="image-upload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> an image
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                              </div>
                            </label>
                          </div>
                        )}
                        
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            onChange(files);
                            handleImageChange(files);
                          }}
                          {...field}
                        />
                        
                        {/* Upload button when preview exists */}
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="w-full"
                          >
                            Change Image
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image to represent your lesson (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Type */}
              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="IN_PERSON">In Person</SelectItem>
                        <SelectItem value="HYBRID">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditional Fields */}
              {showMeetingLink && (
                <FormField
                  control={form.control}
                  name="meetingLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Link</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://zoom.us/j/123456789" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Required for online and hybrid lessons
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showPhysicalAddress && (
                <FormField
                  control={form.control}
                  name="physicalAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., 123 Main St, Evanston, IL 60201"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Required for in-person and hybrid lessons
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Lesson..." : "Create Lesson"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
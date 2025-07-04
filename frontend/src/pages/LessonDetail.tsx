import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, MessageCircle, Clock, MapPin, Link, Music, Loader2 } from "lucide-react";
import LessonsService, { Lesson } from "@/service/LessonsService";

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        if (!id) {
          throw new Error('No lesson ID provided');
        }

        const lessonId = parseInt(id);
        if (isNaN(lessonId)) {
          throw new Error('Invalid lesson ID');
        }
        
        const response = await LessonsService.getLessonById(lessonId, token);
        if (response.lesson) {
          setLesson(response.lesson);
        } else {
          throw new Error('Lesson not found');
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="text-lg text-gray-600">Loading lesson details...</span>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              {error ? 'Error Loading Lesson' : 'Lesson Not Found'}
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "The lesson you're looking for doesn't exist."}
            </p>
            <div className="space-x-2">
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
              {error && (
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Retry
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'HYBRID': return 'bg-blue-100 text-blue-800';
      case 'IN_PERSON': return 'bg-green-100 text-green-800';
      case 'ONLINE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationDisplayName = (location: string) => {
    switch (location) {
      case 'HYBRID': return 'Hybrid';
      case 'IN_PERSON': return 'In Person';
      case 'ONLINE': return 'Online';
      default: return location;
    }
  };

  const handleChatWithInstructor = () => {
    console.log("Chat function is disabled for now")
    // navigate(`/chat/${lesson.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{lesson.title}</CardTitle>
                    <CardDescription className="text-lg">
                      Learn {lesson.instrument} with {lesson.teacher.firstName} {lesson.teacher.lastName}
                    </CardDescription>
                  </div>
                  <Badge className={getLocationColor(lesson.location)}>
                    {getLocationDisplayName(lesson.location)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Course Image */}
                <div className="mb-6">
                  {lesson.imageUrl ? (
                    <img 
                      src={lesson.imageUrl} 
                      alt={`${lesson.title} course poster`}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg shadow-md flex items-center justify-center">
                      <Music className="text-purple-300" size={64} />
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About This Lesson</h3>
                    <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Instructor</span>
                  </div>
                  <span className="font-medium">
                    {lesson.teacher.firstName} {lesson.teacher.lastName}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Start Date</span>
                  </div>
                  <span className="font-medium">{new Date(lesson.startDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">End Date</span>
                  </div>
                  <span className="font-medium">{new Date(lesson.endDate).toLocaleDateString()}</span>
                </div>
                
                {lesson.startTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Start Time</span>
                    </div>
                    <span className="font-medium">{new Date(lesson.startTime).toLocaleTimeString()}</span>
                  </div>
                )}
                
                {lesson.endTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">End Time</span>
                    </div>
                    <span className="font-medium">{new Date(lesson.endTime).toLocaleTimeString()}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Music size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Instrument</span>
                  </div>
                  <span className="font-medium">{lesson.instrument}</span>
                </div>
                
                {/* Address for In Person and Hybrid lessons */}
                {(lesson.location === 'IN_PERSON' || lesson.location === 'HYBRID') && lesson.physicalAddress && (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">Address</span>
                    </div>
                    <span className="font-medium text-right max-w-[60%]">{lesson.physicalAddress}</span>
                  </div>
                )}
                
                {/* Meeting Link for Online and Hybrid lessons */}
                {(lesson.location === 'ONLINE' || lesson.location === 'HYBRID') && lesson.meetingLink && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Link size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Meeting Link</span>
                    </div>
                    <a 
                      href={lesson.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-purple-600 hover:text-purple-800 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
                    onClick={handleChatWithInstructor}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Chat With Instructor
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    Connect with your instructor to discuss lesson details and schedule
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;

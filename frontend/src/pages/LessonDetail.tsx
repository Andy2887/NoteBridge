import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, MessageCircle, Clock, MapPin, Link, Music } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  instructor: string;
  instrument: string;
  location: 'Hybrid' | 'In Person' | 'Online';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  address?: string;
  meetingLink?: string;
  image: string;
}

// Same mock data as Dashboard - in a real app this would come from an API
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Piano Fundamentals',
    instructor: 'Sarah Johnson',
    instrument: 'Piano',
    location: 'In Person',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    description: 'Learn the basics of piano playing including scales, chords, and simple melodies.',
    address: '1847 Sheridan Rd, Evanston, IL 60208',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '2',
    title: 'Guitar Fingerpicking',
    instructor: 'Mike Chen',
    instrument: 'Guitar',
    location: 'Hybrid',
    startDate: '2025-02-01',
    endDate: '2025-04-01',
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    description: 'Master fingerpicking techniques for acoustic guitar with popular songs.',
    address: '1847 Sheridan Rd, Evanston, IL 60208',
    meetingLink: 'https://zoom.us/j/123456789',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '3',
    title: 'Violin for Beginners',
    instructor: 'Emma Davis',
    instrument: 'Violin',
    location: 'In Person',
    startDate: '2025-01-20',
    endDate: '2025-03-20',
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    description: 'Start your violin journey with proper posture, bowing, and basic songs.',
    address: '2120 Campus Dr, Evanston, IL 60208',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '4',
    title: 'Jazz Piano Improvisation',
    instructor: 'David Rodriguez',
    instrument: 'Piano',
    location: 'Online',
    startDate: '2025-02-15',
    endDate: '2025-05-15',
    startTime: '7:00 PM',
    endTime: '8:30 PM',
    description: 'Explore jazz harmony and learn to improvise over standard progressions.',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '5',
    title: 'Drums: Rock Beats',
    instructor: 'Alex Thompson',
    instrument: 'Drums',
    location: 'Hybrid',
    startDate: '2025-01-10',
    endDate: '2025-03-10',
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    description: 'Learn essential rock drum patterns and fills to play your favorite songs.',
    address: '1800 Sherman Ave, Evanston, IL 60201',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19%3a123',
    image: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '6',
    title: 'Classical Voice Training',
    instructor: 'Maria Gonzalez',
    instrument: 'Voice',
    location: 'Online',
    startDate: '2025-02-05',
    endDate: '2025-04-05',
    startTime: '6:00 PM',
    endTime: '7:00 PM',
    description: 'Develop proper breathing, posture, and vocal techniques for classical singing.',
    meetingLink: 'https://zoom.us/j/987654321',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop&crop=center'
  }
];

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const lesson = mockLessons.find(l => l.id === id);
  
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
            <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'Hybrid': return 'bg-blue-100 text-blue-800';
      case 'In Person': return 'bg-green-100 text-green-800';
      case 'Online': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
                      Learn {lesson.instrument} with {lesson.instructor}
                    </CardDescription>
                  </div>
                  <Badge className={getLocationColor(lesson.location)}>
                    {lesson.location}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Course Image */}
                <div className="mb-6">
                  <img 
                    src={lesson.image} 
                    alt={`${lesson.title} course poster`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
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
                  <span className="font-medium">{lesson.instructor}</span>
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Start Time</span>
                  </div>
                  <span className="font-medium">{lesson.startTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">End Time</span>
                  </div>
                  <span className="font-medium">{lesson.endTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Music size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Instrument</span>
                  </div>
                  <span className="font-medium">{lesson.instrument}</span>
                </div>
                
                {/* Address for In Person and Hybrid lessons */}
                {(lesson.location === 'In Person' || lesson.location === 'Hybrid') && lesson.address && (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">Address</span>
                    </div>
                    <span className="font-medium text-right max-w-[60%]">{lesson.address}</span>
                  </div>
                )}
                
                {/* Meeting Link for Online and Hybrid lessons */}
                {(lesson.location === 'Online' || lesson.location === 'Hybrid') && lesson.meetingLink && (
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
                      Meeting Link
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

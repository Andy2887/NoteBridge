import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Music, Search, Clock, LogOut, User, Settings, MessageCircle, Plus } from "lucide-react";
import UserService from "@/service/AuthService";

interface Lesson {
  id: string;
  title: string;
  instructor: string;
  instrument: string;
  location: 'Hybrid' | 'In Person' | 'Online';
  startDate: string;
  endDate: string;
  description: string;
}

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Piano Fundamentals',
    instructor: 'Sarah Johnson',
    instrument: 'Piano',
    location: 'In Person',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    description: 'Learn the basics of piano playing including scales, chords, and simple melodies.'
  },
  {
    id: '2',
    title: 'Guitar Fingerpicking',
    instructor: 'Mike Chen',
    instrument: 'Guitar',
    location: 'Hybrid',
    startDate: '2025-02-01',
    endDate: '2025-04-01',
    description: 'Master fingerpicking techniques for acoustic guitar with popular songs.'
  },
  {
    id: '3',
    title: 'Violin for Beginners',
    instructor: 'Emma Davis',
    instrument: 'Violin',
    location: 'In Person',
    startDate: '2025-01-20',
    endDate: '2025-03-20',
    description: 'Start your violin journey with proper posture, bowing, and basic songs.'
  },
  {
    id: '4',
    title: 'Jazz Piano Improvisation',
    instructor: 'David Rodriguez',
    instrument: 'Piano',
    location: 'Online',
    startDate: '2025-02-15',
    endDate: '2025-05-15',
    description: 'Explore jazz harmony and learn to improvise over standard progressions.'
  },
  {
    id: '5',
    title: 'Drums: Rock Beats',
    instructor: 'Alex Thompson',
    instrument: 'Drums',
    location: 'Hybrid',
    startDate: '2025-01-10',
    endDate: '2025-03-10',
    description: 'Learn essential rock drum patterns and fills to play your favorite songs.'
  },
  {
    id: '6',
    title: 'Classical Voice Training',
    instructor: 'Maria Gonzalez',
    instrument: 'Voice',
    location: 'Online',
    startDate: '2025-02-05',
    endDate: '2025-04-05',
    description: 'Develop proper breathing, posture, and vocal techniques for classical singing.'
  }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const instruments = ["All", "Piano", "Guitar", "Violin", "Drums", "Voice"];
  const locations = ["All", "Hybrid", "In Person", "Online"];

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstrument = selectedInstrument === "All" || lesson.instrument === selectedInstrument;
    const matchesLocation = selectedLocation === "All" || lesson.location === selectedLocation;
    
    return matchesSearch && matchesInstrument && matchesLocation;
  });

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'Hybrid': return 'bg-blue-100 text-blue-800';
      case 'In Person': return 'bg-green-100 text-green-800';
      case 'Online': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Music className="text-purple-600" size={32} />
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/')}
            >
              NoteBridge
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Teacher Create Lesson Button */}
            {UserService.isTeacher() && (
              <Button 
                onClick={() => navigate('/create-lesson')}
                className="bg-orange-600 hover:bg-orange-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Create Lesson</span>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Welcome, {user?.firstName || user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search lessons or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Instrument:</span>
              {instruments.map(instrument => (
                <Button
                  key={instrument}
                  variant={selectedInstrument === instrument ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedInstrument(instrument)}
                  className={selectedInstrument === instrument ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {instrument}
                </Button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 self-center">Location:</span>
              {locations.map(location => (
                <Button
                  key={location}
                  variant={selectedLocation === location ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLocation(location)}
                  className={selectedLocation === location ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <Card 
              key={lesson.id} 
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleLessonClick(lesson.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <Badge className={getLocationColor(lesson.location)}>
                    {lesson.location}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-4 text-sm">
                  <span className="font-medium">{lesson.instructor}</span>
                  <span>•</span>
                  <span>{lesson.instrument}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                
                <div className="flex items-end justify-between">
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>Start: {new Date(lesson.startDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>End: {new Date(lesson.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLessonClick(lesson.id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <Music className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

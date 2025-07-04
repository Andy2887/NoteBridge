
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, User } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  instructor: string;
  instrument: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  rating: number;
  description: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'instructor';
  timestamp: Date;
}

// Same mock data as other pages
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Piano Fundamentals',
    instructor: 'Sarah Johnson',
    instrument: 'Piano',
    level: 'Beginner',
    duration: '60 min',
    price: 50,
    rating: 4.8,
    description: 'Learn the basics of piano playing including scales, chords, and simple melodies.'
  },
  {
    id: '2',
    title: 'Guitar Fingerpicking',
    instructor: 'Mike Chen',
    instrument: 'Guitar',
    level: 'Intermediate',
    duration: '45 min',
    price: 40,
    rating: 4.9,
    description: 'Master fingerpicking techniques for acoustic guitar with popular songs.'
  },
  {
    id: '3',
    title: 'Violin for Beginners',
    instructor: 'Emma Davis',
    instrument: 'Violin',
    level: 'Beginner',
    duration: '50 min',
    price: 55,
    rating: 4.7,
    description: 'Start your violin journey with proper posture, bowing, and basic songs.'
  },
  {
    id: '4',
    title: 'Jazz Piano Improvisation',
    instructor: 'David Rodriguez',
    instrument: 'Piano',
    level: 'Advanced',
    duration: '75 min',
    price: 70,
    rating: 4.9,
    description: 'Explore jazz harmony and learn to improvise over standard progressions.'
  },
  {
    id: '5',
    title: 'Drums: Rock Beats',
    instructor: 'Alex Thompson',
    instrument: 'Drums',
    level: 'Intermediate',
    duration: '60 min',
    price: 45,
    rating: 4.6,
    description: 'Learn essential rock drum patterns and fills to play your favorite songs.'
  },
  {
    id: '6',
    title: 'Classical Voice Training',
    instructor: 'Maria Gonzalez',
    instrument: 'Voice',
    level: 'Beginner',
    duration: '55 min',
    price: 60,
    rating: 4.8,
    description: 'Develop proper breathing, posture, and vocal techniques for classical singing.'
  }
];

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m excited to help you learn. Feel free to ask me any questions about the lesson or schedule.',
      sender: 'instructor',
      timestamp: new Date(Date.now() - 10 * 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const lesson = mockLessons.find(l => l.id === id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate instructor response after a delay
      setTimeout(() => {
        const instructorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! I\'ll get back to you soon with more details.',
          sender: 'instructor',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, instructorResponse]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/lesson/${id}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Lesson</span>
          </Button>
        </div>

        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {getInitials(lesson.instructor)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{lesson.instructor}</CardTitle>
                <p className="text-sm text-gray-600">{lesson.title} - {lesson.instrument}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                      {message.sender === 'instructor' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                            {getInitials(lesson.instructor)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            <User size={16} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;

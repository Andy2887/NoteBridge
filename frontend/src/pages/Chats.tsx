
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle } from "lucide-react";

interface ChatPreview {
  id: string;
  lessonId: string;
  lessonTitle: string;
  instructor: string;
  instrument: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Mock data for active chats
const mockChats: ChatPreview[] = [
  {
    id: '1',
    lessonId: '1',
    lessonTitle: 'Piano Fundamentals',
    instructor: 'Sarah Johnson',
    instrument: 'Piano',
    lastMessage: 'Thanks for your message! I\'ll get back to you soon with more details.',
    lastMessageTime: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    unreadCount: 2
  },
  {
    id: '2',
    lessonId: '2',
    lessonTitle: 'Guitar Fingerpicking',
    instructor: 'Mike Chen',
    instrument: 'Guitar',
    lastMessage: 'Great progress on the exercises! Let\'s schedule your next session.',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    unreadCount: 0
  },
  {
    id: '3',
    lessonId: '4',
    lessonTitle: 'Jazz Piano Improvisation',
    instructor: 'David Rodriguez',
    instrument: 'Piano',
    lastMessage: 'Here are some additional resources for jazz scales.',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    unreadCount: 1
  }
];

const Chats = () => {
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleChatClick = (lessonId: string) => {
    navigate(`/chat/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Chats</h1>
          <p className="text-gray-600">Continue your conversations with instructors</p>
        </div>

        {/* Chats List */}
        <div className="space-y-4">
          {mockChats.map((chat) => (
            <Card 
              key={chat.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleChatClick(chat.lessonId)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getInitials(chat.instructor)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.instructor}
                        </h3>
                        <span className="text-sm text-gray-500 ml-2">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">
                        {chat.lessonTitle} • {chat.instrument}
                      </p>
                      
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4">
                    {chat.unreadCount > 0 && (
                      <div className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                    <MessageCircle className="text-gray-400" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockChats.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-500 mb-4">Start chatting with instructors from your lessons.</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Browse Lessons
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;

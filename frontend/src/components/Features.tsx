
import { Card, CardContent } from "@/components/ui/card";
import { 
  Music, 
  Shield, 
  Calendar, 
  Star, 
  MessageCircle, 
  DollarSign,
  MapPin,
  Users
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Music,
      title: "All Instruments Welcome",
      description: "From violin to voice, piano to percussion - find instructors for any instrument or musical specialty.",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Northwestern Verified",
      description: "Safe, secure platform exclusively for Northwestern students with university email verification.",
      color: "text-indigo-600"
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book lessons that fit your academic schedule with easy calendar integration.",
      color: "text-blue-600"
    },
    {
      icon: Star,
      title: "Rated Instructors",
      description: "Read reviews and ratings from fellow students to find the perfect instructor for your needs.",
      color: "text-amber-600"
    },
    {
      icon: MessageCircle,
      title: "Direct Messaging",
      description: "Connect directly with instructors through our secure in-platform messaging system.",
      color: "text-green-600"
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description: "Student-friendly rates set by fellow Wildcats who understand the college budget.",
      color: "text-emerald-600"
    },
    {
      icon: MapPin,
      title: "Campus Convenient",
      description: "Many lessons available on campus or nearby, perfect for busy student schedules.",
      color: "text-rose-600"
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Built by and for Northwestern's music community to foster musical growth and connection.",
      color: "text-violet-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose NoteBridge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed specifically for Northwestern's music community, NoteBridge offers everything you need to connect, learn, and grow musically.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`${feature.color} group-hover:scale-110 transition-transform duration-300`} size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, MessageCircle, Music } from "lucide-react";

const HowItWorks = () => {
  const studentSteps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your account to join our community.",
      step: "01"
    },
    {
      icon: Search,
      title: "Browse Lessons",
      description: "Search for instructors by instrument, price, location, and availability.",
      step: "02"
    },
    {
      icon: MessageCircle,
      title: "Connect",
      description: "Message instructors directly to discuss your goals and schedule lessons.",
      step: "03"
    },
    {
      icon: Music,
      title: "Start Learning",
      description: "Begin your musical journey with fellow Northwestern students.",
      step: "04"
    }
  ];

  const instructorSteps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      description: "Set up your instructor profile showcasing your musical experience.",
      step: "01"
    },
    {
      icon: Music,
      title: "Post Lessons",
      description: "Create lesson listings with your availability and teaching specialties.",
      step: "02"
    },
    {
      icon: MessageCircle,
      title: "Connect with Students",
      description: "Respond to inquiries and build relationships with eager learners.",
      step: "03"
    },
    {
      icon: Search,
      title: "Grow Your Studio",
      description: "Build your reputation through reviews and expand your teaching network.",
      step: "04"
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#FFF5EC' }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How NoteBridge Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're looking to learn or teach, getting started is simple and straightforward.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Students */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">For Students</h3>
              <p className="text-gray-600">Ready to learn from talented Northwestern musicians?</p>
            </div>
            
            <div className="space-y-6">
              {studentSteps.map((step, index) => (
                <Card key={index} className="border-l-4 border-l-purple-600 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                          <step.icon className="text-purple-600" size={24} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                            STEP {step.step}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* For Instructors */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-orange-900 mb-2">For Instructors</h3>
              <p className="text-gray-600">Share your musical talents and earn while teaching.</p>
            </div>
            
            <div className="space-y-6">
              {instructorSteps.map((step, index) => (
                <Card key={index} className="border-l-4 border-l-orange-600 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                          <step.icon className="text-orange-600" size={24} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            STEP {step.step}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Music, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center space-x-2 text-purple-600 mb-4">
              <GraduationCap size={24} />
              <span className="font-medium">Northwestern Music Community</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Musical Journey?
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join hundreds of Northwestern students who are already connecting, learning, and sharing their musical passions through NoteBridge. Whether you're picking up your first instrument or mastering advanced techniques, your musical community awaits.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Verified Northwestern student community</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">All skill levels and instruments welcome</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Flexible scheduling around your classes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700">Safe, secure platform designed for students</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - CTA Cards */}
          <div className="space-y-6">
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors duration-300 shadow-lg hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Music className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">I Want to Learn</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Discover talented Northwestern musicians ready to share their expertise. Find the perfect instructor for your musical goals.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold group">
                  Find Music Lessons
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors duration-300 shadow-lg hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="text-orange-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">I Want to Teach</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Share your musical talents with fellow Wildcats. Build your teaching experience while earning extra income.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold group">
                  Start Teaching
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Exclusively for Northwestern University students • Verify with your @u.northwestern.edu email
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;

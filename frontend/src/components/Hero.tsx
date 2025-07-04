import { Button } from "@/components/ui/button";
import { Music, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import NorthwesternLogo from "./NorthwesternLogo";

const Hero = () => {
  return (
    <section className="relative overflow-hidden text-white" style={{ backgroundColor: '#ff7b00' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2 text-purple-200">
              <NorthwesternLogo size={20} />
              <span className="font-medium">Northwestern University Music Community</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Connect, Learn, and Share Music at
              <span style={{ color: '#4E2A84' }}> Northwestern</span>
            </h1>
            
            <p className="text-xl text-purple-100 leading-relaxed">
              NoteBridge brings together Northwestern's talented musicians. Whether you're looking to teach your skills or learn from fellow Wildcats, find your perfect musical match in our verified student community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Find Music Lessons
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-2 border-white text-black hover:bg-gray-200 hover:border-gray-200 px-8 py-3 text-lg font-semibold transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Music className="text-purple-400" size={20} />
                <span className="text-purple-200">All Instruments</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="text-purple-400" size={20} />
                <span className="text-purple-200">Verified Students</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Visual */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <img 
                src="/hero.png" 
                alt="Students playing music together"
                className="w-full h-80 object-cover rounded-xl shadow-2xl"
              />
              {/* <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-purple-100">Students Connected</div>
                </div>
              </div> */}
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-12 -left-8 bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <Music className="text-white" size={32} />
            </div>
            <div className="absolute -bottom-16 right-4 bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <GraduationCap className="text-white" size={36} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

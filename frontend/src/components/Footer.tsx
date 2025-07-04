
import { Music, Mail, Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="text-purple-400" size={32} />
              <span className="text-2xl font-bold">NoteBridge</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting Northwestern University's music community through shared learning and teaching experiences.
            </p>
            <div className="flex items-center space-x-2 text-purple-400">
              <Shield size={20} />
              <span className="text-sm">Northwestern Students Only</span>
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Browse Lessons</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Become an Instructor</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Pricing</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Community Standards</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} />
                <span>support@notebridge.edu</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Northwestern University<br />
                Music Department<br />
                Evanston, IL 60208
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>© 2024 NoteBridge</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="text-red-400" size={16} />
              <span>for Northwestern musicians</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

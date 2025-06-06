import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Building2, DollarSign, Shield, Users, Zap, Star, CheckCircle, ArrowRight } from 'lucide-react';
import PaymanLoginButton from './PaymanLoginButton';

interface LandingPageProps {
  onGetStarted: (role: 'student' | 'government') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: GraduationCap,
      title: 'Easy Application Process',
      description: 'Students can apply for scholarships with a simple, intuitive interface'
    },
    {
      icon: DollarSign,
      title: 'Instant Payments',
      description: 'Government can process payments instantly using Payman SDK integration'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with enterprise-grade security and reliability standards'
    },
    {
      icon: Users,
      title: 'Payee Management',
      description: 'Comprehensive payee management system for streamlined operations'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Students Supported' },
    { number: '$500K+', label: 'Scholarships Distributed' },
    { number: '50+', label: 'Educational Institutions' },
    { number: '99.9%', label: 'Uptime Reliability' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'ScholarPay made applying for scholarships so much easier. The process is straightforward and payments are instant!',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Education Department',
      content: 'Managing scholarship payments has never been this efficient. The Payman integration is seamless.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ScholarPay
            </span>
          </div>
          <div className="flex gap-3">
            <PaymanLoginButton 
              variant="outline" 
              className="hover:scale-105 transition-transform   bg-[#0a3b44] text-white hover:border-[#0a3b44] "
            />
            <Button variant="outline" onClick={() => onGetStarted('student')} className="hover:scale-105 transition-transform">
              Student Login
            </Button>
            <Button onClick={() => onGetStarted('government')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform">
              Government Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="px-6 py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-3xl"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-8">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Trusted by 1000+ Students</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Transform Scholarship
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent block">
              Payments Forever
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            The most advanced scholarship payment platform connecting students with government funding. 
            <span className="font-semibold text-blue-600"> Instant, secure, and seamless</span> - powered by cutting-edge Payman SDK technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <PaymanLoginButton 
              size="lg"
              className="text-lg px-10 py-6 h-auto bg-gradient-to-r  from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            />
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => onGetStarted('student')}
            >
              <GraduationCap className="mr-3 h-6 w-6" />
              Traditional Student Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-6 h-auto border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => onGetStarted('government')}
            >
              <Building2 className="mr-3 h-6 w-6" />
              Government Access
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Floating Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-900">For Students</h3>
                <p className="text-blue-700 mb-6">Apply for scholarships and receive instant payments through our secure platform</p>
                <div className="space-y-3">
                  <PaymanLoginButton 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => onGetStarted('student')}
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Traditional Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-green-900">For Government</h3>
                <p className="text-green-700 mb-6">Manage payees and process scholarship payments efficiently</p>
                <Button 
                  onClick={() => onGetStarted('government')}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  Access Government Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose ScholarPay?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of scholarship management with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get started with our scholarship platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Student Flow */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">For Students</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Login with Payman or Create Account</h4>
                    <p className="text-gray-600">Connect your Payman wallet or register with student credentials</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Apply for Scholarships</h4>
                    <p className="text-gray-600">Submit applications for available funding</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Receive Payments</h4>
                    <p className="text-gray-600">Get approved payments directly via Payman</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Government Flow */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-600 mb-6">For Government</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Review Applications</h4>
                    <p className="text-gray-600">Assess student scholarship requests</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Manage Payees</h4>
                    <p className="text-gray-600">Add approved students to payee system</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Process Payments</h4>
                    <p className="text-gray-600">Send secure payments via Payman SDK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Education Funding?
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            Join thousands of students and institutions already using ScholarPay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PaymanLoginButton 
              size="lg"
              variant="secondary"
              className="text-lg px-10 py-6 h-auto bg-white text-blue-600 hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300"
            />
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-6 h-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => onGetStarted('government')}
            >
              <Building2 className="mr-3 h-6 w-6" />
              Government Access
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">ScholarPay</span>
          </div>
          <p className="text-gray-400 mb-4">
            Revolutionizing scholarship payments with Payman SDK technology  • Secure • Reliable • Fast
          </p>
          <p className="text-sm text-gray-500">
            © 2025 ScholarPay. All rights reserved.made with ❤️&☕by
            <a  className="text-white font-bold" target='_blank' href='https://www.kartikmehta18.xyz/'>@kartikmehta18</a> 
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight, HiShieldCheck, HiLightningBolt, HiGlobe, HiTrendingUp, HiUsers, HiSparkles, HiStar, HiCheck } from 'react-icons/hi';

const features = [
  { icon: HiShieldCheck, title: 'Direct Connection', desc: 'Eliminate middlemen. Farmers sell directly to consumers for better prices.', color: 'from-green-500 to-emerald-600' },
  { icon: HiLightningBolt, title: 'AI-Powered Insights', desc: 'Demand forecasting and smart pricing powered by machine learning.', color: 'from-orange-500 to-amber-600' },
  { icon: HiGlobe, title: 'Smart Logistics', desc: 'Route optimization for fastest, cheapest deliveries.', color: 'from-blue-500 to-indigo-600' },
  { icon: HiTrendingUp, title: 'Real-time Analytics', desc: 'Track sales, trends, and market prices in real-time.', color: 'from-purple-500 to-pink-600' },
  { icon: HiUsers, title: 'FPO Support', desc: 'Collective selling power for Farmer Producer Organizations.', color: 'from-teal-500 to-cyan-600' },
  { icon: HiSparkles, title: 'Organic Certified', desc: 'Verified organic products with traceability.', color: 'from-lime-500 to-green-600' }
];

const stats = [
  { value: '50K+', label: 'Farmers Connected' },
  { value: '2L+', label: 'Consumers Served' },
  { value: '100+', label: 'Districts Covered' },
  { value: '30%', label: 'Better Prices' }
];

const testimonials = [
  { name: 'Ramesh Kumar', role: 'Farmer, UP', content: 'KisanSetu helped me sell directly to consumers. My income increased by 40%!', rating: 5 },
  { name: 'Priya Sharma', role: 'Consumer, Delhi', content: 'Fresh vegetables at fair prices. I know exactly where my food comes from.', rating: 5 },
  { name: 'Suresh Patel', role: 'FPO Member, Gujarat', content: 'Our collective selling power increased 3x with KisanSetu.', rating: 5 }
];

const FloatingParticle = ({ delay, duration, x, y }) => (
  <motion.div
    className="absolute w-2 h-2 bg-white/20 rounded-full"
    initial={{ x, y, opacity: 0 }}
    animate={{ 
      y: [y, y - 100, y],
      opacity: [0, 1, 0],
      scale: [0, 1, 0]
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Landing = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Particles */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <FloatingParticle 
              key={i} 
              delay={i * 0.5} 
              duration={3 + Math.random() * 4}
              x={Math.random() * 1000}
              y={Math.random() * 600}
            />
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2LTJoLTZ2NmgydjJ6bTAtOHYtMmgtMnYyaDJ6bTYgOGgtMnY0aDJ2LTR6bTAtOHYtMmgtMnYyaDJ6bTYgOGgtMnY0aDJ2LTR6bTAtOHYtMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <motion.div style={{ y: y1, opacity, scale }} className="relative z-10 max-w-7xl mx-auto px-4 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">SIH 2026 | Ministry of Consumer Affairs</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-heading leading-tight">
              Bridging Farmers
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">
                Directly
              </span>
              <br />
              to Your Table
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 text-balance leading-relaxed"
            >
              KisanSetu eliminates middlemen, ensures fair prices for farmers, and delivers fresh produce directly from farm to consumer using AI-powered logistics.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register" className="group bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3">
                <span>Start Trading</span>
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/marketplace" className="group border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Explore Marketplace
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/70 text-sm md:text-base">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-saffron-500">KisanSetu</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">A complete digital ecosystem connecting farmers directly with consumers, powered by AI and smart logistics.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 shadow-card hover:shadow-premium transition-all duration-500 border border-gray-100 hover:border-primary-200 overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-saffron-50/0 group-hover:from-primary-50/50 group-hover:to-saffron-50/50 transition-all duration-500"></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-dark-gradient text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-saffron-500 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-saffron-400 font-semibold text-sm tracking-wider uppercase mb-4">Simple Process</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 font-heading">How It <span className="text-saffron-400">Works</span></h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Register as Farmer/Buyer', desc: 'Quick registration with role-based access', icon: HiUsers },
                  { step: '02', title: 'List or Browse Products', desc: 'Farmers list fresh produce, buyers browse and order', icon: HiSparkles },
                  { step: '03', title: 'AI Optimizes Delivery', desc: 'Smart route optimization for fastest delivery', icon: HiLightningBolt },
                  { step: '04', title: 'Secure Payment', desc: 'Safe transactions with COD and online options', icon: HiShieldCheck }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start space-x-5 group"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-saffron-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="font-bold text-lg">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl mb-2 group-hover:text-saffron-400 transition-colors">{item.title}</h4>
                      <p className="text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { emoji: '👨‍🌾', title: 'Farmer', desc: 'Lists produce', color: 'from-green-500/20 to-emerald-500/20' },
                    { emoji: '🛒', title: 'Consumer', desc: 'Places order', color: 'from-blue-500/20 to-indigo-500/20' },
                    { emoji: '🤖', title: 'AI Engine', desc: 'Optimizes route', color: 'from-purple-500/20 to-pink-500/20' },
                    { emoji: '🚚', title: 'Delivery', desc: 'Fast & fresh', color: 'from-orange-500/20 to-amber-500/20' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-white/30 transition-all duration-300`}
                    >
                      <div className="text-5xl mb-3">{item.emoji}</div>
                      <div className="font-semibold text-lg mb-1">{item.title}</div>
                      <div className="text-sm text-white/60">{item.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-primary-600 font-semibold text-sm tracking-wider uppercase mb-4">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-saffron-500">Users</span> Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Join thousands of satisfied farmers and consumers</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl p-8 shadow-card hover:shadow-premium transition-all duration-500 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-saffron-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <HiStar key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary-600 via-primary-500 to-saffron-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading text-white">Ready to <span className="text-yellow-300">Transform</span> Agriculture?</h2>
            <p className="text-white/90 mb-10 text-xl max-w-2xl mx-auto">Join thousands of farmers and consumers already using KisanSetu for fair trade and fresh produce.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="group bg-white text-primary-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-yellow-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3">
                <span>Join KisanSetu Today</span>
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/marketplace" className="text-white border-2 border-white/40 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Explore Products
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/80">
              <div className="flex items-center space-x-2">
                <HiCheck className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">No Middlemen</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiCheck className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">Fair Prices</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiCheck className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">Fresh Produce</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiCheck className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">AI Powered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <span className="text-2xl font-bold font-heading">KisanSetu</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">Bridging farmers directly to consumers. Fair prices, fresh produce, smart logistics.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <span className="text-lg">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <span className="text-lg">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <span className="text-lg">yt</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Marketplace', 'About Us', 'How It Works', 'Pricing', 'Blog'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Farmers */}
            <div>
              <h4 className="font-semibold text-lg mb-6">For Farmers</h4>
              <ul className="space-y-3">
                {['Start Selling', 'FPO Registration', 'Training Resources', 'Success Stories', 'Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Stay Updated</h4>
              <p className="text-gray-400 mb-4">Get the latest news and updates.</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
                <button className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors ml-2">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2026 KisanSetu. All rights reserved. SIH 2026</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

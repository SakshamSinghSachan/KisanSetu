import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiShieldCheck, HiLightningBolt, HiGlobe, HiTrendingUp, HiUsers, HiSparkles } from 'react-icons/hi';

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

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative pt-32 pb-20 px-4 bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDJ2MnptMC04di0yaC0ydjJoMnptNiA4aC0ydjRoMnYtNHptMC04di0yaC0ydjJoMnptNiA4aC0ydjRoMnYtNHptMC04di0yaC0ydjJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <HiSparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">SIH 2026 Winner Solution</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading leading-tight">
              Bridging Farmers<br />
              <span className="text-yellow-300">Directly</span> to Your Table
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 text-balance">
              KisanSetu eliminates middlemen, ensures fair prices for farmers, and delivers fresh produce directly from farm to consumer using AI-powered logistics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2">
                <span>Start Trading</span>
                <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/marketplace" className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                Explore Marketplace
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-heading">Why <span className="gradient-text">KisanSetu</span>?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A complete digital ecosystem connecting farmers directly with consumers, powered by AI and smart logistics.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium p-8 group hover:scale-105 transition-transform duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-dark-gradient text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-bold mb-6 font-heading">How It <span className="text-saffron-400">Works</span></h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Register as Farmer/Buyer', desc: 'Quick registration with role-based access' },
                  { step: '02', title: 'List or Browse Products', desc: 'Farmers list fresh produce, buyers browse and order' },
                  { step: '03', title: 'AI Optimizes Delivery', desc: 'Smart route optimization for fastest delivery' },
                  { step: '04', title: 'Secure Payment', desc: 'Safe transactions with COD and online options' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-saffron-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                      <p className="text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">👨‍🌾</div>
                    <div className="font-semibold">Farmer</div>
                    <div className="text-sm text-white/60">Lists produce</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">🛒</div>
                    <div className="font-semibold">Consumer</div>
                    <div className="text-sm text-white/60">Places order</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">🤖</div>
                    <div className="font-semibold">AI Engine</div>
                    <div className="text-sm text-white/60">Optimizes route</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-2">🚚</div>
                    <div className="font-semibold">Delivery</div>
                    <div className="text-sm text-white/60">Fast & fresh</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-6 font-heading">Ready to <span className="gradient-text">Transform</span> Agriculture?</h2>
            <p className="text-gray-600 mb-10 text-lg">Join thousands of farmers and consumers already using KisanSetu for fair trade and fresh produce.</p>
            <Link to="/register" className="btn-primary text-lg !px-10 !py-4 inline-flex items-center space-x-2">
              <span>Join KisanSetu Today</span>
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold">KisanSetu</span>
            </div>
            <p className="text-gray-400 text-sm">SIH 2026 | Smart India Hackathon | Ministry of Consumer Affairs</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, DollarSign, Star, Check, Monitor, Smartphone, Share2, BadgePercent } from 'lucide-react';

const PLAN_LEVELS = [
  { id: 'bronze', label: 'Bronze', icon: <Star className="w-5 h-5" /> },
  { id: 'silver', label: 'Silver', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'gold', label: 'Gold', icon: <Users className="w-5 h-5" /> },
];

const CATEGORIES = [
  { id: 'web', label: 'وب‌سایت', icon: <Monitor className="w-4 h-4" /> },
  { id: 'app', label: 'اپلیکیشن', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'branding', label: 'برندینگ', icon: <BadgePercent className="w-4 h-4" /> },
  { id: 'social', label: 'سوشال مدیا', icon: <Share2 className="w-4 h-4" /> },
];
  
const PLANS = [
  // Bronze
  { level: 'bronze', category: 'web', title: 'Bronze Web', price: '$499', description: 'Basic website for small businesses', features: ["Basic Design", "5 Pages", "Responsive", "Contact Form", "Basic SEO"] },
  { level: 'bronze', category: 'app', title: 'Bronze App', price: '$799', description: 'Simple app for startups', features: ["Basic UI", "iOS/Android", "Push Notifications", "Basic Analytics"] },
  { level: 'bronze', category: 'branding', title: 'Bronze Branding', price: '$299', description: 'Starter branding kit', features: ["Logo Design", "Color Palette"] },
  { level: 'bronze', category: 'social', title: 'Bronze Social', price: '$199', description: 'Starter social media kit', features: ["2 Social Templates", "Profile Kit"] },
  // Silver
  { level: 'silver', category: 'web', title: 'Silver Web', price: '$999', description: 'Advanced website for growing businesses', features: ["Premium Design", "10 Pages", "Responsive", "Advanced Forms", "SEO", "Social Media"] },
  { level: 'silver', category: 'app', title: 'Silver App', price: '$1499', description: 'Feature-rich app for businesses', features: ["Premium UI", "iOS/Android", "Push Notifications", "Advanced Analytics", "API Integration"] },
  { level: 'silver', category: 'branding', title: 'Silver Branding', price: '$599', description: 'Professional branding package', features: ["Logo & Visuals", "Brand Guide", "Typography"] },
  { level: 'silver', category: 'social', title: 'Silver Social', price: '$399', description: 'Professional social media package', features: ["5 Social Templates", "Profile Kit", "Content Calendar"] },
  // Gold
  { level: 'gold', category: 'web', title: 'Gold Web', price: '$1999', description: 'Full-featured website for enterprises', features: ["Luxury Design", "Unlimited Pages", "Responsive", "Integrations", "Premium SEO", "Full Social Media", "E-commerce"] },
  { level: 'gold', category: 'app', title: 'Gold App', price: '$2999', description: 'Enterprise-level app with all features', features: ["Luxury UI", "All Platforms", "Custom Features", "Full Analytics", "Integrations"] },
  { level: 'gold', category: 'branding', title: 'Gold Branding', price: '$1299', description: 'Full branding suite', features: ["Full Brand Kit", "Brand Guide", "Strategy", "Stationery"] },
  { level: 'gold', category: 'social', title: 'Gold Social', price: '$799', description: 'Full social media suite', features: ["10 Social Templates", "Profile Kit", "Content Calendar", "Strategy"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.1, duration: 0.3 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const PlanSelector: React.FC = () => {
  // Each plan card manages its own tab
  const [activeTabs, setActiveTabs] = useState<{ [key: string]: string }>({ bronze: 'web', silver: 'web', gold: 'web' });

  const handleTabChange = (level: string, category: string) => {
    setActiveTabs((prev) => ({ ...prev, [level]: category }));
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-20 px-6 sm:px-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-white text-3xl lg:text-4xl font-light tracking-tight mb-3">
            <span className="font-medium">انتخاب</span> پلن
            </h1>
          <p className="text-gray-400 text-base max-w-md leading-relaxed mx-auto">
            پلن مناسب کسب‌وکار خود را انتخاب کنید
            </p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLAN_LEVELS.map((level, idx) => {
            const activeCategory = activeTabs[level.id];
            const plan = PLANS.find((p) => p.level === level.id && p.category === activeCategory);
            return (
              <motion.div key={level.id} variants={itemVariants} className="h-full">
                <div className="h-full bg-black rounded-2xl overflow-hidden relative border border-white/15 hover:border-white/25 transition-all duration-500 flex flex-col">
                  {/* Tabs */}
                  <div className="flex justify-center gap-2 pt-6 pb-4">
                    {CATEGORIES.map((cat) => (
              <button
                        key={cat.id}
                        onClick={() => handleTabChange(level.id, cat.id)}
                        className={`flex items-center justify-center w-9 h-9 rounded-full border border-white/10 transition-all duration-200
                          ${activeCategory === cat.id ? 'bg-white text-black shadow' : 'bg-black text-white/80 hover:bg-white/10'}`}
                        aria-label={cat.label}
              >
                        {React.cloneElement(cat.icon, {
                          className: `w-4 h-4 transition-colors ${activeCategory === cat.id ? 'text-black' : 'text-white/80'}`
                        })}
              </button>
            ))}
          </div>
                  {/* Card content */}
                  <div className="relative p-8 md:p-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-white text-xl font-light mb-2">{plan?.title}</h2>
                        <p className="text-gray-400 text-sm">{plan?.description}</p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#111] border border-white/15">
                        <div className="text-white/90">
                          {level.icon}
                        </div>
                      </div>
                    </div>
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-white text-2xl font-light">{plan?.price}</span>
                        <span className="text-gray-500 text-sm ml-2">/project</span>
                      </div>
                    </div>
                    <div className="h-px w-full bg-white/10 mb-8"/>
                    <div className="space-y-5 flex-grow mb-8">
                      {plan?.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/90">
                            <Check className="w-3 h-3" />
                </div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                    ))}
                  </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-white/10 py-4 rounded-xl text-white text-sm font-light tracking-wide transition-colors group border border-white/15 mt-auto"
                    >
                      انتخاب پلن
                      <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center group-hover:bg-white/15 transition-colors ml-1">
                        <ChevronRight className="w-4 h-4 text-white/90" />
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
        </div>
  );
};

export default PlanSelector;
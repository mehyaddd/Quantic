import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Mail, Phone, MapPin, ArrowUpRight, Loader, Dribbble, Linkedin, Send, Instagram, Search } from 'lucide-react';
import { FaBehance } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../PhoneInput.css';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '98'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePhoneChange = (value: string) => {
    setFormState({
      ...formState,
      phone: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '98'
      });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };
  
  useEffect(() => {
    const tl = gsap.timeline();
    
    if (formRef.current) {
      tl.from(formRef.current.querySelectorAll('.form-element'), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0.2);
    }
    
    if (infoRef.current) {
      tl.from(infoRef.current.querySelectorAll('.info-element'), {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0.2);
    }
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black"
    >
      {/* Hero Section */}
      <section className="relative pt-10 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Let's Create Something Amazing Together
          </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Have a project in mind or just want to say hello? I'd love to hear from you and discuss how we can bring your ideas to life.
          </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 relative z-[9000]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
            {/* Contact Info Card */}
            <motion.div
              ref={infoRef}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 h-[600px] flex flex-col">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
                  Get in Touch
              </h2>
              
                <div className="space-y-8 flex-1">
                  {/* Email */}
                  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                      <a href="mailto:contact@example.com" className="text-gray-300 hover:text-white transition-colors">
                        contact@example.com
                      </a>
                  </div>
                </div>
                
                  {/* Phone */}
                  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Phone size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                      <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">
                        +1 (234) 567-890
                      </a>
                  </div>
                </div>
                
                  {/* Location */}
                  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                      <p className="text-gray-300">
                        Tehran, Iran
                      </p>
                  </div>
                </div>
              </div>
              
                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Follow Me</h3>
                <div className="flex space-x-4">
                    {[
                      { icon: FaBehance, href: 'https://behance.net', label: 'Behance' },
                      { icon: Dribbble, href: 'https://dribbble.com', label: 'Dribbble' },
                      { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                      { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' }
                    ].map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 group"
                        aria-label={`Follow on ${social.label}`}
                    >
                        <social.icon size={20} className="text-white group-hover:text-gray-300 transition-colors" />
                      </motion.a>
                  ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form Card */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <form 
                ref={formRef} 
                onSubmit={handleSubmit}
                className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 h-[600px] flex flex-col"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
                  Send Message
                </h2>
                
                <div className="flex-1 flex flex-col space-y-6">
                  {/* Message Input */}
                  <div className="relative flex-1">
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full h-full bg-white/5 text-white placeholder-gray-400 rounded-2xl border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-300 p-5 pr-16 text-base resize-none"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !formState.message.trim()}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-white/25 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader size={22} className="animate-spin" color="#000" />
                      ) : (
                        <Send size={22} color="#000" />
                      )}
                    </button>
                  </div>
                  
                  {/* Contact Info Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Field */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 text-white placeholder-gray-400 rounded-xl border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-300 pl-12 pr-4 py-3 text-base"
                        placeholder="Your Email"
                      />
                    </div>
                    
                    {/* Phone Field */}
                    <div className="phone-input-container" style={{ position: 'relative', zIndex: 99999 }}>
                      <div className="relative">
                        <div className={`absolute left-[110px] top-1/2 transform -translate-y-1/2 text-white transition-opacity duration-200 ${isPhoneFocused ? 'opacity-0' : 'opacity-50'}`}>
                          <Phone size={18} className="opacity-50" />
                        </div>
                        <PhoneInput
                          country={'ir'}
                          value={formState.phone}
                          onChange={handlePhoneChange}
                          onFocus={() => setIsPhoneFocused(true)}
                          onBlur={() => setIsPhoneFocused(false)}
                          containerClass="phone-input"
                          inputClass="w-full bg-white/5 text-white placeholder-gray-400 rounded-xl border border-white/10 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-300 py-3 pl-36 pr-4 text-base"
                          buttonClass="bg-white/5 border border-white/10 rounded-l-xl"
                          dropdownClass="bg-black border border-white/10 text-white"
                          searchClass="search-input"
                          enableSearch={true}
                          disableSearchIcon={true}
                          searchPlaceholder="جستجو..."
                          countryCodeEditable={false}
                          preferredCountries={['ir', 'us', 'gb', 'de', 'fr']}
                          placeholder="شماره تلفن شما"
                          dropdownStyle={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            position: 'absolute',
                            zIndex: 99999
                          }}
                          enableAreaCodes={true}
                          searchNotFound="کشوری یافت نشد"
                          searchStyle={{
                            width: '100%',
                            padding: '8px 8px 8px 36px',
                            margin: '0',
                            backgroundColor: 'rgba(0, 0, 0, 0.95)',
                            border: 'none',
                            color: 'white'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="min-h-[32px] flex items-end">
                    {submitStatus === 'success' && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-sm"
                      >
                        Your message has been sent successfully!
                      </motion.p>
                    )}
                    {submitStatus === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-400 text-sm"
                      >
                        There was an error sending your message. Please try again.
                      </motion.p>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default Contact;
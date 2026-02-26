/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  User, 
  ChevronRight, 
  Gamepad2, 
  Trophy, 
  ArrowLeft,
  RefreshCw,
  Play,
  Pause,
  Shield,
  Globe,
  Plus,
  X,
  Star,
  Settings,
  RotateCcw,
  ExternalLink,
  BookOpen,
  Maximize2,
  Youtube
} from 'lucide-react';

// --- Triple Sandbox Utility ---

const getTripleSandboxUrl = (url: string, config: string) => {
  // Layer 3: Inner-most iframe
  const layer3Content = `
    <html><body style="margin:0;overflow:hidden;background:#fff;">
      <iframe src="${url}" style="width:100%;height:100%;border:none;" sandbox="${config}" allowfullscreen></iframe>
    </body></html>
  `;
  const layer3Blob = new Blob([layer3Content], { type: 'text/html' });
  const layer3Url = URL.createObjectURL(layer3Blob);

  // Layer 2: Middle iframe
  const layer2Content = `
    <html><body style="margin:0;overflow:hidden;background:#fff;">
      <iframe src="${layer3Url}" style="width:100%;height:100%;border:none;" sandbox="${config}" allowfullscreen></iframe>
    </body></html>
  `;
  const layer2Blob = new Blob([layer2Content], { type: 'text/html' });
  const layer2Url = URL.createObjectURL(layer2Blob);

  // Layer 1: Outer-most iframe (returned to the component)
  const layer1Content = `
    <html><body style="margin:0;overflow:hidden;background:#fff;">
      <iframe src="${layer2Url}" style="width:100%;height:100%;border:none;" sandbox="${config}" allowfullscreen></iframe>
    </body></html>
  `;
  const layer1Blob = new Blob([layer1Content], { type: 'text/html' });
  return URL.createObjectURL(layer1Blob);
};

// --- Games ---

const QuackPrepViewer = () => {
  const sandbox = "allow-scripts allow-forms allow-same-origin"; // Level 2 as requested
  const url = "https://quackprep.org";
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full h-[80vh] bg-white rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative group">
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Maximize2 size={18} />
      </button>
      <iframe 
        src={getTripleSandboxUrl(url, sandbox)}
        className="w-full h-full border-none"
        sandbox={sandbox}
        allowFullScreen
      />
    </div>
  );
};

const YouBlockPlus = () => {
  const [videoId, setVideoId] = useState('');
  const [currentId, setCurrentId] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const loadVideo = () => {
    let id = videoId.trim();
    if (id.includes('v=')) {
      id = id.split('v=')[1].split('&')[0];
    } else if (id.includes('youtu.be/')) {
      id = id.split('youtu.be/')[1].split('?')[0];
    }
    setCurrentId(id);
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative group">
      <div className="flex items-center gap-4">
        <div className="flex-grow relative">
          <input 
            type="text" 
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadVideo()}
            placeholder="Enter YouTube Video ID or URL..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
          />
        </div>
        <button 
          onClick={loadVideo}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20"
        >
          Load
        </button>
        <button 
          onClick={toggleFullscreen}
          className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
        >
          <Maximize2 size={20} />
        </button>
      </div>

      <div className="aspect-video w-full bg-black/60 rounded-2xl overflow-hidden border border-white/5 shadow-inner flex items-center justify-center">
        {currentId ? (
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtubeeducation.com/embed/${currentId}`}
            title="YouBlock+ Player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          ></iframe>
        ) : (
          <div className="text-zinc-500 flex flex-col items-center gap-3">
            <Youtube size={48} className="opacity-20" />
            <p className="text-sm font-medium uppercase tracking-widest opacity-40">Enter a video ID to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SignInPage = ({ onSignIn, onForgotPassword, onBack }: { onSignIn: () => void, onForgotPassword: () => void, onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Fake delay
    setTimeout(() => {
      if (!email.includes('@')) {
        setError('Please enter a valid email address with a @');
        setIsLoading(false);
      } else {
        setError('Error: Server under heavy load. Please try again later.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-xl border border-zinc-200">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-8 bg-yellow-400 border-2 border-black"></div>
            <span className="font-black text-xl tracking-tighter uppercase">National Geographic</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-tight">Sign In</h2>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
              <button 
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-bold text-yellow-600 hover:text-yellow-700 uppercase tracking-widest"
              >
                Forgot?
              </button>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Signing In...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <button 
          onClick={onBack}
          className="w-full mt-6 text-xs font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest transition-colors"
        >
          Back to Site
        </button>

        <div className="mt-12 pt-6 border-t border-zinc-100 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <button onClick={onSignIn} className="hover:text-zinc-900 transition-colors">Privacy Policy</button>
          <span>•</span>
          <button className="hover:text-zinc-900 transition-colors">Terms of Service</button>
        </div>
      </div>
    </motion.div>
  );
};

const ForgotPasswordPage = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-xl border border-zinc-200">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-8 bg-yellow-400 border-2 border-black"></div>
            <span className="font-black text-xl tracking-tighter uppercase">National Geographic</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-4 uppercase tracking-tight">Reset Password</h2>
        <p className="text-zinc-500 text-center text-sm mb-8">Enter your email address and we'll send you a link to reset your password.</p>
        
        {!submitted ? (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Check your email</h3>
            <p className="text-zinc-500 text-sm">If an account exists for {email}, you will receive a password reset link shortly.</p>
          </div>
        )}

        <button 
          onClick={onBack}
          className="w-full mt-6 text-xs font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    </motion.div>
  );
};

const Chrome65Remake = () => {
  const [tabs, setTabs] = useState<{ id: string; url: string; name: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const addTab = (url = 'chrome://new-tab') => {
    const id = 't-' + Date.now();
    const name = url === 'chrome://new-tab' ? 'New Tab' : url === 'chrome://settings' ? 'Settings' : url === 'chrome://extensions' ? 'Extensions' : 'Site';
    const newTabs = [...tabs, { id, url, name }];
    setTabs(newTabs);
    setActiveId(id);
    setUrlInput(url);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeId === id && newTabs.length > 0) {
      setActiveId(newTabs[0].id);
      setUrlInput(newTabs[0].url);
    } else if (newTabs.length === 0) {
      setActiveId(null);
      setUrlInput('');
    }
  };

  const navigate = () => {
    let val = urlInput.trim();
    if (!val) return;
    
    if (val === 'chrome://new-tab' || val === 'chrome://settings' || val === 'chrome://extensions') {
      // Internal pages
    } else if (!val.includes('.') && !val.startsWith('http')) {
      val = 'https://www.google.com/search?q=' + encodeURIComponent(val) + '&igu=1';
    } else if (!val.startsWith('http')) {
      val = 'https://' + val;
    }
    
    if (activeId) {
      setTabs(tabs.map(t => t.id === activeId ? { ...t, url: val, name: val.startsWith('chrome://') ? val.replace('chrome://', '').replace('-', ' ') : val.split('/')[2]?.replace('www.', '').substring(0, 14) || 'Site' } : t));
      setUrlInput(val);
    } else {
      addTab(val);
    }
  };

  useEffect(() => {
    if (tabs.length === 0) addTab();
  }, []);

  const activeTab = tabs.find(t => t.id === activeId);

  const renderInternalPage = (url: string) => {
    if (url === 'chrome://new-tab') {
      return (
        <div className="w-full h-full bg-white flex flex-col items-center pt-24 font-sans overflow-y-auto">
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google" className="w-[272px] mb-8" />
          <div className="w-full max-w-[584px] relative group px-4">
            <input 
              type="text" 
              className="w-full h-[44px] px-12 border border-zinc-200 rounded-full shadow-sm hover:shadow-md focus:shadow-md outline-none transition-shadow"
              placeholder="Search Google or type a URL"
            />
            <Search className="absolute left-8 top-3 text-zinc-400" size={20} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8 mt-12 w-full max-w-[584px] px-4">
            {[
              { name: 'YouTube', icon: 'https://www.youtube.com/favicon.ico' },
              { name: 'Gmail', icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon5.ico' },
              { name: 'Drive', icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png' },
              { name: 'Maps', icon: 'https://maps.gstatic.com/mapfiles/api-3/images/icon_maps_proxy.png' },
              { name: 'News', icon: 'https://ssl.gstatic.com/images/branding/product/1x/news_2020q4_32dp.png' },
              { name: 'Translate', icon: 'https://ssl.gstatic.com/images/branding/product/1x/translate_2020q4_32dp.png' },
              { name: 'Photos', icon: 'https://ssl.gstatic.com/images/branding/product/1x/photos_2020q4_32dp.png' },
              { name: 'Add shortcut', icon: null }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                  {s.icon ? <img src={s.icon} alt="" className="w-6 h-6" /> : <Plus size={20} className="text-zinc-500" />}
                </div>
                <span className="text-[12px] text-zinc-600 truncate max-w-full">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (url === 'chrome://settings') {
      return (
        <div className="w-full h-full bg-[#f1f3f4] flex flex-col font-sans overflow-hidden">
          <div className="bg-[#3367d6] h-14 flex items-center px-6 gap-6 shadow-md shrink-0">
            <Menu className="text-white cursor-pointer" size={20} />
            <span className="text-white text-lg font-medium">Settings</span>
            <div className="flex-grow max-w-[680px] relative">
              <input type="text" className="w-full bg-[#2850a7] border-none rounded h-8 px-10 text-white placeholder-white/70 outline-none" placeholder="Search settings" />
              <Search className="absolute left-3 top-2 text-white" size={16} />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4 sm:p-12">
            <div className="max-w-[680px] mx-auto bg-white rounded shadow-sm p-6">
              <h3 className="text-zinc-500 text-sm font-medium mb-6">About Chrome</h3>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 shrink-0">
                   <img src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="" className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-2xl font-normal text-zinc-900 mb-2">Google Chrome</h4>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mb-4">
                    <div className="w-4 h-4 rounded-full bg-[#3367d6] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    Google Chrome is up to date
                  </div>
                  <p className="text-sm text-zinc-500">Version 65.0.3325.146 (Official Build) (64-bit)</p>
                  <div className="mt-8 space-y-4 border-t pt-6">
                    <button className="w-full text-left text-sm text-zinc-700 hover:bg-zinc-50 py-2 flex justify-between items-center">
                      Get help with Chrome <ExternalLink size={14} className="text-zinc-400" />
                    </button>
                    <button className="w-full text-left text-sm text-zinc-700 hover:bg-zinc-50 py-2 flex justify-between items-center">
                      Report an issue <ChevronRight size={14} className="text-zinc-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-[680px] mx-auto bg-white rounded shadow-sm p-6 mt-4 text-[12px] text-zinc-500 leading-relaxed">
              <p>Google Chrome</p>
              <p>Copyright 2018 Google Inc. All rights reserved.</p>
              <p className="mt-4">Google Chrome is made possible by the <span className="text-[#3367d6] cursor-pointer">Chromium</span> open source project and other <span className="text-[#3367d6] cursor-pointer">open source software</span>.</p>
              <p className="mt-4 text-[#3367d6] cursor-pointer">Google Chrome Terms of Service</p>
            </div>
          </div>
        </div>
      );
    }
    if (url === 'chrome://extensions') {
      return (
        <div className="w-full h-full bg-[#f1f3f4] flex flex-col font-sans overflow-hidden">
          <div className="bg-[#3367d6] h-14 flex items-center px-6 gap-6 shadow-md shrink-0">
            <Menu className="text-white cursor-pointer" size={20} />
            <span className="text-white text-lg font-medium">Extensions</span>
            <div className="flex-grow max-w-[680px] relative">
              <input type="text" className="w-full bg-[#2850a7] border-none rounded h-8 px-10 text-white placeholder-white/70 outline-none" placeholder="Search extensions" />
              <Search className="absolute left-3 top-2 text-white" size={16} />
            </div>
            <div className="flex items-center gap-2 text-white text-sm">
              <span>Developer mode</span>
              <div className="w-8 h-3 bg-white/30 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute -top-0.5 right-0 shadow"></div>
              </div>
            </div>
          </div>
          <div className="bg-[#3367d6] h-10 flex items-center px-6 gap-8 text-white text-[11px] font-bold uppercase tracking-wider border-t border-white/10 shrink-0 overflow-x-auto">
            <button className="hover:bg-white/10 px-3 py-1 rounded transition-colors whitespace-nowrap">Load Unpacked</button>
            <button className="hover:bg-white/10 px-3 py-1 rounded transition-colors whitespace-nowrap">Pack Extension</button>
            <button className="hover:bg-white/10 px-3 py-1 rounded transition-colors whitespace-nowrap">Update</button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
            {[
              { name: 'Google Analytics Debugger', ver: '2.6', desc: 'Prints useful information to the JavaScript console by enabling the debug version of the Google Analytics JavaScript.' },
              { name: 'Google Arts & Culture', ver: '2.0.0', desc: 'Art masterpieces from Google Arts & Culture in your browser tabs.' },
              { name: 'Google Calendar (by Google)', ver: '2.8', desc: 'Easily check Google Calendar and add new events from websites you visit.' },
              { name: 'Google Docs Offline', ver: '1.4', desc: 'Get things done offline with the Google Docs family of products.' },
              { name: 'Google Hangouts', ver: '2017.1019.418.1', desc: 'Hangouts brings conversations to life with photos, emoji, and even group video calls for free.' },
              { name: 'Google Keep Chrome Extension', ver: '3.2.16302.1110', desc: 'Save to Google Keep with one click!' }
            ].map((ext, i) => (
              <div key={i} className="bg-white rounded shadow-sm p-4 flex flex-col h-[180px]">
                <div className="flex gap-4 mb-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded flex items-center justify-center border border-zinc-200 shrink-0">
                    <Globe size={20} className="text-zinc-400" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-medium text-zinc-900 truncate">{ext.name} <span className="text-zinc-500 font-normal ml-1">{ext.ver}</span></h5>
                    <p className="text-[12px] text-zinc-500 line-clamp-3 mt-1 leading-relaxed">{ext.desc}</p>
                  </div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-4 text-[#3367d6] text-[11px] font-bold uppercase tracking-wider">
                    <button className="hover:underline">Details</button>
                    <button className="hover:underline">Remove</button>
                  </div>
                  <div className="w-8 h-3 bg-[#3367d6]/30 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-[#3367d6] rounded-full absolute -top-0.5 right-0 shadow"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="w-full h-[70vh] flex flex-col bg-[#dee1e6] border border-zinc-400 rounded-lg overflow-hidden shadow-2xl relative font-sans">
      {/* Chrome 65 Tabs */}
      <div className="flex items-end px-2 pt-2 h-10 gap-0.5 overflow-x-auto scrollbar-hide shrink-0">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => { setActiveId(tab.id); setUrlInput(tab.url); }}
            className={`relative h-8 flex items-center px-6 min-w-[120px] sm:min-w-[160px] max-w-[200px] cursor-pointer group transition-colors ${
              activeId === tab.id ? 'z-20' : 'z-10'
            }`}
          >
            {/* Trapezoidal Background */}
            <div className={`absolute inset-0 transition-colors ${
              activeId === tab.id ? 'bg-white' : 'bg-[#bdc1c6] hover:bg-[#cacdd2]'
            }`} style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}></div>
            
            <div className="relative flex items-center gap-2 w-full min-w-0">
              <Globe size={14} className={activeId === tab.id ? 'text-zinc-600' : 'text-zinc-500'} />
              <span className={`text-[12px] truncate flex-grow ${activeId === tab.id ? 'text-zinc-900' : 'text-zinc-700'}`}>
                {tab.name}
              </span>
              <button 
                onClick={(e) => closeTab(e, tab.id)}
                className={`p-0.5 rounded-full hover:bg-zinc-200 transition-colors ${activeId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <X size={12} className="text-zinc-500" />
              </button>
            </div>
          </div>
        ))}
        <button 
          onClick={() => addTab()}
          className="mb-1 p-1.5 text-zinc-600 hover:bg-zinc-300 rounded-full transition-colors shrink-0"
        >
          <Plus size={16} />
        </button>
        <div className="flex-grow"></div>
        <div className="mb-2 px-4 text-[11px] text-zinc-600 font-medium whitespace-nowrap hidden sm:block">Person 1</div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-1.5 flex items-center gap-1 border-b border-zinc-300 shrink-0">
        <div className="flex items-center gap-0.5 px-1">
          <button className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"><ArrowLeft size={18} /></button>
          <button className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors rotate-180"><ArrowLeft size={18} /></button>
          <button onClick={() => navigate()} className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"><RotateCcw size={16} /></button>
        </div>
        
        <div className="flex-grow relative flex items-center">
          <div className="absolute left-3 flex items-center gap-2 pointer-events-none">
            <Globe size={14} className="text-zinc-400" />
            {urlInput.startsWith('chrome://') && (
              <span className="text-[13px] text-zinc-400">Chrome |</span>
            )}
          </div>
          <input 
            type="text" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigate()}
            className={`w-full bg-[#f1f3f4] border-none rounded-full py-1.5 text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#3367d6]/50 transition-all ${
              urlInput.startsWith('chrome://') ? 'pl-[84px]' : 'pl-10'
            } pr-10`}
          />
          <Star size={16} className="absolute right-4 text-zinc-400 hover:text-yellow-500 cursor-pointer transition-colors" />
        </div>

        <div className="flex items-center gap-1 px-1">
          <button className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
            <div className="flex flex-col gap-0.5">
              <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
              <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
              <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="flex-grow bg-white relative overflow-hidden">
        {activeTab && (
          activeTab.url.startsWith('chrome://') ? (
            renderInternalPage(activeTab.url)
          ) : (
            <iframe 
              key={`${activeTab.id}-${activeTab.url}`}
              src={getTripleSandboxUrl(activeTab.url, "allow-scripts allow-forms allow-same-origin")}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-forms allow-same-origin"
              allowFullScreen
            />
          )
        )}
      </div>
    </div>
  );
};

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let nextDx = 1;
    let nextDy = 0;
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    const draw = () => {
      dx = nextDx;
      dy = nextDy;
      
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fbbf24';
      snake.forEach(s => ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2));

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    };

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (dy === 0) { nextDx = 0; nextDy = -1; } break;
        case 'ArrowDown': if (dy === 0) { nextDx = 0; nextDy = 1; } break;
        case 'ArrowLeft': if (dx === 0) { nextDx = -1; nextDy = 0; } break;
        case 'ArrowRight': if (dx === 0) { nextDx = 1; nextDy = 0; } break;
      }
    };

    window.addEventListener('keydown', handleKey);
    const interval = setInterval(draw, 100);

    return () => {
      window.removeEventListener('keydown', handleKey);
      clearInterval(interval);
    };
  }, [gameOver]);

  const reset = () => {
    if (score > highScore) setHighScore(score);
    setScore(0);
    setGameOver(false);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl relative group">
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Maximize2 size={18} />
      </button>
      <div className="flex justify-between w-full px-2">
        <span className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Score: {score}</span>
        <span className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Best: {highScore}</span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="rounded-lg border border-zinc-700" />
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
            <h3 className="text-white text-2xl font-bold mb-4">GAME OVER</h3>
            <button 
              onClick={reset}
              className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} /> TRY AGAIN
            </button>
          </div>
        )}
      </div>
      <p className="text-zinc-500 text-xs italic">Use Arrow Keys to Move</p>
    </div>
  );
};

const ClickerGame = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [cost, setCost] = useState(10);

  const handleClick = () => {
    setCount(prev => prev + multiplier);
  };

  const buyUpgrade = () => {
    if (count >= cost) {
      setCount(prev => prev - cost);
      setMultiplier(prev => prev + 1);
      setCost(prev => Math.floor(prev * 1.5));
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md relative group">
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Maximize2 size={18} />
      </button>
      <div className="text-center">
        <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-1">Total Energy</h3>
        <div className="text-5xl font-bold text-yellow-500 tabular-nums">{count}</div>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.3)] flex items-center justify-center text-black font-black text-2xl border-4 border-yellow-300/50"
      >
        CLICK
      </motion.button>

      <div className="w-full space-y-3">
        <button 
          onClick={buyUpgrade}
          disabled={count < cost}
          className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${
            count >= cost 
            ? 'bg-zinc-800 border-yellow-500/50 hover:bg-zinc-700' 
            : 'bg-zinc-900 border-zinc-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="text-left">
            <div className="text-sm font-bold text-white">Upgrade Click</div>
            <div className="text-xs text-zinc-400">Current: +{multiplier}</div>
          </div>
          <div className="text-yellow-500 font-bold">Cost: {cost}</div>
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isGameHub, setIsGameHub] = useState(false);
  const [isSignInPage, setIsSignInPage] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isFullStory, setIsFullStory] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const toggleHub = () => setIsGameHub(!isGameHub);
  const toggleStory = () => setIsFullStory(!isFullStory);
  const toggleSignIn = () => {
    setIsSignInPage(!isSignInPage);
    setIsForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-yellow-200">
      <AnimatePresence mode="wait">
        {!isGameHub ? (
          <AnimatePresence mode="wait">
            {isSignInPage ? (
              isForgotPassword ? (
                <ForgotPasswordPage onBack={() => setIsForgotPassword(false)} />
              ) : (
                <SignInPage 
                  onSignIn={() => {
                    setIsGameHub(true);
                    setIsSignInPage(false);
                  }}
                  onForgotPassword={() => setIsForgotPassword(true)}
                  onBack={toggleSignIn}
                />
              )
            ) : !isFullStory ? (
              <motion.div
                key="giraffe-site"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                {/* National Geographic Header */}
                <header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
                  <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      {/* Logo Placeholder */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-8 bg-yellow-400 border-2 border-black"></div>
                        <span className="font-black text-xl tracking-tighter uppercase">National Geographic</span>
                      </div>
                      <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
                        <a href="#" className="hover:text-black transition-colors">Animals</a>
                        <a href="#" className="hover:text-black transition-colors">Environment</a>
                        <a href="#" className="hover:text-black transition-colors">History</a>
                        <a href="#" className="hover:text-black transition-colors">Science</a>
                      </nav>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <Search size={20} />
                      </button>
                      <button 
                        onClick={toggleSignIn}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-800 transition-colors"
                      >
                        <User size={16} />
                        Sign In
                      </button>
                      <button className="md:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <Menu size={20} />
                      </button>
                    </div>
                  </div>
                </header>

                {/* Hero Section */}
                <main>
                  <section className="relative h-[80vh] overflow-hidden">
                    <img 
                      src="https://picsum.photos/seed/giraffe1/1920/1080" 
                      alt="Giraffe in the wild"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                      <div className="max-w-7xl mx-auto">
                        <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest mb-4">Featured Story</span>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-6 max-w-4xl">
                          The Towering Giants of the Savannah
                        </h1>
                        <p className="text-zinc-300 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-8">
                          Giraffes are the world's tallest mammals, thanks to their towering legs and long necks. 
                          Learn how these majestic creatures navigate the African plains.
                        </p>
                        <button 
                          onClick={toggleStory}
                          className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm group"
                        >
                          Read the full story <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Content Grid */}
                  <section className="max-w-7xl mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="space-y-4">
                        <img src="https://picsum.photos/seed/giraffe2/800/600" alt="Giraffe detail" className="w-full aspect-[4/3] object-cover rounded-sm" referrerPolicy="no-referrer" />
                        <h3 className="text-xl font-bold leading-tight">Unique Patterns: No Two Giraffes Are Alike</h3>
                        <p className="text-zinc-600 text-sm leading-relaxed">
                          Just like human fingerprints, the coat patterns of a giraffe are unique to each individual. 
                          These patterns help with camouflage and temperature regulation.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <img src="https://picsum.photos/seed/giraffe3/800/600" alt="Giraffe neck" className="w-full aspect-[4/3] object-cover rounded-sm" referrerPolicy="no-referrer" />
                        <h3 className="text-xl font-bold leading-tight">The Mystery of the Long Neck</h3>
                        <p className="text-zinc-600 text-sm leading-relaxed">
                          A giraffe's neck can be over 6 feet long, yet it contains the same number of vertebrae as a human neck. 
                          Evolution has shaped this remarkable feature for survival.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <img src="https://picsum.photos/seed/giraffe4/800/600" alt="Giraffe habitat" className="w-full aspect-[4/3] object-cover rounded-sm" referrerPolicy="no-referrer" />
                        <h3 className="text-xl font-bold leading-tight">Conservation: Protecting the Giants</h3>
                        <p className="text-zinc-600 text-sm leading-relaxed">
                          Giraffe populations have declined significantly over the past few decades. 
                          Discover how National Geographic is working to ensure their future.
                        </p>
                      </div>
                    </div>
                  </section>
                </main>

                {/* Footer */}
                <footer className="bg-zinc-950 text-white py-20">
                  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-8">
                        <div className="w-6 h-8 bg-yellow-400 border-2 border-black"></div>
                        <span className="font-black text-xl tracking-tighter uppercase">National Geographic</span>
                      </div>
                      <p className="text-zinc-500 text-sm max-w-md">
                        National Geographic has been at the forefront of exploration and storytelling for over 130 years. 
                        Join us as we continue to push the boundaries of human knowledge.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Explore</h4>
                      <ul className="space-y-4 text-sm text-zinc-400">
                        <li><a href="#" className="hover:text-white transition-colors">News</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Magazine</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">TV Shows</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
                      <ul className="space-y-4 text-sm text-zinc-400">
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                      </ul>
                    </div>
                  </div>
                </footer>
              </motion.div>
            ) : (
              <motion.div
                key="full-story"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white min-h-screen"
              >
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
                  <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button 
                      onClick={toggleStory}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-yellow-600 transition-colors"
                    >
                      <ArrowLeft size={16} /> Back to Explorer
                    </button>
                    <div className="w-6 h-8 bg-yellow-400 border-2 border-black"></div>
                  </div>
                </header>

                <article className="max-w-3xl mx-auto px-4 py-20">
                  <span className="text-yellow-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Wildlife & Nature</span>
                  <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                    The Towering Giants of the Savannah
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-12 pb-8 border-b border-zinc-100">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                      <img src="https://picsum.photos/seed/author/100/100" alt="Author" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">By Dr. Elena Vance</p>
                      <p className="text-zinc-400 text-[10px] uppercase tracking-widest">National Geographic Explorer</p>
                    </div>
                  </div>

                  <div className="prose prose-zinc lg:prose-xl max-w-none">
                    <p className="text-xl font-serif italic text-zinc-600 mb-12 leading-relaxed">
                      "To see a giraffe in the wild is to witness a masterpiece of evolutionary design. 
                      They move with a slow-motion grace that defies their massive proportions."
                    </p>

                    <h2 className="text-2xl font-black uppercase tracking-tight mt-12 mb-4">The Tallest Mammal on Earth</h2>
                    <p className="mb-6">
                      Standing up to 19 feet tall, giraffes are the undisputed giants of the African savannah. 
                      Their height is not just for show; it allows them to reach nutrient-rich leaves in the 
                      highest canopies of acacia trees, far beyond the reach of other herbivores. 
                      This specialized niche has allowed them to thrive in competitive environments for millennia.
                    </p>

                    {/* Real Video Integration */}
                    <div className="my-12 aspect-video rounded-2xl overflow-hidden bg-zinc-100 shadow-xl border border-zinc-200">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtubeeducation.com/embed/P_ckAbOr0r4" 
                        title="Giraffes 101 | Nat Geo Wild" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                      ></iframe>
                    </div>

                    <h2 className="text-2xl font-black uppercase tracking-tight mt-12 mb-4">A Heart of Steel</h2>
                    <p className="mb-6">
                      Pumping blood up a six-foot neck is no small feat. A giraffe's heart is a biological marvel, 
                      weighing up to 25 pounds and generating nearly double the blood pressure of a human. 
                      This ensures that oxygen reaches the brain even when the animal is standing tall. 
                      When they lower their heads to drink, specialized valves in the neck prevent a sudden 
                      rush of blood from causing a stroke.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-yellow-600 mb-2">Did You Know?</h4>
                        <p className="text-sm font-medium">A giraffe's tongue can be up to 21 inches long and is prehensile, allowing them to strip leaves from thorny branches with surgical precision.</p>
                      </div>
                      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-yellow-600 mb-2">Social Structure</h4>
                        <p className="text-sm font-medium">Groups of giraffes are called "towers." These groups are fluid and social, often forming bonds that last for years across the vast plains.</p>
                      </div>
                    </div>

                    <h2 className="text-2xl font-black uppercase tracking-tight mt-12 mb-4">The Silent Extinction</h2>
                    <p className="mb-6">
                      Despite their iconic status, giraffes are facing a "silent extinction." 
                      In the last 30 years, their populations have plummeted by nearly 40% due to 
                      habitat loss, poaching, and civil unrest. National Geographic is working 
                      with local communities and conservationists to track giraffe movements 
                      using satellite collars and protect critical migration corridors.
                    </p>

                    <p className="mt-12 pt-8 border-t border-zinc-100 text-zinc-400 text-sm italic">
                      This story was originally published in the March 2024 issue of National Geographic Magazine.
                    </p>
                  </div>
                </article>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div
            key="game-hub"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[100] bg-zinc-950 text-white overflow-y-auto"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/20 blur-[120px] rounded-full animate-pulse"></div>
              <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse [animation-delay:1s]"></div>
              <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
              <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-yellow-500/20 blur-[120px] rounded-full animate-pulse [animation-delay:3s]"></div>
              <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full animate-pulse [animation-delay:4s]"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
              <header className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setIsGameHub(false);
                      setIsSignInPage(false);
                      setActiveGame(null);
                    }}
                    className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                      <Gamepad2 className="text-yellow-500" /> Game Hub
                    </h2>
                    <p className="text-zinc-500 text-sm">Welcome back, Explorer. Ready for a challenge?</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Total XP</div>
                    <div className="text-xl font-bold text-yellow-500">12,450</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black">
                    RL
                  </div>
                </div>
              </header>

              {!activeGame ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Game Card 1 */}
                  <motion.button
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setActiveGame('snake')}
                    className="group relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 text-left shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 h-full flex flex-col justify-between relative z-10">
                      <div>
                        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700">
                          <Trophy className="text-yellow-500" size={24} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Savannah Snake</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                          Guide the giraffe-patterned snake to collect leaves and grow. Don't hit the walls!
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">Play Now</span>
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black">
                          <Play size={18} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Game Card 2 */}
                  <motion.button
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setActiveGame('clicker')}
                    className="group relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 text-left shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 h-full flex flex-col justify-between relative z-10">
                      <div>
                        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700">
                          <RefreshCw className="text-emerald-500" size={24} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Energy Clicker</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                          Generate energy for the savannah by clicking. Buy upgrades to increase your output.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Play Now</span>
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                          <Play size={18} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Game Card 3: Google Chrome 65 Remake */}
                  <motion.button
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setActiveGame('chrome65')}
                    className="group relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 text-left shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 h-full flex flex-col justify-between relative z-10">
                      <div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                          <Globe className="text-blue-500" size={24} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Chrome 65 Remake</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          A nostalgic remake of Google Chrome 65 from 2018. Includes internal pages and stealth browsing.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Launch Browser</span>
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <ExternalLink size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Game Card 4: QuackPrep */}
                  <motion.button
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setActiveGame('quackprep')}
                    className="group relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 text-left shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 h-full flex flex-col justify-between relative z-10">
                      <div>
                        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700">
                          <BookOpen className="text-orange-500" size={24} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">QuackPrep Portal</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                          Access QuackPrep in a high-security Level 3 sandbox. Scripts enabled for full functionality.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Open Portal</span>
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black">
                          <ExternalLink size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Game Card 5: YouBlock+ */}
                  <motion.button
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => setActiveGame('youblock')}
                    className="group relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 text-left shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 h-full flex flex-col justify-between relative z-10">
                      <div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                          <Youtube className="text-red-500" size={24} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">YouBlock+</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          Ad-free YouTube viewing through educational gateways. Just paste the ID and watch.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-red-500">Launch Tool</span>
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                          <Play size={18} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Coming Soon */}
                  <div className="aspect-[4/5] bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed flex flex-col items-center justify-center text-zinc-600">
                    <Pause size={48} className="mb-4 opacity-20" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">More Coming Soon</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setActiveGame(null)}
                    className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
                  >
                    <ArrowLeft size={16} /> Back to Hub
                  </button>
                  
                  <div className="w-full flex justify-center">
                    {activeGame === 'snake' && <SnakeGame />}
                    {activeGame === 'clicker' && <ClickerGame />}
                    {activeGame === 'chrome65' && <Chrome65Remake />}
                    {activeGame === 'quackprep' && <QuackPrepViewer />}
                    {activeGame === 'youblock' && <YouBlockPlus />}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

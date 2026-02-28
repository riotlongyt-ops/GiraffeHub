/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Menu, 
  ArrowLeft,
  RotateCcw,
  Plus,
  X,
  Star,
  ExternalLink,
  ChevronRight,
  Globe,
  Download,
  MoreVertical,
  Settings,
  History,
  Bookmark,
  Trash2,
  FileText
} from 'lucide-react';

// --- Sandbox Utility ---

const renderBrowserStage = (tab: { id: string; url: string; name: string }, renderInternalPage: (url: string) => React.ReactNode) => {
  if (tab.url.startsWith('chrome://')) return renderInternalPage(tab.url);

  const sandboxConfig = "allow-scripts allow-forms allow-same-origin allow-popups allow-modals allow-presentation";
  
  // Using srcDoc wrapper to fix origin issues in file:// protocol and ensure consistent loading
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html style="height:100%; margin:0; padding:0;">
      <head>
        <meta charset="utf-8">
        <title>${tab.name}</title>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <iframe 
          src="${tab.url}" 
          sandbox="${sandboxConfig}" 
          allowfullscreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; geolocation; microphone; camera;"
        ></iframe>
      </body>
    </html>
  `;

  return (
    <iframe 
      key={`${tab.id}-${tab.url}`}
      srcDoc={iframeSrcDoc}
      className="w-full h-full border-none bg-white"
      allowFullScreen
    />
  );
};

const Chrome65Remake = () => {
  const [tabs, setTabs] = useState<{ id: string; url: string; name: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [bookmarks, setBookmarks] = useState<{ name: string; url: string }[]>([
    { name: 'Google', url: 'https://google.com?igu=1' }
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addTab = (url = 'chrome://new-tab') => {
    const id = 't-' + Date.now();
    const name = getTabName(url);
    const newTabs = [...tabs, { id, url, name }];
    setTabs(newTabs);
    setActiveId(id);
    setUrlInput(url);
  };

  const getTabName = (url: string) => {
    if (url === 'chrome://new-tab') return 'New Tab';
    if (url === 'chrome://settings') return 'Settings';
    if (url === 'chrome://extensions') return 'Extensions';
    if (url === 'chrome://bookmarks') return 'Bookmarks';
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return 'Site';
    }
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeId === id && newTabs.length > 0) {
      const nextTab = newTabs[0];
      setActiveId(nextTab.id);
      setUrlInput(nextTab.url);
    } else if (newTabs.length === 0) {
      setActiveId(null);
      setUrlInput('');
      addTab();
    }
  };

  const navigate = (customUrl?: string) => {
    let val = (customUrl || urlInput).trim();
    if (!val) return;
    
    if (val.startsWith('chrome://')) {
      // Internal pages
    } else if (!val.includes('.') && !val.startsWith('http')) {
      val = 'https://www.google.com/search?q=' + encodeURIComponent(val) + '&igu=1';
    } else if (!val.startsWith('http')) {
      val = 'https://' + val;
    }
    
    if (activeId) {
      setTabs(tabs.map(t => t.id === activeId ? { ...t, url: val, name: getTabName(val) } : t));
      setUrlInput(val);
    } else {
      addTab(val);
    }
    setShowMenu(false);
  };

  const toggleBookmark = () => {
    const currentUrl = activeTab?.url;
    if (!currentUrl) return;

    const isBookmarked = bookmarks.some(b => b.url === currentUrl);
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(b => b.url !== currentUrl));
    } else {
      setBookmarks([...bookmarks, { name: activeTab.name, url: currentUrl }]);
    }
  };

  const downloadOfflineHTML = () => {
    const currentUrl = activeTab?.url || 'about:blank';
    const fileName = `${activeTab?.name || 'page'}.html`;
    
    let content = '';
    if (currentUrl.startsWith('chrome://')) {
      // For internal pages, we can actually "render" them to a string
      // This is a simplified version
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${activeTab?.name} - Offline</title>
          <style>
            body { font-family: sans-serif; padding: 40px; background: #f1f3f4; }
            .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${activeTab?.name}</h1>
            <p>This is an offline snapshot of <strong>${currentUrl}</strong>.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `;
    } else {
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${activeTab?.name} - Offline</title>
        </head>
        <body>
          <h1>${activeTab?.name}</h1>
          <p>Offline version of: <a href="${currentUrl}">${currentUrl}</a></p>
          <p>Note: External content cannot be fully saved due to security restrictions, but you can access the link above when online.</p>
          <hr>
          <p>Snapshot taken on: ${new Date().toLocaleString()}</p>
        </body>
        </html>
      `;
    }

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const downloadBrowser = async () => {
    try {
      // Get the entire HTML content including the doctype
      const doctype = new XMLSerializer().serializeToString(document.doctype!);
      const html = doctype + document.documentElement.outerHTML;
      
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Chrome-65-Remake-Offline.html';
      a.click();
      URL.revokeObjectURL(url);
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to download browser:', error);
      alert('Failed to download the offline version. Please try again.');
    }
  };

  useEffect(() => {
    if (tabs.length === 0) addTab();
  }, []);

  const activeTab = tabs.find(t => t.id === activeId);
  const isCurrentBookmarked = bookmarks.some(b => b.url === activeTab?.url);

  const renderInternalPage = (url: string) => {
    if (url === 'chrome://new-tab') {
      return (
        <div className="w-full h-full bg-white flex flex-col items-center pt-24 font-sans overflow-y-auto">
          <div className="mb-8">
            {/* Using a text-based logo or a more reliable SVG for offline support */}
            <div className="flex items-center text-6xl font-bold tracking-tighter">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>
          </div>
          <div className="w-full max-w-[584px] relative group px-4">
            <input 
              type="text" 
              className="w-full h-[44px] px-12 border border-zinc-200 rounded-full shadow-sm hover:shadow-md focus:shadow-md outline-none transition-shadow"
              placeholder="Search Google or type a URL"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Search className="absolute left-8 top-3 text-zinc-400" size={20} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8 mt-12 w-full max-w-[584px] px-4">
            {bookmarks.slice(0, 8).map((b, i) => (
              <div key={i} onClick={() => navigate(b.url)} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                  <Globe size={20} className="text-zinc-500" />
                </div>
                <span className="text-[12px] text-zinc-600 truncate max-w-full">{b.name}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => addTab('chrome://bookmarks')}>
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                <Plus size={20} className="text-zinc-500" />
              </div>
              <span className="text-[12px] text-zinc-600">Add shortcut</span>
            </div>
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
          </div>
          <div className="flex-grow overflow-y-auto p-4 sm:p-12">
            <div className="max-w-[680px] mx-auto bg-white rounded shadow-sm p-6">
              <h3 className="text-zinc-500 text-sm font-medium mb-6 uppercase tracking-wider">About Chrome</h3>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 shrink-0">
                   <img src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="" className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-2xl font-normal text-zinc-900 mb-2">Google Chrome</h4>
                  <p className="text-sm text-zinc-500">Version 65.0.3325.146 (Official Build) (64-bit)</p>
                  <div className="mt-8 space-y-4 border-t pt-6">
                    <p className="text-sm text-zinc-600">Google Chrome is up to date.</p>
                  </div>
                </div>
              </div>
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
          </div>
          <div className="flex-grow overflow-y-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
            {[
              { name: 'Google Docs Offline', ver: '1.4', desc: 'Get things done offline with the Google Docs family of products.' },
              { name: 'Chrome PDF Viewer', ver: '1.0', desc: 'A built-in extension to view PDF files.' }
            ].map((ext, i) => (
              <div key={i} className="bg-white rounded shadow-sm p-4 flex flex-col border border-zinc-200">
                <div className="flex gap-4 mb-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded flex items-center justify-center border border-zinc-200 shrink-0">
                    <Globe size={20} className="text-zinc-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-zinc-900">{ext.name} <span className="text-zinc-500 font-normal ml-1">{ext.ver}</span></h5>
                    <p className="text-[12px] text-zinc-500 mt-1">{ext.desc}</p>
                  </div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-4 border-t">
                  <button className="text-[#3367d6] text-[11px] font-bold uppercase">Details</button>
                  <div className="w-8 h-3 bg-[#3367d6]/30 rounded-full relative">
                    <div className="w-4 h-4 bg-[#3367d6] rounded-full absolute -top-0.5 right-0 shadow"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (url === 'chrome://bookmarks') {
      return (
        <div className="w-full h-full bg-[#f1f3f4] flex flex-col font-sans overflow-hidden">
          <div className="bg-[#3367d6] h-14 flex items-center px-6 gap-6 shadow-md shrink-0">
            <Menu className="text-white cursor-pointer" size={20} />
            <span className="text-white text-lg font-medium">Bookmarks</span>
          </div>
          <div className="flex-grow overflow-y-auto p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-600 uppercase tracking-wider">All Bookmarks</span>
                <button onClick={() => setBookmarks([])} className="text-xs text-red-600 hover:text-red-700 font-bold uppercase">Clear All</button>
              </div>
              <div className="divide-y divide-zinc-100">
                {bookmarks.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 group transition-colors">
                    <div className="flex items-center gap-4 cursor-pointer flex-grow" onClick={() => navigate(b.url)}>
                      <Globe size={18} className="text-zinc-400" />
                      <div>
                        <div className="text-sm font-medium text-zinc-900">{b.name}</div>
                        <div className="text-xs text-zinc-400 truncate max-w-md">{b.url}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBookmarks(bookmarks.filter((_, idx) => idx !== i))}
                      className="p-2 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {bookmarks.length === 0 && (
                  <div className="p-12 text-center text-zinc-400">
                    <Bookmark size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No bookmarks yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (url === 'chrome://history') {
      return (
        <div className="w-full h-full bg-[#f1f3f4] flex flex-col font-sans overflow-hidden">
          <div className="bg-[#3367d6] h-14 flex items-center px-6 gap-6 shadow-md shrink-0">
            <Menu className="text-white cursor-pointer" size={20} />
            <span className="text-white text-lg font-medium">History</span>
          </div>
          <div className="flex-grow overflow-y-auto p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-600 uppercase tracking-wider">Recent History</span>
                <button className="text-xs text-red-600 hover:text-red-700 font-bold uppercase">Clear History</button>
              </div>
              <div className="divide-y divide-zinc-100">
                {tabs.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 group transition-colors">
                    <div className="flex items-center gap-4 cursor-pointer flex-grow" onClick={() => navigate(t.url)}>
                      <History size={18} className="text-zinc-400" />
                      <div>
                        <div className="text-sm font-medium text-zinc-900">{t.name}</div>
                        <div className="text-xs text-zinc-400 truncate max-w-md">{t.url}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={containerRef} 
      className="fixed inset-0 flex flex-col bg-[#dee1e6] font-sans selection:bg-[#3367d6]/30"
    >
      {/* Chrome 65 Tabs */}
      <div className="flex items-end px-2 pt-2 h-10 gap-0.5 overflow-x-auto scrollbar-hide shrink-0 bg-[#dee1e6]">
        <AnimatePresence initial={false}>
          {tabs.map(tab => (
            <motion.div
              key={tab.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
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
            </motion.div>
          ))}
        </AnimatePresence>
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
          <button 
            onClick={toggleBookmark}
            className={`absolute right-4 transition-colors ${isCurrentBookmarked ? 'text-yellow-500' : 'text-zinc-400 hover:text-yellow-500'}`}
          >
            <Star size={16} fill={isCurrentBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-1 px-1 relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1.5 rounded-full transition-colors ${showMenu ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-100'}`}
          >
            <MoreVertical size={20} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-zinc-200 py-2 z-[1000] font-sans"
              >
                <button onClick={() => addTab()} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center justify-between">
                  New tab <span className="text-zinc-400 text-xs">Ctrl+T</span>
                </button>
                <div className="h-px bg-zinc-100 my-1"></div>
                <button onClick={() => addTab('chrome://bookmarks')} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3">
                  <Bookmark size={16} className="text-zinc-500" /> Bookmarks
                </button>
                <button onClick={() => addTab('chrome://history')} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3">
                  <History size={16} className="text-zinc-500" /> History
                </button>
                <button onClick={downloadOfflineHTML} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3 text-emerald-600 font-medium">
                  <Download size={16} /> Save Page Offline
                </button>
                <button onClick={downloadBrowser} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3 text-blue-600 font-medium">
                  <Globe size={16} /> Download Browser (Offline)
                </button>
                <div className="h-px bg-zinc-100 my-1"></div>
                <button onClick={() => addTab('chrome://settings')} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3">
                  <Settings size={16} className="text-zinc-500" /> Settings
                </button>
                <button onClick={() => addTab('chrome://extensions')} className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3">
                  <Globe size={16} className="text-zinc-500" /> Extensions
                </button>
                <div className="h-px bg-zinc-100 my-1"></div>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3">
                  <FileText size={16} className="text-zinc-500" /> Print...
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 flex items-center gap-3">
                  <Search size={16} className="text-zinc-500" /> Find...
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="bg-white px-4 py-1 flex items-center gap-4 border-b border-zinc-200 shrink-0 overflow-x-auto scrollbar-hide">
        {bookmarks.map((b, i) => (
          <button 
            key={i} 
            onClick={() => navigate(b.url)}
            className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:bg-zinc-100 px-2 py-1 rounded transition-colors whitespace-nowrap"
          >
            <Globe size={12} className="text-zinc-400" />
            {b.name}
          </button>
        ))}
        {bookmarks.length === 0 && (
          <span className="text-[11px] text-zinc-400 italic">No bookmarks to show</span>
        )}
      </div>

      {/* Stage */}
      <div className="flex-grow bg-white relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full"
            >
              {renderBrowserStage(activeTab, renderInternalPage)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function App() {
  return <Chrome65Remake />;
}

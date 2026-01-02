
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Video, AppTab } from './types';
import VideoPlayer from './components/VideoPlayer';
import VideoCard from './components/VideoCard';
import { getAIInsights, getSmartSuggestions } from './services/geminiService';

const MOCK_VIDEOS: Video[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
    channel: "Rick Astley",
    views: "1.2B views",
    publishedTime: "14 years ago",
    description: "The official video for Never Gonna Give You Up by Rick Astley."
  },
  {
    id: 'jNQXAC9IVRw',
    title: "Me at the zoo",
    thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    channel: "jawed",
    views: "260M views",
    publishedTime: "18 years ago",
    description: "The first video on YouTube."
  },
  {
    id: '9bZkp7q19f0',
    title: "PSY - GANGNAM STYLE(강남스타일) M/V",
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hq720.jpg",
    channel: "officialpsy",
    views: "4.8B views",
    publishedTime: "11 years ago"
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: "Queen – Bohemian Rhapsody (Official Video Remastered)",
    thumbnail: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hq720.jpg",
    channel: "Queen Official",
    views: "1.6B views",
    publishedTime: "15 years ago"
  },
  {
    id: 'kJQP7kiw5Fk',
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hq720.jpg",
    channel: "Luis Fonsi",
    views: "8.2B views",
    publishedTime: "6 years ago"
  },
  {
    id: 'L_jWHffIx5E',
    title: "Smash Mouth - All Star (Official Music Video)",
    thumbnail: "https://i.ytimg.com/vi/L_jWHffIx5E/hq720.jpg",
    channel: "SmashMouthVEVO",
    views: "450M views",
    publishedTime: "13 years ago"
  },
  {
    id: 'CevxZvSJLk8',
    title: "Katy Perry - Roar (Official)",
    thumbnail: "https://i.ytimg.com/vi/CevxZvSJLk8/hq720.jpg",
    channel: "Katy Perry",
    views: "3.8B views",
    publishedTime: "10 years ago"
  },
  {
    id: '3JZ_D3iqxDk',
    title: "Mark Ronson - Uptown Funk ft. Bruno Mars",
    thumbnail: "https://i.ytimg.com/vi/3JZ_D3iqxDk/hq720.jpg",
    channel: "MarkRonsonVEVO",
    views: "4.9B views",
    publishedTime: "8 years ago"
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingInsights(true);
    const suggestions = await getSmartSuggestions(searchQuery);
    setSmartSuggestions(suggestions);
    setIsLoadingInsights(false);
    
    // Check if user pasted a YouTube URL
    const videoIdMatch = searchQuery.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (videoIdMatch && videoIdMatch[1]) {
      const newVideo: Video = {
        id: videoIdMatch[1],
        title: "Pasted Video",
        thumbnail: `https://i.ytimg.com/vi/${videoIdMatch[1]}/hqdefault.jpg`,
        channel: "Direct Link",
        views: "N/A",
        publishedTime: "Just now"
      };
      setSelectedVideo(newVideo);
      setSearchQuery('');
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedVideo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setAiInsights(null);
      setIsLoadingInsights(true);
      getAIInsights(selectedVideo.title).then(insights => {
        setAiInsights(insights);
        setIsLoadingInsights(false);
      });
    }
  }, [selectedVideo]);

  const filteredVideos = MOCK_VIDEOS.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-zinc-800">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-zinc-800 rounded-full md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSelectedVideo(null)}>
          <div className="bg-red-600 p-1 rounded-lg">
             <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
             </svg>
          </div>
          <span className="text-xl font-bold tracking-tighter hidden sm:inline">TubeFlow</span>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto flex">
          <div className="relative flex-1 group">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search or paste YouTube URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-l-full py-2 px-6 focus:outline-none focus:border-blue-500 transition-all placeholder-zinc-500"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button className="bg-zinc-800 border border-l-0 border-zinc-800 px-6 py-2 rounded-r-full hover:bg-zinc-700 transition-colors">
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-zinc-800 rounded-full hidden sm:block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f0f0f] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static transition-transform duration-300 ease-in-out border-r border-zinc-800 p-3 flex flex-col gap-1`}>
          <button 
            onClick={() => { setActiveTab(AppTab.HOME); setSelectedVideo(null); }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === AppTab.HOME && !selectedVideo ? 'bg-zinc-800 font-bold' : 'hover:bg-zinc-900 text-zinc-300'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Home
          </button>
          <button 
            onClick={() => { setActiveTab(AppTab.TRENDING); setSelectedVideo(null); }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === AppTab.TRENDING ? 'bg-zinc-800 font-bold' : 'hover:bg-zinc-900 text-zinc-300'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 1.5l-3 3.5h-5l1.5 1.5h-3.5v1.5h1.5v3.5l-2.5 3h16l-3-11.5zM6.5 13.5l2.5-1.5 2.5 1.5-1.5-2.5 1.5-2.5-2.5 1.5-2.5-1.5 1.5 2.5z"/></svg>
            Trending
          </button>
          <button 
            onClick={() => { setActiveTab(AppTab.LIBRARY); setSelectedVideo(null); }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === AppTab.LIBRARY ? 'bg-zinc-800 font-bold' : 'hover:bg-zinc-900 text-zinc-300'}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
            Library
          </button>
          
          <div className="my-4 border-t border-zinc-800"></div>
          
          <h3 className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Smart Suggestions</h3>
          {smartSuggestions.map((tag, idx) => (
            <button 
              key={idx}
              onClick={() => { setSearchQuery(tag); handleSearch(); }}
              className="flex items-center gap-4 p-2 px-3 rounded-lg text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all text-left"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="truncate">{tag}</span>
            </button>
          ))}
          {!smartSuggestions.length && <p className="px-3 py-2 text-xs text-zinc-600 italic">Search to get AI ideas</p>}
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {selectedVideo ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Player Column */}
              <div className="flex-1 lg:max-w-[70%]">
                <VideoPlayer videoId={selectedVideo.id} title={selectedVideo.title} />
                
                {/* AI Insights Card */}
                <div className="mt-6 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      Gemini Insights
                    </h2>
                  </div>
                  
                  {isLoadingInsights ? (
                    <div className="flex flex-col gap-3 animate-pulse">
                      <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                      <div className="h-4 bg-zinc-800 rounded w-full"></div>
                      <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <div className="text-zinc-300 leading-relaxed prose prose-invert max-w-none">
                      {aiInsights || "Watch this video to get AI-powered takeaways."}
                    </div>
                  )}
                </div>

                {/* Description and more */}
                <div className="mt-6 bg-zinc-900/30 p-4 rounded-xl text-sm text-zinc-400">
                  <p className="font-bold text-white mb-2">{selectedVideo.views} • {selectedVideo.publishedTime}</p>
                  <p className="whitespace-pre-line">{selectedVideo.description || "No description provided for this video."}</p>
                </div>
              </div>

              {/* Sidebar/Related Videos Column */}
              <div className="lg:w-80 xl:w-96 flex flex-col gap-4">
                <h3 className="font-bold text-lg mb-2">Related Content</h3>
                {MOCK_VIDEOS.filter(v => v.id !== selectedVideo.id).map(video => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    onClick={setSelectedVideo}
                    layout="list"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'Recommended For You'}
                </h2>
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium cursor-pointer hover:bg-zinc-700 transition-colors">Music</span>
                   <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium cursor-pointer hover:bg-zinc-700 transition-colors">Gaming</span>
                   <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium cursor-pointer hover:bg-zinc-700 transition-colors">Tech</span>
                </div>
              </div>

              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {filteredVideos.map(video => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onClick={setSelectedVideo}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">No results found</h3>
                  <p className="text-zinc-500 mt-2 max-w-sm">Try using different keywords or paste a direct YouTube video link.</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action for Mobile Search refinement */}
      {searchQuery && !selectedVideo && (
        <div className="fixed bottom-6 right-6 md:hidden">
          <button 
             onClick={() => searchInputRef.current?.focus()}
             className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

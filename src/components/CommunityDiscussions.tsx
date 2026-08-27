import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  Flame,
  Radio
} from 'lucide-react';

interface CommunityDiscussionsProps {
  initialTopic?: string;
}

const TOPICS = [
  { id: 'sg-transit-general', name: '💬 General Chatter', desc: 'Commuter tips, daily transit discussions' },
  { id: 'sg-transit-delays', name: '🚨 Delays & Crowd Reports', desc: 'Live MRT hold-ups & bus bunching' },
  { id: 'sg-transit-weather', name: '🌧️ Weather & Shelter Paths', desc: 'Rainy day sheltered routes & links' },
  { id: 'sg-transit-feedback', name: '💡 Suggestions & Feedback', desc: 'Ideas to improve SG Transit Hub' },
];

export const CommunityDiscussions: React.FC<CommunityDiscussionsProps> = ({ initialTopic = 'sg-transit-general' }) => {
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [isLoading, setIsLoading] = useState(true);

  // Load and configure Disqus
  useEffect(() => {
    setIsLoading(true);

    const disqusShortname = 'sg-transit';
    const pageIdentifier = selectedTopic;
    const canonicalUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${window.location.pathname}#discussions-${selectedTopic}` 
      : '';

    // Set Disqus configuration on window
    (window as any).disqus_config = function () {
      this.page.url = canonicalUrl;
      this.page.identifier = pageIdentifier;
      this.page.title = `SG Transit Community - ${selectedTopic}`;
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // If DISQUS is already loaded on the page, reset it with new config
    if ((window as any).DISQUS) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = pageIdentifier;
            this.page.url = canonicalUrl;
            this.page.title = `SG Transit Community - ${selectedTopic}`;
          },
        });
        setIsLoading(false);
      } catch (err) {
        console.warn('Disqus reset handled:', err);
        setIsLoading(false);
      }
    } else {
      // Inject Disqus embed script only if element is in DOM
      const threadEl = document.getElementById('disqus_thread');
      if (threadEl) {
        const scriptId = 'disqus-embed-script';
        const existingScript = document.getElementById(scriptId);

        if (!existingScript) {
          try {
            const d = document;
            const s = d.createElement('script');
            s.id = scriptId;
            s.src = `https://${disqusShortname}.disqus.com/embed.js`;
            s.setAttribute('data-timestamp', String(+new Date()));
            s.async = true;
            s.crossOrigin = 'anonymous';
            s.onload = () => setIsLoading(false);
            s.onerror = () => setIsLoading(false);
            (d.head || d.body).appendChild(s);
          } catch (err) {
            console.warn('Disqus script load error handled:', err);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [selectedTopic]);

  const handleRefresh = () => {
    if ((window as any).DISQUS) {
      setIsLoading(true);
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: (window as any).disqus_config,
        });
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    }
  };

  return (
    <div id="community-discussions-panel" className="flex flex-col h-full bg-white border-4 border-slate-900 rounded-3xl bento-shadow-md overflow-hidden select-none">
      {/* Top Bento Header */}
      <div className="p-4 md:p-5 border-b-4 border-slate-900 bg-amber-400">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-2 border-slate-900 bento-shadow-sm flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
                  Commuter Community
                </h2>
                <span className="flex items-center gap-1 bg-white border border-slate-900 px-2 py-0.5 rounded-full text-[10px] font-black text-slate-900">
                  <Radio className="w-2.5 h-2.5 text-rose-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] font-bold text-amber-950">
                Disqus Live Forum for Singapore Transit & Delays
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-white border-2 border-slate-900 rounded-xl text-slate-900 hover:bg-slate-100 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Reload Comments"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Topic Pills */}
        <div className="flex gap-2 overflow-x-auto pt-2 scrollbar-none">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTopic === topic.id
                  ? 'bg-slate-900 text-white border-slate-900 bento-shadow-sm translate-y-[-1px]'
                  : 'bg-white/85 text-slate-900 border-slate-900 hover:bg-white'
              }`}
            >
              <span>{topic.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Community Guidelines Banner */}
      <div className="bg-slate-50 border-b-2 border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-bold text-slate-700 truncate">
            Keep posts helpful: Share live station crowds, bus bunching, or rain shelters.
          </span>
        </div>
        <a
          href="https://disqus.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Disqus Network</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Scrollable Disqus Thread Container */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-white min-h-[300px] relative select-text">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-6 text-slate-500 text-xs font-bold">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Connecting to sg-transit.disqus.com feed...</span>
          </div>
        )}

        {/* Disqus Root Thread Anchor */}
        <div id="disqus_thread" className="w-full min-h-[350px]" />

        {/* Noscript Fallback */}
        <noscript>
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-xs font-bold mt-4">
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-blue-600 underline font-black">
              comments powered by Disqus.
            </a>
          </div>
        </noscript>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-100 border-t-2 border-slate-900 flex items-center justify-between text-[10px] font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Feed: sg-transit.disqus.com</span>
        </div>
        <span>Active Channel: #{selectedTopic}</span>
      </div>
    </div>
  );
};

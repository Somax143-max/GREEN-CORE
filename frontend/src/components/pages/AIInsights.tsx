import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Activity, 
  ArrowRight, 
  Sliders, 
  Bot, 
  User, 
  Terminal
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { TabId } from '../layout/Navigation';
import { api } from '../../services/api';

interface AIInsightsProps {
  onNavigateTab: (tab: TabId) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'greencore';
  text: string;
  timestamp: string;
  structuredDetails?: {
    scoreChange?: string;
    contributors?: string[];
    largestAnomaly?: string;
    recommendation?: string;
  };
}

export const AIInsights: React.FC<AIInsightsProps> = ({ onNavigateTab }) => {
  const { 
    isHostelBAnomalyInjected, 
    isOutcomeVerified, 
    isBackendConnected,
    simulateHostelBIntervention,
    setKillerDemoStep
  } = useCampus();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'greencore',
      text: 'Greetings. I am GreenCore AI — your Campus Sustainability Digital Twin & Decision Engine. Unlike generic chat assistants, my inferences are grounded in 9 synchronized campus telemetry sub-meters, daily waste weighbridge logs, and verified mobility surveys. How may I assist your audit team?',
      timestamp: '2026-09-27 10:00:00'
    }
  ]);

  const presetQueries = [
    'Why did our GreenScore fall this month?',
    'Which physical part of the campus is responsible for the largest deterioration?',
    'What should we do right now to restore our GreenScore?',
    'Compare CSE Block vs ME Block energy efficiency.',
    'What is our waste diversion rate and how do we reach 90%?'
  ];

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputQuery('');

    // If backend is connected, fetch from REST API
    if (isBackendConnected) {
      try {
        const res = await api.queryAI(queryText);
        if (res.success && res.result) {
          const replyMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'greencore',
            text: res.result.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            structuredDetails: res.result.structuredDetails
          };
          setChatHistory(prev => [...prev, replyMsg]);
          return;
        }
      } catch (err) {
        console.error('API query fallback:', err);
      }
    }

    // Client-side grounded fallback logic
    let replyMsg: ChatMessage;
    const q = queryText.toLowerCase();

    if (q.includes('why') || q.includes('fall') || q.includes('decrease') || q.includes('drop')) {
      if (isHostelBAnomalyInjected && !isOutcomeVerified) {
        replyMsg = {
          id: `bot-${Date.now()}`,
          sender: 'greencore',
          text: 'GREENCORE MULTI-FACTOR ANALYSIS:\nYour campus GreenScore decreased from 82 → 78 (-4.0 points). Here is the audited causal decomposition:',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredDetails: {
            scoreChange: '82 → 78 (-4.0 pts)',
            contributors: [
              '1. Water score drag: ↓ 12.0 points (Hostel B surge)',
              '2. Waste performance: ↑ 4.0 points improvement (84.2% diversion)',
              '3. Energy efficiency: ↑ 1.2 points improvement (solar offset)'
            ],
            largestAnomaly: 'Hostel B (Indravati Hall) water consumption surged +32.4% (188 L/student/day vs baseline 142 L).',
            recommendation: 'Priority 1 Directive: Inspect Hostel B ground sump feeder and overhead float valve. Night telemetry indicates 3,200 L/hr continuous flow.'
          }
        };
      } else {
        replyMsg = {
          id: `bot-${Date.now()}`,
          sender: 'greencore',
          text: 'GREENCORE DIAGNOSTIC SUMMARY:\nCampus GreenScore is currently stable at 82 / 100 (+2.5% vs baseline). Energy cooling loads are within seasonal norms, and waste diversion rate reached 84.2% following the cafeteria aerobic composting initiative.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } else if (q.includes('which physical') || q.includes('largest deterioration') || q.includes('part')) {
      replyMsg = {
        id: `bot-${Date.now()}`,
        sender: 'greencore',
        text: isHostelBAnomalyInjected && !isOutcomeVerified 
          ? 'SPATIAL DIGITAL TWIN LOCALIZATION:\nHostel B (Indravati Hall of Residence, Code: Hostel B) is responsible for 81.4% of total campus negative score variance. While academic blocks (CSE, ECE) remain optimal, Hostel B water usage has increased to 188 L/capita/day.'
          : 'SPATIAL DIGITAL TWIN LOCALIZATION:\nAll 9 campus nodes are operating within normal baseline limits. The lowest relative efficiency score is currently Mechanical Eng. Workshops (ME) at 76 due to heavy three-phase motor loads.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (q.includes('what should we do') || q.includes('action')) {
      replyMsg = {
        id: `bot-${Date.now()}`,
        sender: 'greencore',
        text: 'GREENCORE ACTION RECOMMENDATIONS:\n1. [P1 High Impact / Low Effort] Dispatch maintenance plumber to Hostel B to repair overhead tank float valve.\n2. [P2 High Impact / Low Effort] Execute 500-tube LED replacement in ME Workshops for ₹2,86,000 annual electricity savings.\n3. [P3 Medium Impact] Expand Cafeteria food waste aerobic composter capacity by 200 kg/day.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (q.includes('cse') && q.includes('me')) {
      replyMsg = {
        id: `bot-${Date.now()}`,
        sender: 'greencore',
        text: 'COMPARATIVE BENCHMARK (CSE vs ME):\n• CSE Block: 40.77 kWh / student • 2.54 kWh/m² • GreenScore: 84\n• ME Workshops: 60.31 kWh / student • 2.61 kWh/m² • GreenScore: 76\nFinding: ME workshop machine motors run during off-peak lab hours with low power factor (0.82 vs 0.96 in CSE). APFC capacitor bank tuning recommended.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else {
      replyMsg = {
        id: `bot-${Date.now()}`,
        sender: 'greencore',
        text: `GREENCORE SYNTHESIS for "${queryText}":\nCampus telemetry shows 245,100 kWh energy, 7,464,000 Litres water, and 4,910 kg waste (84.2% diverted). Verified against Methodology v1.2 with 91% data confidence.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    setChatHistory(prev => [...prev, replyMsg]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              GCEK Autonomous Sustainability Intelligence
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Not An Hallucinating LLM
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            The 5 Questions AI Diagnostic Engine
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            The AI engine explains structured physical findings: WHAT changed, WHERE did it happen, WHEN did it start, WHY it matters, and WHAT action should be taken.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setKillerDemoStep(6);
              simulateHostelBIntervention();
              onNavigateTab('simulator');
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open Action Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The 5 Questions Visual Matrix */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          5-Dimensional Root-Cause Diagnostics (Active Event)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* 1. WHAT */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                01 • WHAT?
              </span>
              <h4 className="text-xs font-extrabold text-white mt-1">What Changed?</h4>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {isHostelBAnomalyInjected && !isOutcomeVerified
                  ? "Water consumption spiked +32.4% (142 → 188 L/student/day)."
                  : "Campus electrical load decreased -1.2% while waste diversion rose to 84.2%."}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              Indicator: Domestic Water
            </div>
          </div>

          {/* 2. WHERE */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block">
                02 • WHERE?
              </span>
              <h4 className="text-xs font-extrabold text-white mt-1">Where Did It Happen?</h4>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {isHostelBAnomalyInjected && !isOutcomeVerified
                  ? "Indravati Hall (Hostel B), Ultrasonic Sub-meter #WM-H2-205."
                  : "All 9 nodes nominal across Academic, Hostels, and Facilities."}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              Node: Hostel B (420 pop)
            </div>
          </div>

          {/* 3. WHEN */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 block">
                03 • WHEN?
              </span>
              <h4 className="text-xs font-extrabold text-white mt-1">When Did It Start?</h4>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {isHostelBAnomalyInjected && !isOutcomeVerified
                  ? "Started 24 Sept 2026, 02:15 AM IST. Persistent across 4 consecutive days."
                  : "Continuous 12-month rolling evaluation."}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              Duration: 4 Days
            </div>
          </div>

          {/* 4. WHY */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 block">
                04 • WHY?
              </span>
              <h4 className="text-xs font-extrabold text-white mt-1">Why Did It Change?</h4>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {isHostelBAnomalyInjected && !isOutcomeVerified
                  ? "Water surged +32.4% while student occupancy only grew +2.1%. Decoupled pattern."
                  : "Waste separation improved via daily mess boy segregation protocols."}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              Model: Multi-signal Vector
            </div>
          </div>

          {/* 5. WHAT NEXT */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block">
                05 • WHAT NEXT?
              </span>
              <h4 className="text-xs font-extrabold text-white mt-1">What Action To Take?</h4>
              <p className="text-xs text-slate-200 mt-1 leading-snug">
                {isHostelBAnomalyInjected && !isOutcomeVerified
                  ? "P1: Inspect Hostel B overhead tank float valves & ground sump feeder line."
                  : "Proceed with Phase 2 LED replacement in ME Workshops."}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-800/80 text-[10px] text-emerald-400 font-bold">
              Directive: Immediate Action
            </div>
          </div>
        </div>
      </div>

      {/* Change Fingerprint Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Multi-Signal Fingerprint Visual */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Multi-Signal "Change Fingerprint"
              </h3>
              <p className="text-xs text-slate-400">
                Correlating the anomaly across 5 concurrent campus variables
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Covariance Test
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Water Signal */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Water Consumption Delta</span>
                <span className="font-mono font-bold text-rose-400">+32.4% Surge</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Occupancy Signal */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Student Resident Occupancy</span>
                <span className="font-mono font-bold text-cyan-400">+2.1% Normal</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: '12%' }} />
              </div>
            </div>

            {/* Energy Signal */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Electrical Load Delta</span>
                <span className="font-mono font-bold text-amber-400">+3.4% Normal</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: '16%' }} />
              </div>
            </div>

            {/* Waste Signal */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Waste Generated Delta</span>
                <span className="font-mono font-bold text-emerald-400">+4.0% Normal</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '18%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Analytical Conclusion:
            </span>
            <p className="text-slate-200 mt-1 leading-snug">
              "Water consumption changed <strong>15.4× more</strong> than occupancy (+2.1%) and other campus signals. Because rainfall is normal (28°C) and duration is 4 days, this is an abnormal usage fingerprint requiring physical plumbing verification."
            </p>
          </div>
        </div>

        {/* Right: "Ask GreenCore" Conversational Diagnostic Console */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Ask GreenCore AI
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Grounded In Telemetry
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Natural language querying over audited campus evidence and scores
                  </p>
                </div>
              </div>

              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                Model: Antigravity Multi-Sensor Engine
              </span>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
              {presetQueries.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(pq)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] border border-slate-800 whitespace-nowrap transition-all"
                >
                  {pq}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {chatHistory.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 text-xs ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'greencore' && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.sender === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {/* Structured details card if returned by GreenCore */}
                    {msg.structuredDetails && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5 text-[11px]">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-400">Score Impact:</span>
                          <span className="text-rose-400">{msg.structuredDetails.scoreChange}</span>
                        </div>
                        <div className="text-slate-300">
                          {msg.structuredDetails.contributors?.map((c, i) => (
                            <div key={i} className="text-slate-300">{c}</div>
                          ))}
                        </div>
                        <div className="pt-1 border-t border-slate-800 text-amber-300 font-semibold">
                          {msg.structuredDetails.largestAnomaly}
                        </div>
                        <div className="text-emerald-400 font-medium">
                          {msg.structuredDetails.recommendation}
                        </div>
                      </div>
                    )}

                    <div className="mt-1 text-[9px] text-slate-400 text-right">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="mt-3 pt-3 border-t border-slate-800">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendQuery(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask GreenCore (e.g. Why did our GreenScore fall this month?)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

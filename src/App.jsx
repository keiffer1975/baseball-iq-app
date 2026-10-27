import React, { useState, useEffect } from 'react';
import { 
  Trophy, Play, RotateCcw, Target, Shield, Zap, Award, CheckCircle2, 
  XCircle, ChevronRight, BarChart2, BookOpen, Clock, AlertTriangle, 
  Activity, HelpCircle
} from 'lucide-react';

// --- DATABASE OF DETAILED BASEBALL IQ SCENARIOS ---
const SCENARIO_DATABASE = [
  {
    id: 1,
    title: "Ground Ball to Shortstop with Runner on 1st",
    level: "Youth / Little League",
    position: "Infield (1B/2B/SS/3B)",
    outs: 1,
    runners: { b1: true, b2: false, b3: false },
    inning: "Top 3rd",
    score: "Tie 2-2",
    runnerSpeed: "Average",
    question: "Hard ground ball directly to SS. 1 out, runner on 1st. What is your primary read and play?",
    options: [
      { text: "Field cleanly, quickly feed Second Baseman (2B) covering second base to initiate a 6-4-3 double play.", correct: true },
      { text: "Take the easy out at 1st base to guarantee getting out of the inning safely.", correct: false },
      { text: "Hold the ball and fake a throw to second base to keep the runner close.", correct: false },
      { text: "Throw directly to 3rd base to force the runner heading towards second base.", correct: false }
    ],
    explanation: "With 1 out and a runner on 1st base, the primary double play opportunity (6-4-3) is the highest priority defensive decision to erase the lead runner and clear the bases.",
    diagram: { ballTarget: "SS", runnerMoves: [{ from: "b1", to: "b2" }] }
  },
  {
    id: 2,
    title: "Fly Ball to Right-Center with Fast Runner on 3rd",
    level: "High School",
    position: "Outfield",
    outs: 1,
    runners: { b1: false, b2: false, b3: true },
    inning: "Bottom 7th",
    score: "Down 1 (3-4)",
    runnerSpeed: "Fast",
    question: "Fly ball deep to right-center field. Runner on 3rd tags on contact. As the Center Fielder making the catch, what is your best target?",
    options: [
      { text: "Catch behind the ball with momentum moving toward home plate, then launch a accurate strike to the Cutoff Man (1B/2B).", correct: true },
      { text: "Throw as hard as possible directly to the Catcher on the fly, regardless of trajectory or cutoff positioning.", correct: false },
      { text: "Hold the ball after catching it to ensure the hitter doesn't advance past 1st base.", correct: false },
      { text: "Throw immediately to 3rd base to appeal if the runner tagged up early.", correct: false }
    ],
    explanation: "Hit the cutoff man on line! Direct long throws to the plate often hop high or miss, letting the runner score while allowing the batter-runner to advance to 2nd base.",
    diagram: { ballTarget: "CF", runnerMoves: [{ from: "b3", to: "home" }] }
  },
  {
    id: 3,
    title: "Bunt Defense - Runner on 1st and 2nd, No Outs",
    level: "College / Pro",
    position: "Infield (1B/2B/SS/3B)",
    outs: 0,
    runners: { b1: true, b2: true, b3: false },
    inning: "Top 6th",
    score: "Up 1 (2-1)",
    runnerSpeed: "Fast",
    question: "Opponent lays down a sacrifice bunt toward 3rd base with runners on 1st & 2nd, 0 outs. As the Third Baseman, what is your primary objective?",
    options: [
      { text: "If fielded cleanly with a hard bunt, communicate with Catcher and throw to 3rd base for the lead force out; otherwise take 1st base.", correct: true },
      { text: "Always throw to 1st base automatically without looking at the lead runner at 3rd base.", correct: false },
      { text: "Let the Pitcher field it completely while you cover 3rd base regardless of where the ball lands.", correct: false },
      { text: "Throw to 2nd base to try and force out the trailing runner.", correct: false }
    ],
    explanation: "Getting the lead out at 3rd base prevents the opponent from advancing a runner into scoring position at 3rd base with no outs. Communication from the catcher is vital.",
    diagram: { ballTarget: "3B-Bunt", runnerMoves: [{ from: "b2", to: "b3" }, { from: "b1", to: "b2" }] }
  },
  {
    id: 4,
    title: "Wild Pitch / Passed Ball Backstop Recovery",
    level: "Youth / Little League",
    position: "Pitcher",
    outs: 2,
    runners: { b1: false, b2: false, b3: true },
    inning: "Bottom 4th",
    score: "Down 2 (0-2)",
    runnerSpeed: "Average",
    question: "Pitch bounces past Catcher to the backstop with a runner on 3rd base and 2 outs. As the Pitcher, what is your immediate assignment?",
    options: [
      { text: "Sprint immediately to cover Home Plate, get low, and prepare to take the tag feed from the Catcher.", correct: true },
      { text: "Run to 1st base to back up a potential throw from the outfield.", correct: false },
      { text: "Stay on the pitcher's mound to receive the throw back from the Catcher.", correct: false },
      { text: "Run behind the backstop to help the Catcher locate the loose baseball.", correct: false }
    ],
    explanation: "On any passed ball or wild pitch with a runner on 3rd base, the Pitcher must instantly cover Home Plate to defend against the runner trying to score.",
    diagram: { ballTarget: "Backstop", runnerMoves: [{ from: "b3", to: "home" }] }
  },
  {
    id: 5,
    title: "Secondary Lead & Dirt Ball Read",
    level: "High School",
    position: "Base Runner / Hitter",
    outs: 1,
    runners: { b1: false, b2: true, b3: false },
    inning: "Top 5th",
    score: "Tie 1-1",
    runnerSpeed: "Fast",
    question: "You are the runner on 2nd base. Pitcher releases a breaking ball that hits the dirt in front of home plate. What is your reaction?",
    options: [
      { text: "Read the downward angle on release, take your secondary shuffle, and read the bounce; advance to 3rd if the ball gets away from Catcher.", correct: true },
      { text: "Immediately break for 3rd base before the pitch hits the dirt without watching the catcher block.", correct: false },
      { text: "Retreat immediately to 2nd base the moment you see the ball hit the dirt.", correct: false },
      { text: "Freeze on 2nd base and wait for your 3rd base coach to yell 'Go!' after the play.", correct: false }
    ],
    explanation: "Anticipating dirt balls through secondary leads allows runners to react instantly and steal 3rd base before the catcher can recover and throw.",
    diagram: { ballTarget: "Dirt", runnerMoves: [{ from: "b2", to: "b3" }] }
  },
  {
    id: 6,
    title: "Full Count Pitch Selection Strategy",
    level: "College / Pro",
    position: "Pitcher",
    outs: 2,
    runners: { b1: true, b2: true, b3: false },
    inning: "Bottom 9th",
    score: "Up 1 (5-4)",
    runnerSpeed: "Fast",
    question: "Full count (3-2), 2 outs, runners on 1st & 2nd in the Bottom 9th. Runners will be running on the pitch. What is your primary mindset as Pitcher/Catcher?",
    options: [
      { text: "Execute your best strikeout/swing-and-miss pitch in the zone. Walk loads the bases, so aggressive zone placement is key.", correct: true },
      { text: "Throw a pitch way outside to test if the batter will chase on the automated runner movement.", correct: false },
      { text: "Throw an intentional slow lob pitch to disrupt the timing of the moving runners.", correct: false },
      { text: "Pick off to 2nd base repeatedly until the batter steps out of the box.", correct: false }
    ],
    explanation: "With 3-2 count and 2 outs, runners move on the pitch. Pitchers must throw a pitch they can execute in the zone or borderline, as a walk forces the tying runner to 3rd.",
    diagram: { ballTarget: "Zone", runnerMoves: [{ from: "b2", to: "b3" }, { from: "b1", to: "b2" }] }
  }
];

export default function App() {
  // App Navigation & Modes
  const [currentScreen, setCurrentScreen] = useState('welcome'); // 'welcome' | 'game' | 'summary'
  const [gameMode, setGameMode] = useState('assessment'); // 'assessment' | 'practice'
  
  // Customization Filters
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  
  // Game Logic States
  const [activeScenarios, setActiveScenarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Scoring & Metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [decisionTimes, setDecisionTimes] = useState([]);
  const [categoryResults, setCategoryResults] = useState({
    "Situational Awareness": { correct: 0, total: 0 },
    "Defensive Positioning": { correct: 0, total: 0 },
    "Baserunning IQ": { correct: 0, total: 0 },
    "Pitch Selection/Count Awareness": { correct: 0, total: 0 }
  });

  // Start / Filter Setup
  const handleStartGame = (mode) => {
    setGameMode(mode);
    
    // Filter scenarios
    let filtered = [...SCENARIO_DATABASE];
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(s => s.level === selectedLevel);
    }
    if (selectedPosition !== 'All') {
      filtered = filtered.filter(s => s.position === selectedPosition);
    }
    
    // Fallback if filters are too strict
    if (filtered.length === 0) {
      filtered = [...SCENARIO_DATABASE];
    }
    
    // Shuffle scenarios
    filtered.sort(() => Math.random() - 0.5);

    setActiveScenarios(filtered);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setDecisionTimes([]);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setCategoryResults({
      "Situational Awareness": { correct: 0, total: 0 },
      "Defensive Positioning": { correct: 0, total: 0 },
      "Baserunning IQ": { correct: 0, total: 0 },
      "Pitch Selection/Count Awareness": { correct: 0, total: 0 }
    });

    setStartTime(Date.now());
    setCurrentScreen('game');
  };

  // Option Click
  const handleSelectOption = (index) => {
    if (hasSubmitted) return;
    setSelectedAnswer(index);
  };

  // Submit Answer & Calculate Stats
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || hasSubmitted) return;

    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(1);
    setDecisionTimes(prev => [...prev, parseFloat(timeTaken)]);

    const currentScenario = activeScenarios[currentIndex];
    const isCorrect = currentScenario.options[selectedAnswer].correct;

    // Track Categories
    let categoryKey = "Situational Awareness";
    if (currentScenario.position.includes("Outfield") || currentScenario.position.includes("Infield")) {
      categoryKey = "Defensive Positioning";
    } else if (currentScenario.position.includes("Base Runner")) {
      categoryKey = "Baserunning IQ";
    } else if (currentScenario.position.includes("Pitcher")) {
      categoryKey = "Pitch Selection/Count Awareness";
    }

    setCategoryResults(prev => ({
      ...prev,
      [categoryKey]: {
        correct: prev[categoryKey].correct + (isCorrect ? 1 : 0),
        total: prev[categoryKey].total + 1
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 100 + (streak * 10));
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    setHasSubmitted(true);
  };

  // Next Scenario or Summary
  const handleNextScenario = () => {
    if (currentIndex + 1 < activeScenarios.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setHasSubmitted(false);
      setStartTime(Date.now());
    } else {
      setCurrentScreen('summary');
    }
  };

  // Current Active Scenario
  const currentScenario = activeScenarios[currentIndex] || SCENARIO_DATABASE[0];

  // Calculate Average Decision Speed
  const avgSpeed = decisionTimes.length 
    ? (decisionTimes.reduce((a, b) => a + b, 0) / decisionTimes.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => setCurrentScreen('welcome')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 group-hover:border-emerald-500/60 transition-all">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-slate-100 via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                BASEBALL IQ
              </h1>
              <p className="text-xs text-slate-400 font-medium">Adaptive Training & Assessment</p>
            </div>
          </div>

          {currentScreen === 'game' && (
            <div className="flex items-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Score:</span>
                <span className="text-amber-400 font-mono">{score}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Streak:</span>
                <span className="text-emerald-400 font-mono">{streak}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- WELCOME / STARTUP SCREEN --- */}
      {currentScreen === 'welcome' && (
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-4 h-4" /> Professional Situational Simulator
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-100">
              Master High-Level On-Field Decisions
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Test your tactical baseball intelligence, positioning, and split-second situational awareness across custom realistic scenarios.
            </p>
          </div>

          {/* Config Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" /> Customize Training Parameters
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Level Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Competition Level / Tier
                </label>
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="All">All Levels</option>
                  <option value="Youth / Little League">Youth / Little League</option>
                  <option value="High School">High School</option>
                  <option value="College / Pro">College / Pro</option>
                </select>
              </div>

              {/* Position Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Primary Position Focus
                </label>
                <select 
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="All">All Field Positions</option>
                  <option value="Pitcher">Pitcher</option>
                  <option value="Infield (1B/2B/SS/3B)">Infield (1B/2B/SS/3B)</option>
                  <option value="Outfield">Outfield</option>
                  <option value="Base Runner / Hitter">Base Runner / Hitter</option>
                </select>
              </div>
            </div>
          </div>

          {/* Game Mode Launch Buttons */}
          <div className="grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => handleStartGame('assessment')}
              className="group relative bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-2xl p-6 text-left shadow-lg shadow-emerald-950/40 border border-emerald-500/30 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300">
                  <Shield className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-1">Full Assessment Mode</h4>
              <p className="text-emerald-100/80 text-sm">
                Complete scenario evaluation across all fundamentals with speed tracking & detailed grading.
              </p>
            </button>

            <button
              onClick={() => handleStartGame('practice')}
              className="group relative bg-slate-900 hover:bg-slate-800/90 text-white rounded-2xl p-6 text-left shadow-lg border border-slate-800 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-slate-800 rounded-xl text-amber-400 border border-slate-700">
                  <BookOpen className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-1">Practice / Scenario Drills</h4>
              <p className="text-slate-400 text-sm">
                Targeted problem-solving with unlimited instant retries and strategic rule breakdowns.
              </p>
            </button>
          </div>
        </main>
      )}

      {/* --- INTERACTIVE GAME SCREEN --- */}
      {currentScreen === 'game' && (
        <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Diamond & Game Context */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Context Scoreboard Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                <span>Scenario {currentIndex + 1} of {activeScenarios.length}</span>
                <span className="text-emerald-400 font-semibold">{currentScenario.level}</span>
              </div>

              {/* Game Situation Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Inning</div>
                  <div className="text-sm font-bold text-slate-200">{currentScenario.inning}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Outs</div>
                  <div className="text-sm font-bold text-slate-200">{currentScenario.outs} Out</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Score</div>
                  <div className="text-sm font-bold text-slate-200">{currentScenario.score}</div>
                </div>
              </div>
            </div>

            {/* SVG Baseball Diamond Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative flex flex-col items-center justify-center">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 self-start flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Diamond Situation Map
              </h4>

              <svg viewBox="0 0 300 300" className="w-full max-w-[260px] h-auto drop-shadow-lg">
                {/* Outfield Grass Arc */}
                <path d="M 30 180 A 130 130 0 0 1 270 180 L 150 260 Z" fill="#064e3b" opacity="0.4" />
                
                {/* Infield Dirt Diamond */}
                <polygon points="150,90 220,160 150,230 80,160" fill="#78350f" opacity="0.6" stroke="#92400e" strokeWidth="2" />
                
                {/* Infield Grass */}
                <polygon points="150,115 195,160 150,205 105,160" fill="#065f46" opacity="0.7" />

                {/* Base Paths */}
                <polyline points="150,230 220,160 150,90 80,160 150,230" fill="none" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />

                {/* Pitcher's Mound */}
                <circle cx="150" cy="160" r="8" fill="#92400e" />
                <rect x="146" y="158" width="8" height="3" fill="#ffffff" />

                {/* Home Plate */}
                <polygon points="150,234 144,228 144,222 156,222 156,228" fill="#ffffff" />

                {/* 1st Base */}
                <rect 
                  x="214" y="154" width="12" height="12" transform="rotate(45 220 160)" 
                  fill={currentScenario.runners.b1 ? "#f59e0b" : "#ffffff"} 
                  className={currentScenario.runners.b1 ? "animate-pulse" : ""}
                />

                {/* 2nd Base */}
                <rect 
                  x="144" y="84" width="12" height="12" transform="rotate(45 150 90)" 
                  fill={currentScenario.runners.b2 ? "#f59e0b" : "#ffffff"} 
                  className={currentScenario.runners.b2 ? "animate-pulse" : ""}
                />

                {/* 3rd Base */}
                <rect 
                  x="74" y="154" width="12" height="12" transform="rotate(45 80 160)" 
                  fill={currentScenario.runners.b3 ? "#f59e0b" : "#ffffff"} 
                  className={currentScenario.runners.b3 ? "animate-pulse" : ""}
                />
              </svg>

              <div className="flex gap-4 text-xs font-semibold text-slate-400 mt-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Active Runner
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white inline-block"></span> Empty Base
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Question & Decisions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Scenario Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Shield className="w-4 h-4" /> Position Focus: {currentScenario.position}
              </div>
              <h3 className="text-2xl font-bold text-slate-100">{currentScenario.title}</h3>
              <p className="text-slate-300 text-base leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                "{currentScenario.question}"
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentScenario.options.map((option, idx) => {
                let borderStyle = "border-slate-800 hover:border-slate-700 bg-slate-900";
                if (selectedAnswer === idx) {
                  borderStyle = "border-emerald-500 bg-emerald-950/20";
                }

                if (hasSubmitted) {
                  if (option.correct) {
                    borderStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-200";
                  } else if (selectedAnswer === idx && !option.correct) {
                    borderStyle = "border-red-500 bg-red-950/40 text-red-200";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasSubmitted}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${borderStyle}`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold
                      ${selectedAnswer === idx ? "border-emerald-400 bg-emerald-500 text-slate-950" : "border-slate-700 text-slate-400"}`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm font-medium leading-normal">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit / Next Action Bar */}
            {!hasSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
              >
                Confirm Tactical Decision <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Feedback Box */}
                <div className={`p-5 rounded-xl border ${
                  currentScenario.options[selectedAnswer].correct 
                    ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200" 
                    : "bg-red-950/30 border-red-500/50 text-red-200"
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-2">
                    {currentScenario.options[selectedAnswer].correct ? (
                      <><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Correct Tactical Decision</>
                    ) : (
                      <><XCircle className="w-5 h-5 text-red-400" /> Tactical Error</>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{currentScenario.explanation}</p>
                </div>

                <button
                  onClick={handleNextScenario}
                  className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Continue to Next Scenario <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </div>
        </main>
      )}

      {/* --- POST-ASSESSMENT SUMMARY REPORT --- */}
      {currentScreen === 'summary' && (
        <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400 mb-2">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100">Assessment Complete</h2>
            <p className="text-slate-400 text-sm">Here is your situational decision breakdown and baseball IQ score.</p>
          </div>

          {/* High Level Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Final Score</div>
              <div className="text-3xl font-black text-amber-400 font-mono">{score}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Best Streak</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">{bestStreak}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Decision Speed</div>
              <div className="text-3xl font-black text-slate-200 font-mono">{avgSpeed}s</div>
            </div>
          </div>

          {/* Categorized Performance Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" /> Fundamental IQ Breakdown
            </h3>

            <div className="space-y-4">
              {Object.entries(categoryResults).map(([catName, data]) => {
                const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <div key={catName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{catName}</span>
                      <span className="text-slate-400">{data.correct}/{data.total} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleStartGame(gameMode)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Retake Assessment
            </button>
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Return to Main Menu
            </button>
          </div>

        </main>
      )}

    </div>
  );
}

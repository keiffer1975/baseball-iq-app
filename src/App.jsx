import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Target, 
  Award, 
  Filter, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  PlusCircle, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  Download, 
  Copy, 
  Check, 
  Shield, 
  User, 
  Zap, 
  BarChart2, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

// --- INITIAL QUESTION BANK (45+ Comprehensive Situational Questions) ---
const INITIAL_QUESTIONS = [
  // CATEGORY: CUTOFFS & RELAYS
  {
    id: 'cr-1',
    category: 'Cutoffs & Relays',
    level: 'High School / Travel',
    positions: ['Outfielders', 'Infielders'],
    title: 'Deep Fly Ball to Right Field Gap with Runner on 1st',
    situation: 'Runner on 1st base, 1 out. Deep hit into the right-center gap. Runner from 1st is rounding 2nd and heading for 3rd.',
    outs: 1,
    runners: { b1: true, b2: false, b3: false },
    ballPosition: { x: 300, y: 70 }, // RF gap
    question: 'Who is the primary cutoff man for the throw coming into 3rd Base?',
    options: [
      { text: 'The Shortstop moves into the left-center outfield grass.', correct: false, explanation: 'The Shortstop goes to 2nd base coverage/double cut position for home, not the primary cut for 3rd.' },
      { text: 'The Shortstop aligns on the line between Right Field and 3rd Base.', correct: true, explanation: 'Correct! On a throw from RF/RC gap to 3rd base, the Shortstop is the cut-off man.' },
      { text: 'The Second Baseman goes out into right field to take the cutoff.', correct: false, explanation: 'The 2nd Baseman trails the play or covers 2nd base depending on double-cut alignment, but SS cuts to 3rd.' },
      { text: 'The Third Baseman leaves the bag to get closer to Right Field.', correct: false, explanation: 'The 3rd Baseman must stay at the bag to receive the throw and make the tag or direct the play.' }
    ]
  },
  {
    id: 'cr-2',
    category: 'Cutoffs & Relays',
    level: 'Youth (9U-12U)',
    positions: ['Outfielders'],
    title: 'Shallow Left Field Fly with Runner on 3rd',
    situation: 'Runner on 3rd base, 1 out. High shallow fly ball to Left Field. LF catches it 30 feet behind Shortstop.',
    outs: 1,
    runners: { b1: false, b2: false, b3: true },
    ballPosition: { x: 100, y: 170 }, // Shallow LF
    question: 'What should the Left Fielder do immediately upon catching the ball?',
    options: [
      { text: 'Throw as hard as possible directly to the Catcher on one hop.', correct: true, explanation: 'Correct! In shallow LF, throw directly to Home Plate on a low, printable line with 1 hop max.' },
      { text: 'Hit the Shortstop as a cutoff man.', correct: false, explanation: 'The ball is too shallow for a cutoff man; adding a cutoff wastes precious time when stopping a runner tagging from 3rd.' },
      { text: 'Hold the ball and run it into the infield.', correct: false, explanation: 'Holding the ball allows the runner on 3rd to tag and score easily.' },
      { text: 'Throw to 3rd base to force the runner back.', correct: false, explanation: 'The runner will be advancing home, not staying at 3rd.' }
    ]
  },
  {
    id: 'cr-3',
    category: 'Cutoffs & Relays',
    level: 'College / Pro',
    positions: ['Infielders', 'Catcher'],
    title: 'Extra Base Hit Down Left Field Line with Runner on 1st',
    situation: 'Runner on 1st base, 0 outs. Ball hit off the wall down the LF line. Runner is rounding 3rd base attempting to score.',
    outs: 0,
    runners: { b1: true, b2: false, b3: false },
    ballPosition: { x: 40, y: 60 }, // LF corner
    question: 'How should the double-cut relay be positioned for the throw to Home Plate?',
    options: [
      { text: 'Shortstop is lead cut, 3B is trailing cut, aligned from LF corner to Home Plate.', correct: false, explanation: '3rd Baseman stays at 3rd base for potential runner callbacks.' },
      { text: 'Shortstop is lead cut, 2nd Baseman is trailing cut (15-20ft behind SS), aligned from LF corner to Home.', correct: true, explanation: 'Correct! SS is lead relay, 2B trails in tandem alignment toward Home.' },
      { text: '1st Baseman comes all the way across to act as lead cutoff.', correct: false, explanation: '1st Baseman covers 2nd/3rd trailer responsibilities or stays near 1st/2nd.' },
      { text: 'Pitcher takes the cutoff throw directly on the edge of the mound.', correct: false, explanation: 'Pitcher backs up Home Plate behind the catcher, NOT the cutoff man.' }
    ]
  },
  {
    id: 'cr-4',
    category: 'Cutoffs & Relays',
    level: 'High School / Travel',
    positions: ['Pitcher', 'Infielders'],
    title: 'Single to Center Field, Runner on 2nd',
    situation: 'Runner on 2nd, 2 outs. Ground single straight up the middle into Center Field.',
    outs: 2,
    runners: { b1: false, b2: true, b3: false },
    ballPosition: { x: 200, y: 120 }, // Center field
    question: 'Who is the cutoff man for the throw to Home Plate, and where do they align?',
    options: [
      { text: 'Shortstop aligns between CF and Home Plate near the mound.', correct: false, explanation: 'The 1st Baseman is the cutoff for throws from CF/RF to home plate!' },
      { text: '1st Baseman cuts off, aligning between Center Field and Home Plate around the mound.', correct: true, explanation: 'Correct! 1st Baseman is the cutoff for CF & RF throws to Home. 3B covers 3rd, SS covers 2nd.' },
      { text: '3rd Baseman cuts off midway down the baseline.', correct: false, explanation: '3rd Baseman must stay at 3rd to receive potential plays on the hitter or runner.' },
      { text: 'Pitcher cuts the ball at the front of the mound.', correct: false, explanation: 'Pitcher must back up Home Plate.' }
    ]
  },

  // CATEGORY: BASE RUNNING
  {
    id: 'br-1',
    category: 'Base Running',
    level: 'Youth (9U-12U)',
    positions: ['Base Runner'],
    title: 'Fly Ball to Right Field with Runner on 2nd',
    situation: 'Runner on 2nd base, 0 outs. Fly ball hit medium deep to Right Field.',
    outs: 0,
    runners: { b1: false, b2: true, b3: false },
    ballPosition: { x: 330, y: 110 },
    question: 'What is the correct base running strategy for the runner on 2nd?',
    options: [
      { text: 'Immediately tag up on 2nd base and wait for the catch to attempt advancing to 3rd.', correct: true, explanation: 'Correct! On a ball hit to RF with 0 outs, tagging allows you to easily take 3rd on the catch because of the long throw across the field.' },
      { text: 'Take a halfway secondary lead and wait to see if it drops.', correct: false, explanation: 'If caught, taking a halfway lead prevents you from advancing to 3rd.' },
      { text: 'Run immediately to 3rd base as fast as possible without waiting.', correct: false, explanation: 'If caught, you will be doubled off 2nd base.' },
      { text: 'Stay standing directly on 2nd base without watching the play.', correct: false, explanation: 'You must get ready to sprint as soon as the ball touches the glove.' }
    ]
  },
  {
    id: 'br-2',
    category: 'Base Running',
    level: 'College / Pro',
    positions: ['Base Runner'],
    title: 'Contact Play with Runner on 3rd Base',
    situation: 'Runner on 3rd base, 1 out, infield playing in. "Contact Play" is signaled by the coach.',
    outs: 1,
    runners: { b1: false, b2: false, b3: true },
    ballPosition: { x: 180, y: 220 }, // Pitcher/Infield area
    question: 'What does the "Contact Play" require the runner on 3rd to do?',
    options: [
      { text: 'Break for Home immediately on any ground ball contact, regardless of direction.', correct: true, explanation: 'Correct! On a contact play, the runner breaks on the sound of the bat. It puts pressure on the defense to make a clean field and tag.' },
      { text: 'Wait until the ground ball passes the pitcher before running.', correct: false, explanation: 'That is a read play, not a pure contact play.' },
      { text: 'Freeze on line drives and only run on high pop-ups.', correct: false, explanation: 'You freeze on line drives, but you break on grounders.' },
      { text: 'Run only if the ball is hit to the right side of the infield.', correct: false, explanation: 'A contact play means breaking on *any* ground ball.' }
    ]
  },
  {
    id: 'br-3',
    category: 'Base Running',
    level: 'High School / Travel',
    positions: ['Base Runner'],
    title: 'Dirt Ball Read at 2nd Base',
    situation: 'Runner on 2nd base, 1 out, count is 2-1. Pitch breaks into the dirt and slips past the catcher by 12 feet.',
    outs: 1,
    runners: { b1: false, b2: true, b3: false },
    ballPosition: { x: 200, y: 310 }, // Catcher behind home
    question: 'When should the runner on 2nd commit to stealing 3rd base on a dirt ball?',
    options: [
      { text: 'As soon as the runner sees the ball trajectory heading down into the dirt before it hits the ground.', correct: true, explanation: 'Correct! The best runners read the downward angle of the pitch before it bounces.' },
      { text: 'Wait until the ball completely stops rolling.', correct: false, explanation: 'By then the catcher will have recovered and thrown you out.' },
      { text: 'Wait for the 3rd base coach to yell "GO!".', correct: false, explanation: 'By the time you hear the coach, it is too late. Dirt ball reads are automated individual reads.' },
      { text: 'Only run if the catcher turns their back completely.', correct: false, explanation: 'You miss obvious opportunities if you wait for the catcher to turn around.' }
    ]
  },
  {
    id: 'br-4',
    category: 'Base Running',
    level: 'Youth (9U-12U)',
    positions: ['Base Runner'],
    title: '2 Outs Base Running Rule',
    situation: 'Runners on 1st and 2nd base, 2 outs. 3-2 count on the batter. Ball hit high in the air to SS.',
    outs: 2,
    runners: { b1: true, b2: true, b3: false },
    ballPosition: { x: 140, y: 180 },
    question: 'What should all base runners do when the pitch is released with 2 outs and a full count?',
    options: [
      { text: 'Run as fast as possible on the pitch movement.', correct: true, explanation: 'Correct! With 2 outs and full count (runners forced), runners go on the pitch because if caught the inning ends, and if dropped/hit they gain maximum distance.' },
      { text: 'Freeze to make sure the ball is caught or dropped.', correct: false, explanation: 'With 2 outs, you never freeze on a fly ball!' },
      { text: 'Tag up at the base until the ball is touched.', correct: false, explanation: 'Tagging up with 2 outs is unnecessary.' },
      { text: 'Return to their respective bases immediately.', correct: false, explanation: 'Never return to base on a live ball with 2 outs.' }
    ]
  },

  // CATEGORY: DEFENSIVE ROTATIONS & COVERAGE
  {
    id: 'dr-1',
    category: 'Defensive Rotations',
    level: 'High School / Travel',
    positions: ['Infielders', 'Pitcher'],
    title: 'Bunt Defense: Sacrifice Bunt with Runners on 1st & 2nd',
    situation: 'Runners on 1st and 2nd, 0 outs. Batter shows bunt clearly before pitch.',
    outs: 0,
    runners: { b1: true, b2: true, b3: false },
    ballPosition: { x: 170, y: 250 },
    question: 'Who is responsible for covering 3rd base to force out the lead runner?',
    options: [
      { text: '3rd Baseman fields the bunt, Pitcher covers 3rd.', correct: false, explanation: 'If 3B fields bunt, 3rd base is wide open and runner advances easily.' },
      { text: '3rd Baseman holds ground/covers 3rd Base while Pitcher and 1st Baseman charge to field the bunt.', correct: true, explanation: 'Correct! 3B stays home to force out the lead runner at 3rd. SS covers 2nd, 2B covers 1st.' },
      { text: 'Shortstop runs across the infield to cover 3rd Base.', correct: false, explanation: 'SS must cover 2nd base on this rotation.' },
      { text: 'Left Fielder sprints in to cover 3rd Base.', correct: false, explanation: 'LF backs up 3rd, doesn\'t take the primary coverage.' }
    ]
  },
  {
    id: 'dr-2',
    category: 'Defensive Rotations',
    level: 'College / Pro',
    positions: ['Infielders'],
    title: 'First and Third Defense: Early Break / Steal',
    situation: 'Runners on 1st and 3rd, 1 out. Runner on 1st breaks early for 2nd base before the pitcher delivers.',
    outs: 1,
    runners: { b1: true, b2: false, b3: true },
    ballPosition: { x: 200, y: 240 },
    question: 'What is the standard infield execution to prevent the runner on 3rd from scoring?',
    options: [
      { text: 'Pitcher steps off rubber, engages runner on 1st, 2B cuts throw to home if 3B runner breaks.', correct: true, explanation: 'Correct! Step off cleanly, turn to runner on 1st. Arm up, ready to pivot and throw home if R3 breaks.' },
      { text: 'Pitcher must throw immediately to 2nd base to get the out.', correct: false, explanation: 'A direct throw to 2nd allows R3 to sprint home freely.' },
      { text: 'Pitcher throws to 3rd base to force the runner back.', correct: false, explanation: 'Throwing to 3rd lets R1 steal 2nd without resistance.' },
      { text: 'Catcher runs out onto the mound to take the ball.', correct: false, explanation: 'The pitcher is already holding the ball.' }
    ]
  },
  {
    id: 'dr-3',
    category: 'Defensive Rotations',
    level: 'Youth (9U-12U)',
    positions: ['Infielders'],
    title: 'Infield Fly Rule Conditions',
    situation: 'Runners on 1st and 2nd, 1 out. High pop fly to Shortstop in shallow infield.',
    outs: 1,
    runners: { b1: true, b2: true, b3: false },
    ballPosition: { x: 150, y: 160 },
    question: 'Does the Infield Fly Rule apply here, and what happens to the batter?',
    options: [
      { text: 'Yes, Infield Fly is called; Batter is automatically out, runners advance at own risk.', correct: true, explanation: 'Correct! Applies with <2 outs and runners on 1st & 2nd or 1st, 2nd, & 3rd. Batter is out.' },
      { text: 'No, because the ball is too high.', correct: false, explanation: 'Height does not negate Infield Fly.' },
      { text: 'Yes, and all runners must automatically run to the next base.', correct: false, explanation: 'Runners are NOT forced to run because the batter is out.' },
      { text: 'No, Infield Fly only applies when bases are loaded.', correct: false, explanation: 'It applies to 1st & 2nd OR bases loaded.' }
    ]
  },

  // CATEGORY: BATTERY & BACKUPS
  {
    id: 'bb-1',
    category: 'Battery & Backups',
    level: 'High School / Travel',
    positions: ['Pitcher'],
    title: 'Pitcher Backup on Play at Home from Right Field',
    situation: 'Runner on 2nd base, single hit to Right Field. RF fields ball and fires to Home Plate.',
    outs: 1,
    runners: { b1: false, b2: true, b3: false },
    ballPosition: { x: 310, y: 150 },
    question: 'Where should the Pitcher position themselves to back up the throw?',
    options: [
      { text: 'Directly behind Home Plate, aligned with RF and Home, 30-45 feet back against the backstop.', correct: true, explanation: 'Correct! Pitcher must sprint deep behind home plate in direct line with the incoming throw.' },
      { text: 'Stand on the pitcher\'s mound and watch the play.', correct: false, explanation: 'Lazy pitching! Never spectate on the mound.' },
      { text: 'Stand right next to the Catcher to assist with the tag.', correct: false, explanation: 'You will interfere with the catcher and fail to stop wild throws.' },
      { text: 'Back up 3rd base in case the runner stops.', correct: false, explanation: 'The active play is at home, so backup home first.' }
    ]
  },
  {
    id: 'bb-2',
    category: 'Battery & Backups',
    level: 'College / Pro',
    positions: ['Catcher'],
    title: 'Passed Ball / Wild Pitch with Runner on 3rd',
    situation: 'Runner on 3rd, ball gets past Catcher to the backstop brick wall.',
    outs: 1,
    runners: { b1: false, b2: false, b3: true },
    ballPosition: { x: 200, y: 325 },
    question: 'What is the correct technical sequence for the Catcher recovering the ball?',
    options: [
      { text: 'Slide to ball, turn towards field, slide/pounce, toss underhand with thumb down to Pitcher covering plate.', correct: true, explanation: 'Correct! Sprint, slide/secure, quick firm underhand feed to pitcher who is sliding to tag front of plate.' },
      { text: 'Pick up ball and throw overhand as hard as possible to pitcher.', correct: false, explanation: 'Overhand throw from 15 feet causes wild overthrows.' },
      { text: 'Turn around, point at the pitcher, and let pitcher pick up ball.', correct: false, explanation: 'Pitcher runs to plate, catcher gets ball.' },
      { text: 'Run back and tag runner yourself at home plate.', correct: false, explanation: 'Runner will beat you to the plate before you return.' }
    ]
  },

  // CATEGORY: RULES & TACTICS
  {
    id: 'rt-1',
    category: 'Rules & Tactics',
    level: 'High School / Travel',
    positions: ['Base Runner', 'Infielders'],
    title: 'Dropped 3rd Strike Scenario',
    situation: '2 outs, Runner on 1st Base. Pitcher strikes out batter, but Catcher drops the ball.',
    outs: 2,
    runners: { b1: true, b2: false, b3: false },
    ballPosition: { x: 190, y: 290 },
    question: 'Is the Batter allowed to run to 1st Base?',
    options: [
      { text: 'Yes, because there are 2 outs!', correct: true, explanation: 'Correct! On dropped 3rd strike, if 1st base is occupied with LESS than 2 outs, batter is out. But with 2 OUTS, batter CAN run even if 1st is occupied.' },
      { text: 'No, because 1st base is occupied.', correct: false, explanation: 'Occupied 1st base rule only prevents running when there are LESS than 2 outs.' },
      { text: 'Yes, but the runner on 1st is automatically out.', correct: false, explanation: 'Runner on 1st is forced to advance to 2nd base.' },
      { text: 'No, dropped 3rd strike is never allowed in high school.', correct: false, explanation: 'It is standard high school/college/pro baseball rule.' }
    ]
  },
  {
    id: 'rt-2',
    category: 'Rules & Tactics',
    level: 'College / Pro',
    positions: ['Infielders', 'Outfielders'],
    title: 'Obstruction vs Interference',
    situation: 'Runner rounding 2nd base collides with Shortstop who does NOT have the ball and is NOT fielding the ball.',
    outs: 1,
    runners: { b1: true, b2: false, b3: false },
    ballPosition: { x: 300, y: 120 },
    question: 'What is the correct ruling by the umpire?',
    options: [
      { text: 'Obstruction on the fielder; runner is awarded the base they would have reached.', correct: true, explanation: 'Correct! Obstruction is defensive misconduct (blocking runner without ball). Interference is offensive.' },
      { text: 'Interference on the runner; runner is called out immediately.', correct: false, explanation: 'Runner only gets called for interference if impeding a fielder actively making a play.' },
      { text: 'Play continues with no penalty for either side.', correct: false, explanation: 'Fielder without ball cannot impede runner path.' },
      { text: 'Batter is called out and all runners return.', correct: false, explanation: 'Batter is not involved in this collision.' }
    ]
  }
];

// POSITIONS & CATEGORIES FOR FILTERING
const POSITIONS_LIST = ['All Positions', 'Catcher', 'Pitcher', 'Infielders', 'Outfielders', 'Base Runner'];
const CATEGORIES_LIST = ['All Categories', 'Cutoffs & Relays', 'Base Running', 'Defensive Rotations', 'Battery & Backups', 'Rules & Tactics'];
const LEVELS_LIST = ['All Levels', 'Youth (9U-12U)', 'High School / Travel', 'College / Pro'];

export default function App() {
  // State
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz', 'builder', 'bank'
  
  // Filter state
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  // Quiz execution state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: { chosenIndex, isCorrect } }
  const [quizFinished, setQuizFinished] = useState(false);

  // Question Builder Form State
  const [builderData, setBuilderData] = useState({
    title: '',
    category: 'Cutoffs & Relays',
    level: 'High School / Travel',
    positions: ['Infielders'],
    situation: '',
    outs: 0,
    runners: { b1: false, b2: false, b3: false },
    ballPosition: { x: 200, y: 150 },
    questionText: '',
    options: [
      { text: '', correct: true, explanation: '' },
      { text: '', correct: false, explanation: '' },
      { text: '', correct: false, explanation: '' },
      { text: '', correct: false, explanation: '' }
    ]
  });
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const posMatch = selectedPosition === 'All Positions' || q.positions.includes(selectedPosition);
      const catMatch = selectedCategory === 'All Categories' || q.category === selectedCategory;
      const levMatch = selectedLevel === 'All Levels' || q.level === selectedLevel;
      return posMatch && catMatch && levMatch;
    });
  }, [questions, selectedPosition, selectedCategory, selectedLevel]);

  const currentQ = filteredQuestions[currentIndex] || null;

  // Answer handler
  const handleSelectOption = (index) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || !currentQ) return;
    const isCorrect = currentQ.options[selectedOptionIndex].correct;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        chosenIndex: selectedOptionIndex,
        isCorrect: isCorrect,
        category: currentQ.category
      }
    }));
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  // Score Calculations
  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const scorePercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  // IQ Grade Calculator
  const getIQRating = (score) => {
    if (score >= 95) return { rank: 'MLB Veteran / Elite Coach', iq: '145+', color: 'text-amber-400' };
    if (score >= 85) return { rank: 'College Starter / High IQ', iq: '130-144', color: 'text-emerald-400' };
    if (score >= 70) return { rank: 'Varsity / Travel Prospect', iq: '115-129', color: 'text-blue-400' };
    if (score >= 50) return { rank: 'Developing Player', iq: '95-114', color: 'text-yellow-400' };
    return { rank: 'Rookie / Needs Fundamentals', iq: '<95', color: 'text-red-400' };
  };

  // Category Weakness Breakdown
  const categoryStats = useMemo(() => {
    const stats = {};
    Object.values(userAnswers).forEach(ans => {
      if (!stats[ans.category]) {
        stats[ans.category] = { total: 0, correct: 0 };
      }
      stats[ans.category].total += 1;
      if (ans.isCorrect) stats[ans.category].correct += 1;
    });
    return stats;
  }, [userAnswers]);

  // Add Question from Builder
  const handleSaveCustomQuestion = () => {
    if (!builderData.title || !builderData.questionText || !builderData.options[0].text) {
      alert('Please fill out the title, question text, and at least option choice!');
      return;
    }
    const newQ = {
      id: `custom-${Date.now()}`,
      category: builderData.category,
      level: builderData.level,
      positions: builderData.positions,
      title: builderData.title,
      situation: builderData.situation,
      outs: parseInt(builderData.outs),
      runners: { ...builderData.runners },
      ballPosition: { ...builderData.ballPosition },
      question: builderData.questionText,
      options: [...builderData.options]
    };

    setQuestions(prev => [newQ, ...prev]);
    alert('Custom Question successfully created & added to the active question pool!');
    setActiveTab('quiz');
  };

  const copyJSONToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(builderData, null, 2));
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/40">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                BASEBALL IQ
              </h1>
              <p className="text-xs text-slate-400">Tactics, Situations & Execution Assessment</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'quiz' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-4 h-4" /> Assessment Mode
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'builder' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Question Builder
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'bank' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Bank ({questions.length})
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* TAB 1: QUIZ / ASSESSMENT MODE */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* FILTER BAR */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Filter className="w-4 h-4 text-emerald-400" /> Filters:
              </div>
              <div className="flex flex-wrap gap-3 flex-1">
                <select
                  value={selectedPosition}
                  onChange={(e) => { setSelectedPosition(e.target.value); setCurrentIndex(0); }}
                  className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {POSITIONS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentIndex(0); }}
                  className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => { setSelectedLevel(e.target.value); setCurrentIndex(0); }}
                  className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {LEVELS_LIST.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <button
                onClick={handleResetQuiz}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Score
              </button>
            </div>

            {/* RESULTS REPORT CARD (IF FINISHED) */}
            {quizFinished ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto text-center space-y-6">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
                <h2 className="text-3xl font-extrabold text-white">Assessment Complete!</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Score</p>
                    <p className="text-3xl font-bold text-white mt-1">{scorePercentage}%</p>
                    <p className="text-xs text-slate-400 mt-1">{correctCount} / {totalAnswered} Correct</p>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Baseball IQ Rating</p>
                    <p className={`text-xl font-bold mt-1 ${getIQRating(scorePercentage).color}`}>
                      {getIQRating(scorePercentage).rank}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">IQ Index: {getIQRating(scorePercentage).iq}</p>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Tactical Mastery</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">
                      {scorePercentage >= 80 ? 'Elite' : scorePercentage >= 60 ? 'Solid' : 'Developing'}
                    </p>
                  </div>
                </div>

                {/* CATEGORY BREAKDOWN */}
                <div className="bg-slate-800/50 rounded-xl p-6 text-left border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-400" /> Category Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(categoryStats).map(([cat, stat]) => {
                      const pct = Math.round((stat.correct / stat.total) * 100);
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>{cat}</span>
                            <span>{stat.correct}/{stat.total} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/30"
                >
                  Retake Assessment
                </button>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-slate-200">No questions found matching selected filters.</p>
                <p className="text-sm text-slate-500 mt-1">Try resetting the filters or selecting "All Positions".</p>
              </div>
            ) : (
              /* ACTIVE QUESTION VIEW */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT/TOP: FIELD DIAGRAM & SITUATION */}
                <div className="lg:col-span-5 space-y-4">
                  {/* DIAGRAM CARD */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden shadow-xl">
                    <div className="w-full flex justify-between items-center mb-2 px-2 text-xs font-semibold text-slate-400">
                      <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">{currentQ.level}</span>
                      <span className="text-emerald-400">{currentQ.category}</span>
                    </div>

                    {/* SVG FIELD CANVAS */}
                    <div className="w-full max-w-[360px] aspect-square relative bg-emerald-950/40 rounded-xl border border-emerald-900/50 p-2 overflow-hidden">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Outfield Grass Arc */}
                        <path d="M 40 300 A 240 240 0 0 1 360 300 L 200 360 Z" fill="#064e3b" stroke="#047857" strokeWidth="2" />
                        
                        {/* Infield Dirt Diamond */}
                        <polygon points="200,340 100,240 200,140 300,240" fill="#78350f" stroke="#92400e" strokeWidth="3" />
                        <polygon points="200,330 110,240 200,150 290,240" fill="#047857" />

                        {/* Foul Lines */}
                        <line x1="200" y1="340" x2="20" y2="160" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4" />
                        <line x1="200" y1="340" x2="380" y2="160" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4" />

                        {/* Pitcher's Mound */}
                        <circle cx="200" cy="240" r="14" fill="#78350f" />
                        <rect x="194" y="238" width="12" height="4" fill="#f8fafc" />

                        {/* BASES */}
                        {/* Home Plate */}
                        <polygon points="200,342 193,335 193,330 207,330 207,335" fill="#ffffff" />
                        
                        {/* 1st Base */}
                        <polygon points="290,240 300,240 295,235 285,235" 
                                 fill={currentQ.runners.b1 ? '#f59e0b' : '#ffffff'} 
                                 className={currentQ.runners.b1 ? 'animate-pulse' : ''} />
                        
                        {/* 2nd Base */}
                        <polygon points="200,150 205,145 200,140 195,145" 
                                 fill={currentQ.runners.b2 ? '#f59e0b' : '#ffffff'} 
                                 className={currentQ.runners.b2 ? 'animate-pulse' : ''} />
                        
                        {/* 3rd Base */}
                        <polygon points="110,240 115,235 105,235 100,240" 
                                 fill={currentQ.runners.b3 ? '#f59e0b' : '#ffffff'} 
                                 className={currentQ.runners.b3 ? 'animate-pulse' : ''} />

                        {/* BALL / PLAY TRAJECTORY LOCATION */}
                        {currentQ.ballPosition && (
                          <g>
                            <line x1="200" y1="330" x2={currentQ.ballPosition.x} y2={currentQ.ballPosition.y} 
                                  stroke="#eab308" strokeWidth="2" strokeDasharray="3,3" />
                            <circle cx={currentQ.ballPosition.x} cy={currentQ.ballPosition.y} r="8" fill="#ef4444" className="animate-ping opacity-75" />
                            <circle cx={currentQ.ballPosition.x} cy={currentQ.ballPosition.y} r="6" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* SITUATION BRIEFING */}
                    <div className="w-full mt-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
                        <span>OUTS: <strong className="text-emerald-400">{currentQ.outs}</strong></span>
                        <span>RUNNERS: <strong className="text-amber-400">
                          {[currentQ.runners.b1 && '1st', currentQ.runners.b2 && '2nd', currentQ.runners.b3 && '3rd'].filter(Boolean).join(', ') || 'None'}
                        </strong></span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{currentQ.situation}</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT/BOTTOM: QUESTION & OPTIONS */}
                <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div>
                    {/* PROGRESS & HEADING */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                        Question {currentIndex + 1} of {filteredQuestions.length}
                      </span>
                      <div className="flex gap-1">
                        {currentQ.positions.map(p => (
                          <span key={p} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{currentQ.title}</h3>
                    <p className="text-base font-medium text-emerald-300 mb-6">{currentQ.question}</p>

                    {/* MULTIPLE CHOICE OPTIONS */}
                    <div className="space-y-3">
                      {currentQ.options.map((opt, idx) => {
                        let btnStyle = "border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-200";
                        if (selectedOptionIndex === idx) {
                          btnStyle = "border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-500";
                        }
                        if (isSubmitted) {
                          if (opt.correct) {
                            btnStyle = "border-emerald-500 bg-emerald-900/40 text-emerald-200 font-semibold";
                          } else if (selectedOptionIndex === idx) {
                            btnStyle = "border-red-500 bg-red-950/40 text-red-200";
                          } else {
                            btnStyle = "border-slate-800 bg-slate-900/30 text-slate-500 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 text-sm leading-relaxed ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{opt.text}</span>
                            {isSubmitted && opt.correct && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                            {isSubmitted && !opt.correct && selectedOptionIndex === idx && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* IMMEDIATE FEEDBACK / EXPLANATION */}
                    {isSubmitted && (
                      <div className="mt-6 p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-sm space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 font-bold text-slate-200">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <span>Coaching Breakdown:</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {currentQ.options[selectedOptionIndex].explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="text-xs text-slate-400">
                      Current Score: <span className="font-bold text-emerald-400">{correctCount}</span> / {totalAnswered}
                    </div>

                    {!isSubmitted ? (
                      <button
                        disabled={selectedOptionIndex === null}
                        onClick={handleSubmitAnswer}
                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          selectedOptionIndex !== null
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/40"
                      >
                        {currentIndex < filteredQuestions.length - 1 ? 'Next Question' : 'View Final IQ Results'} <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOM QUESTION BUILDER */}
        {activeTab === 'builder' && (
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" /> Tactical Question Generator
              </h2>
              <p className="text-xs text-slate-400 mt-1">Design custom baseball scenarios to test your team or export JSON into the app.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Scenario Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cutoff Alignment on Line Drive to LF"
                  value={builderData.title}
                  onChange={(e) => setBuilderData({ ...builderData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={builderData.category}
                  onChange={(e) => setBuilderData({ ...builderData, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES_LIST.filter(c => c !== 'All Categories').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Skill Level</label>
                <select
                  value={builderData.level}
                  onChange={(e) => setBuilderData({ ...builderData, level: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {LEVELS_LIST.filter(l => l !== 'All Levels').map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Outs</label>
                <select
                  value={builderData.outs}
                  onChange={(e) => setBuilderData({ ...builderData, outs: parseInt(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={0}>0 Outs</option>
                  <option value={1}>1 Out</option>
                  <option value={2}>2 Outs</option>
                </select>
              </div>
            </div>

            {/* BASE RUNNERS CONFIG */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Base Runners On</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderData.runners.b1}
                    onChange={(e) => setBuilderData({ ...builderData, runners: { ...builderData.runners, b1: e.target.checked } })}
                    className="rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  1st Base
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderData.runners.b2}
                    onChange={(e) => setBuilderData({ ...builderData, runners: { ...builderData.runners, b2: e.target.checked } })}
                    className="rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  2nd Base
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderData.runners.b3}
                    onChange={(e) => setBuilderData({ ...builderData, runners: { ...builderData.runners, b3: e.target.checked } })}
                    className="rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  3rd Base
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Situation Description</label>
              <textarea
                rows={2}
                placeholder="Describe the play (e.g. Full count, line hit into right field corner)..."
                value={builderData.situation}
                onChange={(e) => setBuilderData({ ...builderData, situation: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Question Prompt</label>
              <input
                type="text"
                placeholder="e.g. What is the primary duty of the 2nd Baseman on this throw?"
                value={builderData.questionText}
                onChange={(e) => setBuilderData({ ...builderData, questionText: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* OPTIONS BUILDER */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Answer Options (Select Correct Answer)</label>
              {builderData.options.map((opt, idx) => (
                <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.correct}
                      onChange={() => {
                        const newOpts = builderData.options.map((o, i) => ({ ...o, correct: i === idx }));
                        setBuilderData({ ...builderData, options: newOpts });
                      }}
                      className="text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...builderData.options];
                        newOpts[idx].text = e.target.value;
                        setBuilderData({ ...builderData, options: newOpts });
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-100 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Explanation for why this is correct/incorrect..."
                    value={opt.explanation}
                    onChange={(e) => {
                      const newOpts = [...builderData.options];
                      newOpts[idx].explanation = e.target.value;
                      setBuilderData({ ...builderData, options: newOpts });
                    }}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-md p-2 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={handleSaveCustomQuestion}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/40"
              >
                Add Question to Assessment Bank
              </button>
              <button
                onClick={copyJSONToClipboard}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
              >
                {copiedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedSuccess ? 'Copied JSON!' : 'Copy JSON'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: QUESTION BANK OVERVIEW */}
        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Active Question Library</h2>
                <p className="text-xs text-slate-400">Total {questions.length} tactical scenarios in memory.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q, i) => (
                <div key={q.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">{q.category}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{q.level}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{i + 1}. {q.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{q.situation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

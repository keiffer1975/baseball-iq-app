import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Brain, 
  Target, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ChevronRight,
  TrendingUp,
  Activity,
  Compass
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

// --- QUESTION BANK ---
const QUESTION_BANK = [
  // TIER 1: FUNDAMENTALS (Rating ~500-625)
  {
    id: 'q1',
    tier: 1,
    category: 'Base Running',
    question: 'Runner on 1st base, less than 2 outs. High fly ball deep to right field. What should the runner on 1st do?',
    options: [
      'Sprint immediately to 2nd base and round toward 3rd.',
      'Halfway down the baseline to read if the ball is caught or dropped.',
      'Tag up on 1st base and stay put no matter what.',
      'Retreat behind 1st base in foul territory.'
    ],
    correctAnswer: 1,
    explanation: 'On a deep fly ball with less than 2 outs, a runner on 1st should go roughly halfway to advance if it drops, but still be able to return safely if caught.',
    runners: [1, 0, 0],
    outs: 1,
    hitVector: 'RF-Deep'
  },
  {
    id: 'q2',
    tier: 1,
    category: 'Fielding & Cutoffs',
    question: 'No runners on, clean single to left field. Who is the primary cutoff man for the left fielder returning the ball to 2nd base?',
    options: [
      'First Baseman',
      'Shortstop',
      'Second Baseman',
      'Pitcher'
    ],
    correctAnswer: 1,
    explanation: 'On a hit to left field, the shortstop moves out to line up the cutoff to 2nd base, while the 2nd baseman covers the bag.',
    runners: [0, 0, 0],
    outs: 0,
    hitVector: 'LF-Single'
  },
  {
    id: 'q3',
    tier: 1,
    category: 'Rules & Situations',
    question: 'Bases loaded, 1 out. Ground ball straight to 3rd base. The 3rd baseman steps on 3rd base. Is the runner coming from 2nd out?',
    options: [
      'Yes, automatically via force out.',
      'No, the runner must be tagged.',
      'Yes, but only if the catcher tagged home first.',
      'No, stepping on 3rd puts the runner coming from 3rd base out.'
    ],
    correctAnswer: 3,
    explanation: 'Stepping on 3rd base forces out the runner coming from 2nd base. To get the runner coming from 3rd, the 3rd baseman would have had to throw home (or tag that runner).',
    runners: [1, 1, 1],
    outs: 1,
    hitVector: '3B-Grounder'
  },

  // TIER 2: INTERMEDIATE (Rating ~625-750)
  {
    id: 'q4',
    tier: 2,
    category: 'Base Running',
    question: 'Runner on 2nd base, 0 outs. Sharp ground ball hit to the short-stop (directly in front of runner). What should the runner do?',
    options: [
      'Freeze / Stay at 2nd until the throw is made to 1st base.',
      'Sprint aggressively to 3rd base immediately on contact.',
      'Attempt to draw a throw by taking a huge secondary lead.',
      'Run behind the shortstop in outfield grass.'
    ],
    correctAnswer: 0,
    explanation: 'With 0 outs and a hit in front of the runner (at SS or 3B), freeze! Forcing a throw to 3rd leads to an easy out. Advance only on balls hit to the right side.',
    runners: [0, 1, 0],
    outs: 0,
    hitVector: 'SS-Grounder'
  },
  {
    id: 'q5',
    tier: 2,
    category: 'Fielding & Cutoffs',
    question: 'Runner on 1st base. Extra-base hit deep into the right-center field gap. Who is the trailer cutoff man setting up the double-cutoff line?',
    options: [
      '2nd Baseman is lead cutoff; Shortstop is trailer cutoff.',
      'Shortstop is lead cutoff; 3rd Baseman is trailer cutoff.',
      '1st Baseman is lead cutoff; 2nd Baseman is trailer cutoff.',
      'Pitcher is trailer cutoff behind 2nd base.'
    ],
    correctAnswer: 0,
    explanation: 'On hits to the right-center gap, the 2nd baseman goes out as the lead relay, and the shortstop follows out to align as the trailer relay.',
    runners: [1, 0, 0],
    outs: 0,
    hitVector: 'RCF-Gap'
  },
  {
    id: 'q6',
    tier: 2,
    category: 'Strategy & Pitching',
    question: 'Runner on 3rd, 1 out, bottom 7th in a tied game. Infield is playing IN. Hard grounder directly at 2nd baseman. What is the proper play?',
    options: [
      'Throw to 1st base for the sure out.',
      'Look the runner back, then throw to 1st base.',
      'Throw directly home to tag/force the runner scoring.',
      'Hold the ball and tag the runner coming from 2nd.'
    ],
    correctAnswer: 2,
    explanation: 'With the infield playing in during a tie game late, the priority is preventing the winning run from scoring. Fire home immediately.',
    runners: [0, 0, 1],
    outs: 1,
    hitVector: '2B-Hard'
  },

  // TIER 3: ADVANCED (Rating ~750-875)
  {
    id: 'q7',
    tier: 3,
    category: 'Rules & Situations',
    question: 'Runners on 1st & 2nd, 1 out. Batter hits a pop fly near 2nd base. Infield Fly Rule is called. The ball drops uncaught in the dirt. Can runners advance?',
    options: [
      'No, the ball is dead instantly.',
      'Yes, but they MUST advance because it is still a force play.',
      'Yes, at their own risk, and force plays are REMOVED.',
      'No, the batter and lead runner are both automatically out.'
    ],
    correctAnswer: 2,
    explanation: 'Under the Infield Fly Rule, the batter is out automatically, but the ball remains live. Runners may advance at their own risk without force pressure.',
    runners: [1, 1, 0],
    outs: 1,
    hitVector: 'Infield-Pop'
  },
  {
    id: 'q8',
    tier: 3,
    category: 'Base Running',
    question: 'Runner on 1st & 3rd, 2 outs. Batter hits a sharp grounder to short. Runner from 3rd crosses home BEFORE runner from 1st is thrown out at 2nd for out #3. Does the run count?',
    options: [
      'Yes, because the runner touched home plate before the 3rd out occurred.',
      'No, because the 3rd out was a force play.',
      'Yes, if the umpire determines it was a continuous movement.',
      'No, unless the defense leaves the field without appealing.'
    ],
    correctAnswer: 1,
    explanation: 'No run can score on a play where the 3rd out of the inning is recorded via a force out, regardless of when home plate was crossed.',
    runners: [1, 0, 1],
    outs: 2,
    hitVector: 'SS-Grounder'
  },
  {
    id: 'q9',
    tier: 3,
    category: 'Strategy & Pitching',
    question: '1st & 3rd defense, less than 2 outs. Opposing runner on 1st breaks early for 2nd before pitch delivery (Early Break). What is Catcher/Pitcher protocol?',
    options: [
      'Pitcher steps off rubber, looks runner at 3rd back, turns and throws to SS covering 2nd base.',
      'Pitcher quick-pitches to home plate.',
      'Catcher ignores runner on 1st and watches batter.',
      'First baseman runs across the mound to tag the runner.'
    ],
    correctAnswer: 0,
    explanation: 'On an early break, the pitcher MUST step off the rubber first with the pivot foot, check/freeze the runner at 3rd, and then initiate the turn to second.',
    runners: [1, 0, 1],
    outs: 1,
    hitVector: 'Steal'
  },

  // TIER 4: HALL OF FAME (Rating ~875-1000)
  {
    id: 'q10',
    tier: 4,
    category: 'Rules & Situations',
    question: 'Bases loaded, 2 outs. Uncaught 3rd strike (dropped ball by catcher). Catcher steps on home plate instead of tagging batter or throwing to 1st. Is the batter/runner out?',
    options: [
      'No, catcher must throw to 1st base or tag the batter.',
      'Yes, because with bases loaded and 2 outs, home plate is a force out.',
      'No, uncaught 3rd strike is nullified with bases loaded.',
      'Yes, but only if the batter attempted to run to 1st.'
    ],
    correctAnswer: 1,
    explanation: 'With 2 outs and bases loaded, all runners are forced to advance on an uncaught 3rd strike. Stepping on home plate completes the force out.',
    runners: [1, 1, 1],
    outs: 2,
    hitVector: 'Dropped-K'
  },
  {
    id: 'q11',
    tier: 4,
    category: 'Fielding & Cutoffs',
    question: 'Runner on 2nd base. Line drive off the wall in deep left-center. Left Fielder retrieves, throwing to Cutoff (SS). Pitcher positioning priority is:',
    options: [
      'Backing up 3rd base along the foul line extension.',
      'Backing up Home Plate directly behind the catcher in line with the throw.',
      'Standing on 2nd base bag.',
      'Positioning directly behind SS as a secondary cutoff.'
    ],
    correctAnswer: 1,
    explanation: 'With a runner starting on 2nd base on an extra-base hit to left-center, the primary threat to score is at home. Pitcher backs up home plate inline with the throw.',
    runners: [0, 1, 0],
    outs: 0,
    hitVector: 'LCF-Wall'
  },
  {
    id: 'q12',
    tier: 4,
    category: 'Strategy & Pitching',
    question: 'Count 3-2, 2 outs, runners on 1st and 2nd. Pitcher starts windup. What are the runners on 1st & 2nd instructed to do?',
    options: [
      'Hold position until ball crosses plate.',
      'Auto-steal / Full speed running on pitcher first movement.',
      'Take 3 shuffle steps and hold.',
      'Tag up on respective bags.'
    ],
    correctAnswer: 1,
    explanation: 'With 3-2 count and 2 outs, runners on forced bases break at full speed on pitch motion. If ball 4 is thrown, they get the next base; if strike 3, inning over; if hit, maximum distance.',
    runners: [1, 1, 0],
    outs: 2,
    hitVector: 'Full-Count-Break'
  }
];

// SVG Baseball Diamond Graphic Component
const DiamondDiagram = ({ runners = [0, 0, 0], outs = 0, hitVector = '' }) => {
  return (
    <div className="relative w-full max-w-xs mx-auto aspect-square bg-slate-800/80 rounded-xl p-4 border border-slate

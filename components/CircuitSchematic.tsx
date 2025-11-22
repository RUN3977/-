
import React from 'react';
import { CircuitMode, CircuitState } from '../types';

interface Props {
  state: CircuitState;
}

// --- Circuit Symbols ---

const ResistorH = ({ x, y, label, val = "10k" }: { x: number; y: number; label?: string; val?: string }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="0" y="-4" width="40" height="8" fill="transparent" /> {/* Hitbox */}
    <path d="M 0 0 L 5 0 L 7.5 -5 L 12.5 5 L 17.5 -5 L 22.5 5 L 27.5 -5 L 32.5 5 L 35 0 L 40 0" fill="none" stroke="#94a3b8" strokeWidth="2" />
    {label && <text x="20" y="-10" textAnchor="middle" fontSize="11" fill="#cbd5e1" className="font-mono font-bold">{label}</text>}
    <text x="20" y="18" textAnchor="middle" fontSize="9" fill="#64748b">{val}</text>
  </g>
);

const ResistorV = ({ x, y, label, val = "10k" }: { x: number; y: number; label?: string; val?: string }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-4" y="0" width="8" height="40" fill="transparent" />
    <path d="M 0 0 L 0 5 L -5 7.5 L 5 12.5 L -5 17.5 L 5 22.5 L -5 27.5 L 5 32.5 L 0 35 L 0 40" fill="none" stroke="#94a3b8" strokeWidth="2" />
    {label && <text x="10" y="20" textAnchor="start" fontSize="11" fill="#cbd5e1" className="font-mono font-bold">{label}</text>}
    <text x="-8" y="20" textAnchor="end" fontSize="9" fill="#64748b">{val}</text>
  </g>
);

const Ground = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <line x1="0" y1="0" x2="0" y2="5" stroke="#94a3b8" strokeWidth="2" />
    <line x1="-10" y1="5" x2="10" y2="5" stroke="#94a3b8" strokeWidth="2" />
    <line x1="-6" y1="9" x2="6" y2="9" stroke="#94a3b8" strokeWidth="2" />
    <line x1="-2" y1="13" x2="2" y2="13" stroke="#94a3b8" strokeWidth="2" />
  </g>
);

const VoltageSource = ({ x, y, label, val }: { x: number; y: number; label: string; val: string }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="0" cy="0" r="4" fill="#22d3ee" />
    <text x="-8" y="4" textAnchor="end" fontSize="12" fill="#fff" fontWeight="bold">{label}</text>
    <text x="-8" y="16" textAnchor="end" fontSize="10" fill="#94a3b8">{val}</text>
  </g>
);

// Standard OpAmp Symbol with Pins 2, 3, 6, 7, 4
const OpAmp = ({ x, y, id, type, isActive, labelBottom = false }: { x: number; y: number; id: string; type: string; isActive: boolean; labelBottom?: boolean }) => (
  <g transform={`translate(${x}, ${y})`} className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
    {/* Body */}
    <path d="M 0 0 L 60 30 L 0 60 Z" fill="#0f172a" stroke={isActive ? "#22d3ee" : "#475569"} strokeWidth="2" />
    
    {/* Pin 2 Inverting */}
    <text x="5" y="18" fontSize="14" fill="#94a3b8" fontWeight="bold">-</text>
    <text x="-5" y="14" fontSize="9" fill="#64748b" textAnchor="end">2</text>
    
    {/* Pin 3 Non-Inverting */}
    <text x="5" y="52" fontSize="14" fill="#94a3b8" fontWeight="bold">+</text>
    <text x="-5" y="54" fontSize="9" fill="#64748b" textAnchor="end">3</text>

    {/* Power Pins */}
    <line x1="30" y1="15" x2="30" y2="-5" stroke="#334155" strokeWidth="1" />
    <text x="30" y="-8" fontSize="8" fill="#64748b" textAnchor="middle">7 (+12V)</text>

    <line x1="30" y1="45" x2="30" y2="65" stroke="#334155" strokeWidth="1" />
    <text x="30" y="72" fontSize="8" fill="#64748b" textAnchor="middle">4 (-12V)</text>

    {/* Output Pin 6 */}
    <text x="65" y="33" fontSize="9" fill="#64748b">6</text>

    {/* ID */}
    <text x="30" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">{id}</text>
    {!labelBottom && <text x="30" y="48" textAnchor="middle" fontSize="8" fill="#64748b">{type}</text>}
    {labelBottom && <text x="30" y="85" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="bold">{type}</text>}
  </g>
);

export const CircuitSchematic: React.FC<Props> = ({ state }) => {
  const isAdd = state.mode === CircuitMode.ADD;
  const activeColor = "#22d3ee";
  const inactiveColor = "#334155";
  const warnColor = "#ef4444";

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 p-2 overflow-hidden relative select-none">
      <style>
        {`
          .wire { stroke-linecap: round; stroke-linejoin: round; fill: none; }
          .wire-active { stroke: ${activeColor}; stroke-width: 2; opacity: 1; }
          .wire-inactive { stroke: ${inactiveColor}; stroke-width: 1.5; opacity: 0.6; }
          .dot { fill: #64748b; }
          @keyframes flow { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }
          .flowing { stroke-dasharray: 6 4; animation: flow 0.8s linear infinite; }
        `}
      </style>
      
      <svg viewBox="0 0 900 600" className="w-full h-full max-w-6xl">
        
        {/* ======================= INPUTS ======================= */}
        <VoltageSource x={50} y={150} label="UA" val={`${state.uA.toFixed(1)}V`} />
        <VoltageSource x={50} y={400} label="UB" val={`${state.uB.toFixed(1)}V`} />


        {/* ======================= U1: ADDER ======================= 
            Non-Inverting Adder Config:
            R1 (UA) -> Pin 3
            R2 (UB) -> Pin 3
            Pin 2 -> R3 -> GND
            Pin 2 -> R4 -> Pin 6 (Feedback)
        */}
        <g transform="translate(200, 100)">
            {/* UA Path */}
            <path d="M -150 50 L -100 50 L -100 55 L -40 55" className="wire wire-inactive" stroke="#475569" />
            <ResistorH x={-40} y={55} label="R1" />
            
            {/* UB Path */}
            <path d="M -150 300 L -120 300 L -120 70 L -40 70" className="wire wire-inactive" stroke="#475569" />
            <ResistorH x={-40} y={70} label="R2" />

            {/* Junction at Pin 3 */}
            <path d="M 0 55 L 10 55 L 10 70 L 0 70" className="wire wire-inactive" stroke="#475569" />
            <circle cx="10" cy="62.5" r="2" className="dot" />
            <path d="M 10 62.5 L 20 62.5 L 20 50" className="wire wire-inactive" stroke="#475569" /> {/* To Pin 3 */}

            {/* Feedback Loop (Pin 2) */}
            <path d="M 20 10 L 20 -20 L 60 -20" className="wire wire-inactive" stroke="#475569" />
            <ResistorH x={60} y={-20} label="R4" />
            <path d="M 100 -20 L 130 -20 L 130 30 L 80 30" className="wire wire-inactive" stroke="#475569" />

            {/* Ground Leg (Pin 2) */}
            <circle cx="20" cy="10" r="2" className="dot" />
            <path d="M 20 10 L 20 35" className="wire wire-inactive" stroke="#475569" />
            <ResistorV x={20} y={35} label="R3" />
            <Ground x={20} y={80} />

            {/* OpAmp */}
            <OpAmp x={20} y={0} id="U1" type="ADDER" isActive={isAdd} />
            
            {/* Output */}
            <path d="M 80 30 L 160 30" className={`wire ${isAdd ? 'wire-active flowing' : 'wire-inactive'}`} />
            <text x="120" y="20" fontSize="10" fill={isAdd ? activeColor : "#64748b"} textAnchor="middle">U_ADD</text>
        </g>


        {/* ======================= U2: SUBTRACTOR ======================= 
            Differential Amplifier Config:
            UA -> R5 -> Pin 3
            GND -> R8 -> Pin 3
            UB -> R6 -> Pin 2
            Pin 2 -> R7 -> Pin 6 (Feedback)
        */}
        <g transform="translate(200, 380)">
            {/* UA Path (from top) */}
            <path d="M -150 -230 L -130 -230 L -130 60 L -40 60" className="wire wire-inactive" stroke="#475569" />
            <ResistorH x={-40} y={60} label="R5" />
            
            {/* Pin 3 Network (R5 + R8) */}
            <path d="M 0 60 L 20 60 L 20 50" className="wire wire-inactive" stroke="#475569" />
            <circle cx="20" cy="60" r="2" className="dot" />
            <path d="M 20 60 L 20 75" className="wire wire-inactive" stroke="#475569" />
            <ResistorV x={20} y={75} label="R8" />
            <Ground x={20} y={120} />

            {/* UB Path (Input) */}
            <path d="M -150 20 L -40 20" className="wire wire-inactive" stroke="#475569" />
            <ResistorH x={-40} y={20} label="R6" />
            <path d="M 0 20 L 20 20 L 20 10" className="wire wire-inactive" stroke="#475569" />

            {/* Feedback Loop (Pin 2) */}
            <circle cx="20" cy="20" r="2" className="dot" />
            <path d="M 20 20 L 20 -20 L 60 -20" className="wire wire-inactive" stroke="#475569" />
            <ResistorH x={60} y={-20} label="R7" />
            <path d="M 100 -20 L 130 -20 L 130 30 L 80 30" className="wire wire-inactive" stroke="#475569" />

            {/* OpAmp */}
            <OpAmp x={20} y={0} id="U2" type="SUB" isActive={!isAdd} />

            {/* Output */}
            <path d="M 80 30 L 160 30" className={`wire ${!isAdd ? 'wire-active flowing' : 'wire-inactive'}`} />
            <text x="120" y="20" fontSize="10" fill={!isAdd ? activeColor : "#64748b"} textAnchor="middle">U_SUB</text>
        </g>


        {/* ======================= CD4053 SWITCH ======================= */}
        <g transform="translate(450, 200)">
            {/* Box */}
            <rect x="0" y="0" width="80" height="120" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <text x="40" y="-10" textAnchor="middle" fill="#cbd5e1" fontWeight="bold">CD4053</text>

            {/* Pins */}
            {/* Pin 12: x0 (ADD Input) */}
            <line x1="-20" y1="30" x2="0" y2="30" stroke={isAdd ? activeColor : "#475569"} strokeWidth="2" />
            <text x="-5" y="25" textAnchor="end" fontSize="10" fill="#94a3b8">ax0 (12)</text>

            {/* Pin 13: x1 (SUB Input) */}
            <line x1="-20" y1="90" x2="0" y2="90" stroke={!isAdd ? activeColor : "#475569"} strokeWidth="2" />
            <text x="-5" y="85" textAnchor="end" fontSize="10" fill="#94a3b8">ax1 (13)</text>

            {/* Pin 11: Control */}
            <line x1="40" y1="120" x2="40" y2="140" stroke="#64748b" strokeWidth="1" />
            <text x="40" y="115" textAnchor="middle" fontSize="10" fill="#94a3b8">A (11)</text>
            <circle cx="40" cy="145" r="4" fill={isAdd ? activeColor : "#475569"} />
            <text x="40" y="160" textAnchor="middle" fontSize="10" fill={isAdd ? activeColor : "#475569"}>{isAdd ? "0 (Vee)" : "1 (Vdd)"}</text>

            {/* Pin 14: Output */}
            <line x1="80" y1="60" x2="100" y2="60" stroke={activeColor} strokeWidth="2" />
            <text x="75" y="55" textAnchor="end" fontSize="10" fill="#94a3b8">x (14)</text>

            {/* Internal Logic Animation */}
            <circle cx="20" cy="30" r="3" fill={isAdd ? activeColor : "#334155"} />
            <circle cx="20" cy="90" r="3" fill={!isAdd ? activeColor : "#334155"} />
            <line 
                x1="60" y1="60" 
                x2="20" y2={isAdd ? 30 : 90} 
                stroke={activeColor} 
                strokeWidth="3"
                className="transition-all duration-300"
            />
        </g>

        {/* Connection Lines to Switch */}
        {/* U1 Out to Pin 12 */}
        <path d="M 360 130 L 400 130 L 400 230 L 430 230" className={`wire ${isAdd ? 'wire-active' : 'wire-inactive'}`} />
        
        {/* U2 Out to Pin 13 */}
        <path d="M 360 410 L 400 410 L 400 290 L 430 290" className={`wire ${!isAdd ? 'wire-active' : 'wire-inactive'}`} />


        {/* ======================= MAIN OUTPUT ======================= */}
        <g transform="translate(550, 260)">
          <path d="M 0 0 L 60 0" className="wire wire-active flowing" />
          <circle cx="65" cy="0" r="4" fill="#22d3ee" />
          <text x="75" y="5" fontSize="16" fontWeight="bold" fill="#22d3ee" className="font-mono">{state.uY.toFixed(2)}V</text>
          <text x="75" y="20" fontSize="10" fill="#94a3b8">OUTPUT UY</text>
        </g>


        {/* ======================= U3: CARRY COMPARATOR ======================= 
            Pin 3 (+) <- U_ADD
            Pin 2 (-) <- 5V Ref
            Out (6) -> LED
        */}
        <g transform="translate(620, 60)">
            {/* 5V Ref to Pin 2 */}
            <VoltageSource x={-20} y={10} label="Ref" val="5V" />
            <path d="M -20 10 L 20 10" className="wire wire-inactive" stroke="#475569" />
            
            {/* U_ADD to Pin 3 */}
            <path d="M -260 70 L -240 70 L -240 50 L 20 50" className="wire" stroke={state.carry ? warnColor : "#475569"} strokeDasharray="3 3" />
            
            <OpAmp x={20} y={0} id="U3" type="CMP_C" isActive={state.carry} />

            {/* LED */}
            <path d="M 80 30 L 110 30" className="wire" stroke={state.carry ? warnColor : "#475569"} />
            <g transform="translate(120, 30)">
              <circle cx="0" cy="0" r="8" fill={state.carry ? warnColor : "#1e293b"} stroke={state.carry ? "#fee2e2" : "#475569"} />
              {state.carry && <circle cx="0" cy="0" r="12" fill={warnColor} opacity="0.3" filter="blur(4px)" />}
              <text x="15" y="5" fontSize="12" fill="white" fontWeight="bold">FC</text>
            </g>
        </g>


        {/* ======================= U4: BORROW COMPARATOR ======================= 
            Pin 3 (+) <- GND
            Pin 2 (-) <- U_SUB
            Out (6) -> LED
        */}
        <g transform="translate(620, 420)">
             {/* U_SUB to Pin 2 */}
             <path d="M -260 -10 L -240 -10 L -240 10 L 20 10" className="wire" stroke={state.borrow ? warnColor : "#475569"} strokeDasharray="3 3" />

             {/* GND to Pin 3 */}
             <Ground x={-10} y={50} />
             <path d="M -10 50 L 20 50" className="wire wire-inactive" stroke="#475569" />

             <OpAmp x={20} y={0} id="U4" type="CMP_B" isActive={state.borrow} />

             {/* LED */}
             <path d="M 80 30 L 110 30" className="wire" stroke={state.borrow ? warnColor : "#475569"} />
             <g transform="translate(120, 30)">
                <circle cx="0" cy="0" r="8" fill={state.borrow ? warnColor : "#1e293b"} stroke={state.borrow ? "#fee2e2" : "#475569"} />
                {state.borrow && <circle cx="0" cy="0" r="12" fill={warnColor} opacity="0.3" filter="blur(4px)" />}
                <text x="15" y="5" fontSize="12" fill="white" fontWeight="bold">FB</text>
             </g>
        </g>

      </svg>
    </div>
  );
};

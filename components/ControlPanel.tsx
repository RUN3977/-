import React from 'react';
import { CircuitMode } from '../types';
import { Sliders, Activity } from 'lucide-react';

interface Props {
  uA: number;
  setUA: (val: number) => void;
  uB: number;
  setUB: (val: number) => void;
  mode: CircuitMode;
  setMode: (mode: CircuitMode) => void;
}

const Knob = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="flex flex-col space-y-2 bg-slate-800 p-4 rounded-lg border border-slate-700">
    <div className="flex justify-between text-sm font-medium text-slate-300">
      <span>{label}</span>
      <span className="text-cyan-400 font-mono">{value.toFixed(2)}V</span>
    </div>
    <input
      type="range"
      min="-5"
      max="5"
      step="0.1"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
    <div className="flex justify-between text-xs text-slate-500 font-mono">
      <span>-5.0V</span>
      <span>+5.0V</span>
    </div>
  </div>
);

export const ControlPanel: React.FC<Props> = ({ uA, setUA, uB, setUB, mode, setMode }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-4">
        <Sliders className="text-cyan-500 w-5 h-5" />
        <h2 className="text-lg font-bold text-white">Signal Generator</h2>
      </div>

      <div className="space-y-6">
        <Knob label="Input Voltage A (UA)" value={uA} onChange={setUA} />
        <Knob label="Input Voltage B (UB)" value={uB} onChange={setUB} />

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="text-sm font-medium text-slate-300 mb-3 block flex items-center gap-2">
             <Activity className="w-4 h-4 text-cyan-500"/> Mode Selector (CD4053)
          </label>
          <div className="flex bg-slate-900 rounded-lg p-1 relative">
            <button
              onClick={() => setMode(CircuitMode.ADD)}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                mode === CircuitMode.ADD 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ADD (A + B)
            </button>
            <button
              onClick={() => setMode(CircuitMode.SUB)}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                mode === CircuitMode.SUB 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SUB (A - B)
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Simulates S1 switch control on CD4053 Pin 11
          </p>
        </div>
      </div>
    </div>
  );
};

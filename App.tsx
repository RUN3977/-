import React, { useState, useEffect } from 'react';
import { CircuitMode, CircuitState } from './types';
import { ControlPanel } from './components/ControlPanel';
import { CircuitSchematic } from './components/CircuitSchematic';
import { AnalysisCharts } from './components/AnalysisCharts';
import { AIAssistant } from './components/AIAssistant';
import { Zap, Cpu, Info } from 'lucide-react';

export default function App() {
  // State for the inputs
  const [uA, setUA] = useState<number>(2.0);
  const [uB, setUB] = useState<number>(1.5);
  const [mode, setMode] = useState<CircuitMode>(CircuitMode.ADD);
  
  // Derived state for the circuit
  const [state, setState] = useState<CircuitState>({
    uA: 0, uB: 0, mode: CircuitMode.ADD, uAdd: 0, uSub: 0, uY: 0, carry: false, borrow: false
  });

  // Circuit Simulation Logic
  useEffect(() => {
    const uAdd = uA + uB;
    const uSub = uA - uB;
    
    // The switch CD4053 selects output
    const uY = mode === CircuitMode.ADD ? uAdd : uSub;
    
    // Comparator logic (uA741 as comparator)
    // U3: Carry if Sum > 5V
    const carry = uAdd > 5.0;
    
    // U4: Borrow if Diff < 0V
    const borrow = uSub < 0.0;

    setState({
      uA, uB, mode, uAdd, uSub, uY, carry, borrow
    });
  }, [uA, uB, mode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900 selection:text-white">
      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">InfoCup Simulator</h1>
              <p className="text-xs text-slate-400">Analog Adder/Subtractor Design Final</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" /> Power: ±12V DC</span>
            <span className="flex items-center gap-1"><Info className="w-4 h-4 text-blue-400" /> uA741 x 4</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Grid: Controls & Schematic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Left Column: Controls (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <ControlPanel 
              uA={uA} setUA={setUA}
              uB={uB} setUB={setUB}
              mode={mode} setMode={setMode}
            />
            
            {/* Status Card */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Logic Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${state.carry ? 'bg-red-900/30 border-red-500/50' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="text-xs text-slate-400 mb-1">Carry Flag</div>
                  <div className={`text-lg font-mono font-bold ${state.carry ? 'text-red-400' : 'text-slate-600'}`}>
                    {state.carry ? 'ACTIVE' : 'OFF'}
                  </div>
                </div>
                <div className={`p-4 rounded-lg border ${state.borrow ? 'bg-red-900/30 border-red-500/50' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="text-xs text-slate-400 mb-1">Borrow Flag</div>
                  <div className={`text-lg font-mono font-bold ${state.borrow ? 'text-red-400' : 'text-slate-600'}`}>
                    {state.borrow ? 'ACTIVE' : 'OFF'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Schematic (9 cols) */}
          <div className="lg:col-span-9 h-[500px] lg:h-auto">
            <CircuitSchematic state={state} />
          </div>
        </div>

        {/* Bottom Grid: Analysis Charts */}
        <div className="grid grid-cols-1 gap-6 h-[400px]">
          <AnalysisCharts state={state} />
        </div>
      </main>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  );
}

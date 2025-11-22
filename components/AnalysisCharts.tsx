import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { CircuitState, CircuitMode } from '../types';

interface Props {
  state: CircuitState;
}

export const AnalysisCharts: React.FC<Props> = ({ state }) => {
  // Generate data points for the graph
  // We visualize the Output Voltage (Y) as Voltage B varies from -5 to +5, holding Voltage A constant.
  const data = [];
  for (let vb = -5; vb <= 5; vb += 0.5) {
    const uAdd = state.uA + vb;
    const uSub = state.uA - vb;
    data.push({
      vb: vb,
      add: uAdd,
      sub: uSub,
      // Depending on mode, highlight the active curve
      active: state.mode === CircuitMode.ADD ? uAdd : uSub
    });
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex flex-col h-full">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>Transfer Characteristics</span>
        <span className="text-xs font-normal text-slate-400">(Constant UA = {state.uA.toFixed(1)}V)</span>
      </h2>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="vb" 
              stroke="#94a3b8" 
              label={{ value: 'Input UB (V)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} 
            />
            <YAxis 
              stroke="#94a3b8" 
              domain={[-10, 10]} 
              label={{ value: 'Output (V)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
              formatter={(value: number) => value.toFixed(2)}
              labelFormatter={(label) => `UB: ${label}V`}
            />
            <Legend />
            
            <ReferenceLine y={0} stroke="#475569" />
            <ReferenceLine x={0} stroke="#475569" />
            
            {/* Indicators thresholds */}
            <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Carry (>5V)', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Borrow (<0V)', fill: '#ef4444', fontSize: 10, dy: 10 }} />

            {/* Ghost Lines (Inactive Mode) */}
            <Line 
              type="monotone" 
              dataKey="add" 
              stroke="#3b82f6" 
              strokeOpacity={state.mode === CircuitMode.ADD ? 0 : 0.2} 
              dot={false} 
              strokeDasharray="5 5"
              name="Add Curve (Reference)"
            />
             <Line 
              type="monotone" 
              dataKey="sub" 
              stroke="#a855f7" 
              strokeOpacity={state.mode === CircuitMode.SUB ? 0 : 0.2} 
              dot={false} 
              strokeDasharray="5 5"
              name="Sub Curve (Reference)"
            />

            {/* Active Line */}
            <Line 
              type="monotone" 
              dataKey="active" 
              stroke="#22d3ee" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#22d3ee' }}
              activeDot={{ r: 6 }}
              name={state.mode === CircuitMode.ADD ? "UY (Addition)" : "UY (Subtraction)"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

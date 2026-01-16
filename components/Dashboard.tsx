
import React, { useMemo, useEffect, useState } from 'react';
import { InventoryItem, Stats } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend 
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, Package, Sparkles, Loader2 } from 'lucide-react';
import { analyzeInventory } from '../services/geminiService';

interface DashboardProps {
  items: InventoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  const stats: Stats = useMemo(() => {
    const now = new Date();
    return {
      total: items.length,
      disposed: items.filter(i => i.disposed).length,
      pending: items.filter(i => !i.disposed).length,
      overdue: items.filter(i => !i.disposed && new Date(i.dispoPlanned) < now).length,
    };
  }, [items]);

  const chartData = useMemo(() => [
    { name: 'Disposed', value: stats.disposed, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ], [stats]);

  const handleAnalyze = async () => {
    if (items.length === 0) return;
    setLoadingAi(true);
    const result = await analyzeInventory(items);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  useEffect(() => {
    if (items.length > 0 && !aiAnalysis) {
      handleAnalyze();
    }
  }, [items]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Disposed', value: stats.disposed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'In Progress', value: stats.pending, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Critical/Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{m.label}</p>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">{m.value}</h4>
            </div>
            <div className={`${m.bg} ${m.color} p-3 rounded-xl`}>
              <m.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            Status Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
            <Sparkles size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-blue-400" />
                Gemini Insights
              </h3>
              <button 
                onClick={handleAnalyze} 
                disabled={loadingAi || items.length === 0}
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
              >
                {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />}
                Refresh
              </button>
            </div>

            <div className="flex-grow">
              {items.length === 0 ? (
                <p className="text-slate-400 text-sm italic">Add assets to generate intelligent insights.</p>
              ) : loadingAi ? (
                <div className="space-y-3">
                  <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse" />
                </div>
              ) : (
                <div className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
                  {aiAnalysis || "Click refresh to analyze your current inventory for risks and trends."}
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Powered by Google Gemini 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

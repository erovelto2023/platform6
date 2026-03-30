'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, TrendingUp } from 'lucide-react';

interface PopulationStatsProps {
  data: {
    total?: number;
    male?: number;
    female?: number;
    age0to4?: number;
    age5to17?: number;
    age18to24?: number;
    age25to44?: number;
    age45to64?: number;
    age65plus?: number;
    ageUnder18?: number;
    age18plus?: number;
    age18to54?: number;
    age55plus?: number;
  };
  raceData?: {
    white?: number;
    black?: number;
    native?: number;
    asian?: number;
    pacificIslander?: number;
    twoOrMore?: number;
    hispanic?: number;
    notHispanic?: number;
  };
  stateName: string;
}

const COLORS = ['#3b82f6', '#4f46e5', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
const RACE_COLORS = ['#3b82f6', '#8b5cf6', '#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#71717a'];

export function StatePopulationStats({ data, raceData, stateName }: PopulationStatsProps) {
  if (!data || !data.total) return null;

  const ageData = [
    { name: '0-4', value: data.age0to4 },
    { name: '5-17', value: data.age5to17 },
    { name: '18-24', value: data.age18to24 },
    { name: '25-44', value: data.age25to44 },
    { name: '45-64', value: data.age45to64 },
    { name: '65+', value: data.age65plus },
  ].filter(item => item.value !== undefined);

  const sexData = [
    { name: 'Male', value: data.male },
    { name: 'Female', value: data.female },
  ].filter(item => item.value !== undefined);

  const racialProfile = raceData ? [
    { name: 'White', value: raceData.white },
    { name: 'Black', value: raceData.black },
    { name: 'Hispanic', value: raceData.hispanic },
    { name: 'Asian', value: raceData.asian },
    { name: 'Native', value: raceData.native },
    { name: 'Pacific Islander', value: raceData.pacificIslander },
    { name: 'Mixed/Other', value: raceData.twoOrMore },
  ].filter(item => item.value !== undefined && item.value > 0) : [];

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-3 mb-2 border-l-4 border-blue-500 pl-4">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Demographics & Population</h2>
          <p className="text-zinc-500 mt-1 uppercase text-[10px] font-bold">Detailed statistical breakdown for the state of {stateName}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <Card className="border-zinc-800 bg-zinc-900 overflow-hidden relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Population</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-blue-400 italic">{formatNumber(data.total)}</div>
            <p className="text-[10px] font-bold text-zinc-500 mt-2 flex items-center gap-1 uppercase italic">
              <Users className="w-3 h-3" /> Latest Census Data
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900 overflow-hidden relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Adult Population (18+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-indigo-400 italic">{formatNumber(data.age18plus || 0)}</div>
            <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase italic">
              {data.total ? ((data.age18plus || 0) / data.total * 100).toFixed(1) : 0}% of total population
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900 overflow-hidden relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Senior Citizens (65+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-emerald-400 italic">{formatNumber(data.age65plus || 0)}</div>
            <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase italic">
              {data.total ? ((data.age65plus || 0) / data.total * 100).toFixed(1) : 0}% of total population
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age Distribution Chart */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/50">
            <CardTitle className="text-white text-sm font-black uppercase tracking-widest">Age Distribution</CardTitle>
            <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase italic">Population breakdown by age group</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#18181b' }}
                    contentStyle={{ 
                      backgroundColor: '#09090b', 
                      borderRadius: '12px', 
                      border: '1px solid #27272a',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' 
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sex Distribution Chart */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardHeader className="border-b border-zinc-800 bg-zinc-950/50">
            <CardTitle className="text-white text-sm font-black uppercase tracking-widest">Gender Distribution</CardTitle>
            <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase italic">Breakdown of male vs. female population</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sexData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#4f46e5" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#09090b', 
                      borderRadius: '12px', 
                      border: '1px solid #27272a',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' 
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(value) => <span className="text-zinc-400 text-[10px] font-black uppercase italic">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-8 w-full mt-4">
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400 italic">{data.total ? (data.male! / data.total * 100).toFixed(1) : 0}%</div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter italic">Male</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-indigo-400 italic">{data.total ? (data.female! / data.total * 100).toFixed(1) : 0}%</div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter italic">Female</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Racial Profile Chart */}
        {racialProfile.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden lg:col-span-2">
            <CardHeader className="border-b border-zinc-800 bg-zinc-950/50">
              <CardTitle className="text-white text-sm font-black uppercase tracking-widest">Racial Demographic Profile</CardTitle>
              <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase italic">Estimated ethnic and racial composition for the state</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={racialProfile} 
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#27272a" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      width={90}
                      tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 'black' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#18181b' }}
                      contentStyle={{ 
                        backgroundColor: '#09090b', 
                        borderRadius: '12px', 
                        border: '1px solid #27272a',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' 
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      formatter={(value: any) => [`${formatNumber(Number(value))} (${((Number(value) / data.total!) * 100).toFixed(1)}%)`, 'Population']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                      {racialProfile.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={RACE_COLORS[index % RACE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

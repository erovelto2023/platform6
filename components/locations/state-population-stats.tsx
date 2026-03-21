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

const COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
const RACE_COLORS = ['#334155', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

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
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Demographics & Population</h2>
          <p className="text-slate-500 mt-1">Detailed statistical breakdown for the state of {stateName}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Population</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-blue-600">{formatNumber(data.total)}</div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Users className="w-3 h-3" /> Latest Census Data
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Adult Population (18+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-indigo-600">{formatNumber(data.age18plus || 0)}</div>
            <p className="text-xs text-slate-400 mt-2">
              {data.total ? ((data.age18plus || 0) / data.total * 100).toFixed(1) : 0}% of total population
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Senior Citizens (65+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-emerald-600">{formatNumber(data.age65plus || 0)}</div>
            <p className="text-xs text-slate-400 mt-2">
              {data.total ? ((data.age65plus || 0) / data.total * 100).toFixed(1) : 0}% of total population
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age Distribution Chart */}
        <Card className="shadow-lg border-slate-100 overflow-hidden">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Population breakdown by age group</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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
        <Card className="shadow-lg border-slate-100 overflow-hidden">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Breakdown of male vs. female population</CardDescription>
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
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-8 w-full mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.total ? (data.male! / data.total * 100).toFixed(1) : 0}%</div>
                <div className="text-sm text-slate-500 uppercase tracking-tighter">Male</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">{data.total ? (data.female! / data.total * 100).toFixed(1) : 0}%</div>
                <div className="text-sm text-slate-500 uppercase tracking-tighter">Female</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Racial Profile Chart */}
        {racialProfile.length > 0 && (
          <Card className="shadow-lg border-slate-100 overflow-hidden lg:col-span-2">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <CardTitle>Racial Demographic Profile</CardTitle>
              <CardDescription>Estimated ethnic and racial composition for the state</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={racialProfile} 
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      width={90}
                      tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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

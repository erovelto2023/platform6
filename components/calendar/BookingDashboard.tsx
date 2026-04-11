'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  List,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { format, addDays, startOfWeek, addMinutes, isSameDay } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BookingData, BookingStatus } from "@/types/booking";
import { getBookings } from "@/lib/actions/booking.actions";

import { useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';

const TIMES = Array.from({ length: 11 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`);

export function BookingDashboard() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [timeRange, setTimeRange] = useState('Week');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    revenue: 0
  });

  // --- Data Fetching ---
  useEffect(() => {
    async function loadData() {
      const result = await getBookings();
      if (result.success && result.data) {
        setBookings(result.data);
        
        const pendingValue = result.data.filter(b => b.status === 'pending').length;
        const confirmedValue = result.data.filter(b => b.status === 'confirmed').length;
        const revenueValue = result.data.reduce((acc, b) => b.paymentStatus === 'paid' ? acc + 1 : acc, 0);
        
        setStats({
          total: result.data.length,
          pending: pendingValue,
          confirmed: confirmedValue,
          revenue: revenueValue
        });
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // --- Helper: Date Range ---
  const days = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  // --- Filter Logic ---
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const searchStr = searchQuery.toLowerCase();
      const matchesSearch = 
        b.customerName.toLowerCase().includes(searchStr) || 
        (b.service?.name || '').toLowerCase().includes(searchStr);
      
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // --- Sub-Components ---
  const StatusPill = ({ status }: { status: BookingStatus }) => {
    const variants: Record<BookingStatus, string> = {
      pending: 'bg-amber-500',
      confirmed: 'bg-emerald-500',
      cancelled: 'bg-rose-500',
      completed: 'bg-indigo-500'
    };
    return <div className={`w-2 h-2 rounded-full ${variants[status] || 'bg-zinc-500'}`} />;
  };

  const CalendarView = () => (
    <div className="flex-1 overflow-auto bg-[#0B0E14] rounded-tl-3xl border-l border-t border-zinc-800/50">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[1000px]">
        {/* Header Spacer */}
        <div className="h-16 border-b border-r border-zinc-800/50 bg-[#0F1218]"></div>
        {/* Day Headers */}
        {days.map((day, i) => (
          <div key={i} className="h-16 border-b border-r border-zinc-800/50 bg-[#0F1218] flex flex-col items-center justify-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{format(day, 'EEE')}</span>
            <span className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-cyan-400' : 'text-zinc-400'}`}>
              {format(day, 'd')}
            </span>
          </div>
        ))}

        {/* Time Grid */}
        {TIMES.map((time) => (
          <React.Fragment key={time}>
            <div className="h-28 border-b border-r border-zinc-800/20 flex items-start justify-center pt-3">
              <span className="text-[10px] text-zinc-600 font-mono font-medium">{time}</span>
            </div>
            {days.map((day, i) => {
              const slotTimeStr = time;
              const slotBookings = filteredBookings.filter(b => {
                const bDate = new Date(b.startTime);
                return isSameDay(bDate, day) && format(bDate, 'HH:mm') === slotTimeStr;
              });
              
              return (
                <div key={`${time}-${i}`} className="h-28 border-b border-r border-zinc-800/20 relative group hover:bg-white/[0.02] transition-colors">
                  {slotBookings.map(b => (
                    <Card 
                      key={b.id} 
                      className="absolute inset-1.5 p-2.5 bg-zinc-900/60 border-zinc-800/50 backdrop-blur-sm rounded-xl shadow-2xl cursor-pointer hover:bg-zinc-800/80 transition-all border-l-4 overflow-hidden group/card"
                      style={{ borderLeftColor: (b.service as any)?.color || '#06b6d4' }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <StatusPill status={b.status} />
                          <span className="text-[11px] font-bold text-white truncate leading-tight uppercase tracking-tight">
                            {b.service?.name || 'Session'}
                          </span>
                        </div>
                        <Clock size={10} className="text-zinc-600 flex-shrink-0" />
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate mb-2 font-medium">{b.customerName}</div>
                      <div className="flex items-center gap-2">
                         <Badge variant="outline" className="text-[9px] py-0 px-1 border-zinc-800 text-zinc-500 font-mono">
                           {format(new Date(b.startTime), 'HH:mm')}
                         </Badge>
                         {b.paymentStatus === 'paid' && <CheckCircle2 size={10} className="text-emerald-500" />}
                      </div>
                    </Card>
                  ))}
                  {slotBookings.length === 0 && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center pointer-events-none">
                      <Plus size={14} className="text-cyan-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const ListView = () => (
    <div className="flex-1 overflow-auto bg-[#0B0E14] rounded-tl-3xl border-l border-t border-zinc-800/50 p-8">
      <div className="max-w-6xl mx-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-zinc-500 text-[10px] uppercase tracking-[2px] border-b border-zinc-800/50 hover:bg-transparent">
              <TableHead className="w-12 h-12">#</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-800/30">
            {filteredBookings.map((b, idx) => (
              <TableRow key={b.id} className="group border-none hover:bg-white/[0.02] transition-all text-zinc-300">
                <TableCell className="py-5 text-zinc-600 text-xs font-mono">{idx + 1}</TableCell>
                <TableCell className="py-5 font-medium">{format(new Date(b.startTime), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="py-5 font-mono text-cyan-500/80">{format(new Date(b.startTime), 'HH:mm')}</TableCell>
                <TableCell className="py-5 text-white font-bold tracking-tight">{b.customerName}</TableCell>
                <TableCell className="py-5 italic text-zinc-400">{b.service?.name || 'General'}</TableCell>
                <TableCell className="py-5">
                  <Badge className={`rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${
                    b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    b.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-5 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800">
                    <MoreVertical size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center bg-[#0B0E14] text-zinc-500 font-black tracking-widest uppercase">Initializing BOS Grid...</div>;
  }

  return (
    <div className="flex h-screen bg-[#0F1218] text-white font-sans selection:bg-cyan-500/30">
      {/* --- Sidebar --- */}
      <aside className="w-72 flex flex-col border-r border-zinc-800/50 bg-[#0F1218] z-50">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-0 cursor-pointer">BOS</div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tighter leading-none">BOS TERMINAL</span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-[2px] uppercase">System v1.2</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="px-4 mb-4 text-[10px] uppercase tracking-[3px] text-zinc-600 font-black">OPERATIONAL CORE</div>
          
          <NavItem 
            icon={LayoutDashboard} 
            label="ANALYTICS HUB" 
            active={statusFilter === 'all' && viewMode === 'calendar'} 
            onClick={() => { setStatusFilter('all'); setViewMode('calendar'); }}
          />
          
          <NavItem 
            icon={Inbox} 
            label="PENDING QUEUE" 
            count={stats.pending} 
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
          />
          
          <NavItem 
            icon={CalendarIcon} 
            label="TEMPORAL MATRIX" 
            active={viewMode === 'calendar' && statusFilter === 'all'} 
            onClick={() => { setViewMode('calendar'); setStatusFilter('all'); }}
          />
          
          <NavItem 
            icon={Users} 
            label="ENTITY DATABASE" 
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          />
          
          <div className="pt-8 px-4 mb-4 text-[10px] uppercase tracking-[3px] text-zinc-600 font-black">SYSTEM CONTROLS</div>
          
          <NavItem 
            icon={Settings} 
            label="GLOBAL PARAMETERS" 
            onClick={() => router.push('/calendar/settings')}
          />
          
          <NavItem 
            icon={LogOut} 
            label="TERMINATE SESSION" 
            onClick={() => signOut()}
          />
        </nav>

        {/* User Context */}
        <div className="p-6 border-t border-zinc-800/30 flex items-center gap-4 bg-black/10">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px] group cursor-pointer">
            <div className="w-full h-full rounded-full bg-[#0F1218] flex items-center justify-center text-zinc-400 font-bold overflow-hidden transition-transform group-hover:scale-105">
               {user?.imageUrl ? (
                 <img src={user.imageUrl} alt="Admin" className="w-full h-full object-cover" />
               ) : (
                 <Users size={20} className="text-white/80" />
               )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-black text-white uppercase tracking-tight truncate">
              {user?.fullName || 'Executive Admin'}
            </div>
            <div className="text-[10px] text-zinc-600 font-bold truncate uppercase tracking-widest">Master Node</div>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0F1218]">
        {/* Top Header */}
        <header className="h-24 px-10 flex items-center justify-between border-b border-zinc-800/20 bg-[#0F1218]/50 backdrop-blur-xl z-40">
          <div className="flex flex-col">
            <h1 className="text-[10px] font-black uppercase tracking-[4px] text-zinc-600 mb-1">Session Protocol</h1>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              Session Pipeline
              <ArrowUpRight size={16} className="text-cyan-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {/* Quick Stats Grid */}
            <div className="hidden lg:flex items-center gap-8 pr-8 border-r border-zinc-800/20">
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Confirmed</span>
                 <span className="text-xl font-black text-white tabular-nums">{stats.confirmed}</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Pending</span>
                 <span className="text-xl font-black text-amber-500 tabular-nums">{stats.pending}</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Revenue</span>
                 <span className="text-xl font-black text-emerald-500 tabular-nums">${stats.revenue * 150}</span>
               </div>
            </div>

            <div className="relative w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Direct Search..."
                className="w-full bg-black/40 border-2 border-zinc-800/50 rounded-2xl py-2.5 pl-12 pr-6 text-xs focus:outline-none focus:border-cyan-500/50 transition-all font-medium placeholder:text-zinc-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-11 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-cyan-900/20 border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1">
              <Plus size={18} className="mr-2" />
              New Session
            </Button>
          </div>
        </header>

        {/* View Controls & Date Pickers */}
        <div className="px-10 py-8 flex items-center justify-between bg-black/5">
          <div className="flex items-center gap-6">
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800/50 shadow-inner">
              {['Week', 'Month', 'Year'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    timeRange === range ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-400/20' : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
               <div className="text-sm font-black text-white/90 font-mono tracking-tighter uppercase p-2.5 px-6 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 backdrop-blur-md">
                 {format(currentDate, 'MMMM yyyy')}
               </div>
               <div className="flex items-center gap-1.5">
                <Button variant="outline" size="icon" className="h-10 w-10 border-zinc-800 bg-black/40 hover:bg-zinc-800 rounded-xl" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                  <ChevronLeft size={18} />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 border-zinc-800 bg-black/40 hover:bg-zinc-800 rounded-xl" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-zinc-800/50">
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-zinc-800 shadow-xl text-cyan-400' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <LayoutDashboard size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-zinc-800 shadow-xl text-cyan-400' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        {viewMode === 'calendar' ? <CalendarView /> : <ListView />}
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, count = 0, onClick }: { icon: any, label: string, active?: boolean, count?: number, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between group px-5 py-3.5 cursor-pointer transition-all rounded-2xl mx-1 relative ${
        active ? 'bg-indigo-500/10 text-white shadow-inner shadow-indigo-500/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 rotate-6' : 'bg-transparent group-hover:scale-110'}`}>
          <Icon size={18} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[2px]">{label}</span>
      </div>
      {count > 0 && (
        <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center border border-indigo-500/30">
          {count}
        </span>
      )}
      {active && <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_20px_indigo]" />}
    </div>
  );
}

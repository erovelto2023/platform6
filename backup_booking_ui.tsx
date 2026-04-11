import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Calendar, 
  Users, 
  Wrench, 
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
  DollarSign,
  X
} from 'lucide-react';

// --- Mock Data ---
const MOCK_BOOKINGS = [
  { id: 1, date: 'Oct 18, 2024', scheduled: 'Oct 19, 2024', time: '09:00', client: 'Anders Berg', carReg: 'DA 14325', carYear: 2019, clientType: 'private person', work: 'Battery replacement', mechanics: ['Oliver W.'], color: 'blue' },
  { id: 2, date: 'Oct 18, 2024', scheduled: 'Oct 19, 2024', time: '10:00', client: 'Amanda Carter', carReg: 'KR 38744', carYear: 2021, clientType: 'private person', work: 'Brake pad replacement', mechanics: ['Oliver W.', 'Sarah J.'], color: 'red' },
  { id: 3, date: 'Oct 18, 2024', scheduled: 'Oct 20, 2024', time: '11:00', client: 'Darlene Robertson', carReg: 'DA 28315', carYear: 2018, clientType: 'private person', work: 'Oil change, Oil filter replacement', mechanics: ['Oliver W.'], color: 'blue' },
  { id: 4, date: 'Oct 18, 2024', scheduled: 'Oct 22, 2024', time: '14:00', client: 'Ronald Richards', carReg: 'DA 35315', carYear: 2022, clientType: 'business', work: 'Transmission fluid flush', mechanics: ['Sarah J.', 'Mike T.'], color: 'yellow' },
  { id: 5, date: 'Oct 17, 2024', scheduled: 'Oct 19, 2024', time: '15:00', client: 'Ralph Edwards', carReg: 'DA 84285', carYear: 2017, clientType: 'private person', work: 'Shock absorber replacement', mechanics: ['Mike T.'], color: 'blue' },
  { id: 6, date: 'Oct 17, 2024', scheduled: 'Oct 19, 2024', time: '12:00', client: 'Cody Fisher', carReg: 'DA 73525', carYear: 2020, clientType: 'private person', work: 'Wheel balancing', mechanics: ['Oliver W.'], color: 'red' },
  { id: 7, date: 'Oct 14, 2024', scheduled: 'Oct 14, 2024', time: '11:00', client: 'Kristin Watson', carReg: 'DA 18229', carYear: 2019, clientType: 'private person', work: 'Engine tune-up', mechanics: ['Oliver W.'], color: 'blue' },
  { id: 8, date: 'Oct 15, 2024', scheduled: 'Oct 15, 2024', time: '13:00', client: 'Kathryn Murphy', carReg: 'DA 14325', carYear: 2018, clientType: 'private person', work: 'Cabin air filter replacement', mechanics: ['Sarah J.'], color: 'blue' },
];

const DAYS = [
  { name: 'Mon', date: 14 },
  { name: 'Tue', date: 15 },
  { name: 'Wed', date: 16 },
  { name: 'Thu', date: 17 },
  { name: 'Fri', date: 18 },
  { name: 'Sat', date: 19 },
  { name: 'Sun', date: 20 },
];

const TIMES = Array.from({ length: 11 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`);

const App = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [timeRange, setTimeRange] = useState('Week');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    clientType: 'private person',
    minCarYear: 2018
  });

  // --- Filter Logic ---
  const filteredBookings = useMemo(() => {
    return MOCK_BOOKINGS.filter(b => {
      const matchesSearch = b.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.work.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClient = !filters.clientType || b.clientType === filters.clientType;
      const matchesYear = !filters.minCarYear || b.carYear >= filters.minCarYear;
      return matchesSearch && matchesClient && matchesYear;
    });
  }, [searchQuery, filters]);

  // --- Components ---

  const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-r-2 ${
      active ? 'bg-zinc-800 text-white border-rose-500' : 'text-zinc-400 border-transparent hover:text-zinc-200'
    }`}>
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  const StatusPill = ({ color }: { color: string }) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      red: 'bg-rose-500',
      yellow: 'bg-amber-500'
    };
    return <div className={`w-2 h-2 rounded-full ${colors[color] || 'bg-zinc-500'}`} />;
  };

  const CalendarView = () => (
    <div className="flex-1 overflow-auto bg-[#121214] rounded-tl-3xl border-l border-t border-zinc-800">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[1000px]">
        {/* Header Spacer */}
        <div className="h-16 border-b border-r border-zinc-800 bg-[#1a1a1c]"></div>
        {/* Day Headers */}
        {DAYS.map((day, i) => (
          <div key={i} className="h-16 border-b border-r border-zinc-800 bg-[#1a1a1c] flex flex-col items-center justify-center">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{day.name}</span>
            <span className={`text-lg font-bold ${day.date === 15 ? 'text-white' : 'text-zinc-400'}`}>{day.date}</span>
          </div>
        ))}

        {/* Time Grid */}
        {TIMES.map((time) => (
          <React.Fragment key={time}>
            <div className="h-24 border-b border-r border-zinc-800 flex items-start justify-center pt-2">
              <span className="text-xs text-zinc-500 font-mono">{time}</span>
            </div>
            {DAYS.map((day, i) => {
              // Find matching bookings for this slot
              const slotBookings = filteredBookings.filter(b => b.time === time && parseInt(b.scheduled.split(' ')[1]) === day.date);
              
              return (
                <div key={`${time}-${i}`} className="h-24 border-b border-r border-zinc-800 relative group">
                  {slotBookings.map(b => (
                    <div key={b.id} className="absolute inset-1 p-2 bg-zinc-800/80 border border-zinc-700 rounded-lg shadow-xl cursor-pointer hover:bg-zinc-700 transition-colors overflow-hidden">
                      <div className="flex items-center gap-1.5 mb-1">
                        <StatusPill color={b.color} />
                        <span className="text-[10px] font-bold text-white truncate">{b.work}</span>
                      </div>
                      <div className="text-[9px] text-zinc-400 truncate mb-2">Aarhus Rosenway, 24...</div>
                      <div className="flex -space-x-2">
                        {b.mechanics.map((m, idx) => (
                          <div key={idx} className="w-5 h-5 rounded-full bg-zinc-600 border border-zinc-800 flex items-center justify-center text-[8px] text-white">
                            {m[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Visual patterns for empty slots as seen in design */}
                  {slotBookings.length === 0 && (i % 3 === 0 || i === 6) && (
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{backgroundImage: 'repeating-linear-gradient(45deg, #ccc, #ccc 10px, transparent 10px, transparent 20px)'}}>
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
    <div className="flex-1 overflow-auto bg-[#121214] rounded-tl-3xl border-l border-t border-zinc-800 p-6">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-sm hover:bg-zinc-700 transition-colors">
          <Filter size={16} />
          <span>Filters</span>
          <span className="bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-xl border border-zinc-700 text-sm">
          <span className="text-zinc-500">Client type</span>
          <span className="text-zinc-400">is</span>
          <span className="text-white font-medium">private person</span>
          <X size={14} className="text-zinc-500 cursor-pointer" onClick={() => setFilters({...filters, clientType: ''})} />
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-xl border border-zinc-700 text-sm">
          <span className="text-zinc-500">Car</span>
          <span className="text-zinc-400">is no less than</span>
          <span className="text-white font-medium">2018</span>
          <X size={14} className="text-zinc-500 cursor-pointer" onClick={() => setFilters({...filters, minCarYear: 0})} />
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
            <th className="pb-4 font-medium pl-4">#</th>
            <th className="pb-4 font-medium">Date</th>
            <th className="pb-4 font-medium">Scheduled</th>
            <th className="pb-4 font-medium flex items-center gap-1 cursor-pointer hover:text-zinc-300">
              Client <ChevronRight size={14} className="rotate-90" />
            </th>
            <th className="pb-4 font-medium">Car registration</th>
            <th className="pb-4 font-medium">Work</th>
            <th className="pb-4 font-medium">Assigned mechanics</th>
            <th className="pb-4 font-medium text-right pr-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {filteredBookings.map((b, idx) => (
            <tr key={b.id} className="group hover:bg-zinc-800/30 transition-colors text-zinc-300 text-sm">
              <td className="py-4 pl-4 text-zinc-500 text-xs">{idx + 1}</td>
              <td className="py-4">{b.date}</td>
              <td className="py-4">{b.scheduled}</td>
              <td className="py-4 text-white font-medium">{b.client}</td>
              <td className="py-4 font-mono text-zinc-400 text-xs">{b.carReg}</td>
              <td className="py-4 max-w-xs truncate">{b.work}</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {b.mechanics.map((m, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-zinc-700 border-2 border-[#121214] flex items-center justify-center text-[10px] text-white">
                        {m.split(' ')[0][0]}
                      </div>
                    ))}
                  </div>
                  {b.mechanics.length > 2 && <span className="text-blue-400 text-xs font-bold">+{b.mechanics.length - 2}</span>}
                </div>
              </td>
              <td className="py-4 text-right pr-4">
                <button className="p-1 hover:bg-zinc-700 rounded-md transition-colors">
                  <MoreVertical size={16} className="text-zinc-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#1a1a1c] text-white font-sans selection:bg-rose-500/30">
      {/* --- Sidebar --- */}
      <aside className="w-64 flex flex-col border-r border-zinc-800">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-rose-500 italic">CJ</div>
            <span className="font-bold text-xl tracking-tight">CARJOY</span>
          </div>
          <button className="text-zinc-500 hover:text-white"><ChevronLeft size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <div className="px-6 mb-4 text-[10px] uppercase tracking-[2px] text-zinc-600 font-bold">Menus</div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={Inbox} label="Incoming bookings" />
          <SidebarItem icon={Calendar} label="Active bookings" active />
          <SidebarItem icon={Users} label="Customers" />
          <SidebarItem icon={Wrench} label="Mechanics" />
          <SidebarItem icon={DollarSign} label="Price settings" />
          <SidebarItem icon={CheckCircle2} label="Finished bookings" />

          <div className="px-6 mt-8 mb-4 text-[10px] uppercase tracking-[2px] text-zinc-600 font-bold">Account settings</div>
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={LogOut} label="Logout" />
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden border border-zinc-700">
            <Users size={20} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-white">Oliver W.</div>
            <div className="text-[10px] text-zinc-500">Admin</div>
          </div>
          <ChevronRight size={14} className="text-zinc-600" />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between">
          <h1 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Active Bookings</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-mono">⌘+F</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Filter size={20} /></button>
              <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
                <LayoutDashboard size={20} />
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[10px] rounded-full flex items-center justify-center text-white border-2 border-[#1a1a1c]">
                  1
                </span>
              </button>
              <button className="ml-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
                <Plus size={18} />
                New booking
              </button>
            </div>
          </div>
        </header>

        {/* View Controls */}
        <div className="px-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex bg-[#121214] p-1 rounded-xl border border-zinc-800">
              {['Week', 'Month', 'Year'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    timeRange === range ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/20' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[#121214] px-4 py-2 rounded-xl border border-zinc-800 cursor-pointer text-zinc-300 hover:bg-zinc-800 transition-colors">
              <span className="text-xs font-medium">October</span>
              <ChevronRight size={14} className="rotate-90 text-zinc-500" />
            </div>
            <div className="flex items-center gap-2 bg-[#121214] px-4 py-2 rounded-xl border border-zinc-800 cursor-pointer text-zinc-300 hover:bg-zinc-800 transition-colors">
              <span className="text-xs font-medium">2024</span>
              <ChevronRight size={14} className="rotate-90 text-zinc-500" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#121214] p-1 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Calendar size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List size={18} />
              </button>
            </div>
            
            {viewMode === 'calendar' && (
              <div className="flex items-center gap-1">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors bg-[#121214] border border-zinc-800 rounded-lg">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors bg-[#121214] border border-zinc-800 rounded-lg">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content Area */}
        {viewMode === 'calendar' ? <CalendarView /> : <ListView />}
      </main>
    </div>
  );
};

export default App;

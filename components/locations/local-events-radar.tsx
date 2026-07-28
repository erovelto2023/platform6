"use client";

import { Calendar, MapPin, Sparkles, Tag, ExternalLink, Ticket, Compass } from "lucide-react";

interface LocalEventsRadarProps {
  stateName: string;
  cityName?: string;
}

export function LocalEventsRadar({ stateName, cityName }: LocalEventsRadarProps) {
  const isDelaware = stateName.toLowerCase().includes("delaware");

  const events = isDelaware ? [
    {
      title: "Delaware State Fair & Agricultural Expo",
      category: "Statewide Festival & Expo",
      date: "July 17 - July 26, 2026",
      location: "Harrington / State Fairgrounds",
      marketingOpportunity: "High Foot Traffic (300,000+ Visitors). Ideal for physical sampling, local brand popups, and regional sponsorship.",
      url: "https://www.delawarestatefair.com"
    },
    {
      title: "Clifford Brown Jazz Festival",
      category: "Music & Cultural Festival",
      date: "June 2026 (Annual)",
      location: "Rodney Square, Wilmington, DE",
      marketingOpportunity: "Largest free jazz festival on East Coast. High engagement for arts, hospitality, apparel, and food vendors.",
      url: "https://cliffordbrownjazzfest.org"
    },
    {
      title: "SeaWitch Festival & Parade",
      category: "Fall Coastal Event",
      date: "October 23 - October 25, 2026",
      location: "Rehoboth Beach & Coastal Delaware",
      marketingOpportunity: "Over 200,000 coastal visitors. Excellent for autumn promotions, tourism offers, and local retail deals.",
      url: "https://www.rehobothguest.com"
    },
    {
      title: "St. Anthony's Italian Festival",
      category: "Community Heritage Festival",
      date: "June 7 - June 14, 2026",
      location: "Wilmington, DE",
      marketingOpportunity: "Huge local family demographic. Great for local business promotions, restaurant partnerships & sponsorships.",
      url: "https://www.stanthonysfestival.com"
    }
  ] : [
    {
      title: `${stateName} Business & Entrepreneur Expo`,
      category: "Trade Show & Conference",
      date: "Q3 Annual",
      location: `${stateName} Convention Center`,
      marketingOpportunity: "B2B Lead Generation & Networking opportunity for local service providers.",
      url: `https://www.google.com/search?q=${encodeURIComponent(stateName + " business expo 2026")}`
    },
    {
      title: `${stateName} Heritage & Food Festival`,
      category: "Cultural & Community Event",
      date: "Seasonal Annual",
      location: `Major ${stateName} Metropolitan Hubs`,
      marketingOpportunity: "Mass consumer reach for food, beverage, merchandise, and local hospitality brands.",
      url: `https://www.google.com/search?q=${encodeURIComponent(stateName + " festival 2026")}`
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} /> State & Regional Events Radar
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2.5">
            <Calendar className="text-emerald-400" size={24} /> {stateName} Major Events & Seasonal Marketing Windows
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl">
          Foot Traffic Signals ({stateName})
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between transition-all shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                  {evt.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Calendar size={10} /> {evt.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-1">
                {evt.title}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-mono mb-3">
                <MapPin size={12} className="text-emerald-400" /> {evt.location}
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                <strong className="text-emerald-400 block mb-1 font-mono">📢 Marketer Opportunity:</strong>
                {evt.marketingOpportunity}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Official Event Source</span>
              <a
                href={evt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                Event Details <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

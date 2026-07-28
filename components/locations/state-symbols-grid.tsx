"use client";

import { StateFactGroup } from "@/lib/utils/state-facts";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Compass, 
  Sparkles, 
  TreePine, 
  Flower2, 
  Bird, 
  Music, 
  GlassWater, 
  Gem, 
  Bug, 
  Fish, 
  Coins, 
  ShieldCheck
} from "lucide-react";

interface StateSymbolsGridProps {
  stateName: string;
  facts: StateFactGroup;
  symbolsFromDb?: any;
}

export function StateSymbolsGrid({ stateName, facts, symbolsFromDb }: StateSymbolsGridProps) {
  // Merge static verified facts with any dynamic db symbols
  const motto = symbolsFromDb?.motto || facts.motto;
  const mottoTranslation = symbolsFromDb?.mottoTranslation || facts.mottoTranslation;
  const bird = symbolsFromDb?.bird || facts.bird;
  const flower = symbolsFromDb?.flower || facts.flower;
  const tree = symbolsFromDb?.tree || facts.tree;
  const song = symbolsFromDb?.song || facts.song;
  const insect = symbolsFromDb?.insect || facts.insect;
  const fish = symbolsFromDb?.fish || symbolsFromDb?.freshwaterFish || facts.fish || facts.freshwaterFish;
  const mineral = symbolsFromDb?.mineral || facts.mineral;
  const gemstone = symbolsFromDb?.gemstone || facts.gemstone;
  const beverage = symbolsFromDb?.beverage || facts.beverage;
  const quarterYear = symbolsFromDb?.quarterYear || facts.quarterYear || "1999–2008 Series";
  const statehoodRank = symbolsFromDb?.statehoodRank || facts.statehoodRank;

  const mainSymbols = [
    {
      title: "State Bird",
      value: bird,
      icon: Bird,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "State Flower",
      value: flower,
      icon: Flower2,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "State Tree",
      value: tree,
      icon: TreePine,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "State Anthem / Song",
      value: song,
      icon: Music,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "State Beverage",
      value: beverage || "Milk / Water",
      icon: GlassWater,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "State Gemstone / Mineral",
      value: gemstone || mineral || "Quartz / Gold",
      icon: Gem,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "State Insect / Butterfly",
      value: insect || "Honeybee",
      icon: Bug,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    },
    {
      title: "State Fish",
      value: fish || "Bass / Trout",
      icon: Fish,
      color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner: Motto & Statehood Heritage */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
                <Award className="w-3.5 h-3.5 mr-1 inline" /> Official Heritage & Symbols
              </Badge>
              {statehoodRank && (
                <Badge variant="outline" className="border-indigo-500/40 text-indigo-300 font-mono text-xs">
                  {statehoodRank}
                </Badge>
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight italic">
              "{motto}"
            </h3>
            {mottoTranslation && (
              <p className="text-slate-400 text-sm font-medium italic">
                Translation: "{mottoTranslation}"
              </p>
            )}
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 min-w-[220px]">
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Commemorative Quarter</p>
                <p className="text-xs font-black text-slate-200 uppercase">{quarterYear}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Statehood Rank</p>
                <p className="text-xs font-black text-slate-200 uppercase">{facts.statehood}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Emblems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainSymbols.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-950/20 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{item.title}</span>
                <div className={`p-2 rounded-xl border ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-black text-slate-100 tracking-tight leading-snug group-hover:text-cyan-300 transition-colors">
                  {item.value}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

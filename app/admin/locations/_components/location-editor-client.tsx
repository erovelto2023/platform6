"use client";

import { useState } from "react";
import { updateLocationFacts } from "@/lib/actions/location.actions";
import { US_STATE_FACTS, getStateFacts } from "@/lib/utils/state-facts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Building2, 
  Save, 
  MapPin, 
  Globe, 
  Compass, 
  Award, 
  Plus, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Scale,
  Sparkles,
  PhoneCall
} from "lucide-react";

interface LocationEditorClientProps {
  initialStates: any[];
  defaultStateSlug?: string;
}

export function LocationEditorClient({ initialStates, defaultStateSlug }: LocationEditorClientProps) {
  const [selectedStateSlug, setSelectedStateSlug] = useState<string>(
    defaultStateSlug || (initialStates.length > 0 ? initialStates[0].slug : "alabama")
  );
  const [loading, setLoading] = useState(false);

  // Find MongoDB document or fallback
  const dbLocation = initialStates.find(s => s.slug === selectedStateSlug);
  const verifiedFacts = getStateFacts(selectedStateSlug);

  // Form state
  const [formData, setFormData] = useState<any>({
    name: dbLocation?.name || selectedStateSlug.charAt(0).toUpperCase() + selectedStateSlug.slice(1),
    nickname: dbLocation?.nickname || verifiedFacts.nickname,
    postal: dbLocation?.postal || verifiedFacts.abbreviation,
    date: dbLocation?.date || verifiedFacts.statehood,
    website: dbLocation?.website || verifiedFacts.stateWebsite || `https://www.${verifiedFacts.abbreviation.toLowerCase()}.gov`,
    fips: dbLocation?.fips || "01",
    demonym: dbLocation?.demonym || "Resident",
    highest_point: dbLocation?.highest_point || verifiedFacts.highestPoint || "",
    lowest_point: dbLocation?.lowest_point || verifiedFacts.lowestPoint || "",
    capital: {
      name: dbLocation?.capital?.name || verifiedFacts.capital,
    },
    elevation: {
      max_ft: dbLocation?.elevation?.max_ft || "",
      max_m: dbLocation?.elevation?.max_m || "",
      min_ft: dbLocation?.elevation?.min_ft || "",
      min_m: dbLocation?.elevation?.min_m || "",
    },
    area: {
      land_mi: dbLocation?.area?.land_mi || verifiedFacts.landArea,
      land_percent: dbLocation?.area?.land_percent || "97.6",
      water_percent: dbLocation?.area?.water_percent || "2.4",
      total_rank: dbLocation?.area?.total_rank || "20",
    },
    symbols: {
      motto: dbLocation?.symbols?.motto || verifiedFacts.motto,
      mottoTranslation: dbLocation?.symbols?.mottoTranslation || verifiedFacts.mottoTranslation || "",
      statehoodRank: dbLocation?.symbols?.statehoodRank || verifiedFacts.statehoodRank || "",
      bird: dbLocation?.symbols?.bird || verifiedFacts.bird,
      flower: dbLocation?.symbols?.flower || verifiedFacts.flower,
      tree: dbLocation?.symbols?.tree || verifiedFacts.tree,
      song: dbLocation?.symbols?.song || verifiedFacts.song,
      beverage: dbLocation?.symbols?.beverage || verifiedFacts.beverage || "",
      gemstone: dbLocation?.symbols?.gemstone || verifiedFacts.gemstone || "",
      mineral: dbLocation?.symbols?.mineral || verifiedFacts.mineral || "",
      insect: dbLocation?.symbols?.insect || verifiedFacts.insect || "",
      fish: dbLocation?.symbols?.fish || verifiedFacts.fish || "",
      quarterYear: dbLocation?.symbols?.quarterYear || verifiedFacts.quarterYear || "",
      sosUrl: dbLocation?.symbols?.sosUrl || verifiedFacts.sosUrl || `https://sos.${verifiedFacts.abbreviation.toLowerCase()}.gov`,
      taxDeptUrl: dbLocation?.symbols?.taxDeptUrl || verifiedFacts.taxDeptUrl || `https://revenue.${verifiedFacts.abbreviation.toLowerCase()}.gov`,
    },
    areaCodes: dbLocation?.areaCodes || (verifiedFacts.areaCodesRange ? verifiedFacts.areaCodesRange.split(", ") : []),
    zipCodes: dbLocation?.zipCodes || (verifiedFacts.zipCodesRange ? verifiedFacts.zipCodesRange.split(" – ") : []),
    extendedFacts: dbLocation?.extendedFacts || []
  });

  // Switch selected state
  const handleStateSelect = (slug: string) => {
    setSelectedStateSlug(slug);
    const loc = initialStates.find(s => s.slug === slug);
    const facts = getStateFacts(slug);
    
    setFormData({
      name: loc?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      nickname: loc?.nickname || facts.nickname,
      postal: loc?.postal || facts.abbreviation,
      date: loc?.date || facts.statehood,
      website: loc?.website || facts.stateWebsite || `https://www.${facts.abbreviation.toLowerCase()}.gov`,
      fips: loc?.fips || "01",
      demonym: loc?.demonym || "Resident",
      highest_point: loc?.highest_point || facts.highestPoint || "",
      lowest_point: loc?.lowest_point || facts.lowestPoint || "",
      capital: {
        name: loc?.capital?.name || facts.capital,
      },
      elevation: {
        max_ft: loc?.elevation?.max_ft || "",
        max_m: loc?.elevation?.max_m || "",
        min_ft: loc?.elevation?.min_ft || "",
        min_m: loc?.elevation?.min_m || "",
      },
      area: {
        land_mi: loc?.area?.land_mi || facts.landArea,
        land_percent: loc?.area?.land_percent || "97.6",
        water_percent: loc?.area?.water_percent || "2.4",
        total_rank: loc?.area?.total_rank || "20",
      },
      symbols: {
        motto: loc?.symbols?.motto || facts.motto,
        mottoTranslation: loc?.symbols?.mottoTranslation || facts.mottoTranslation || "",
        statehoodRank: loc?.symbols?.statehoodRank || facts.statehoodRank || "",
        bird: loc?.symbols?.bird || facts.bird,
        flower: loc?.symbols?.flower || facts.flower,
        tree: loc?.symbols?.tree || facts.tree,
        song: loc?.symbols?.song || facts.song,
        beverage: loc?.symbols?.beverage || facts.beverage || "",
        gemstone: loc?.symbols?.gemstone || facts.gemstone || "",
        mineral: loc?.symbols?.mineral || facts.mineral || "",
        insect: loc?.symbols?.insect || facts.insect || "",
        fish: loc?.symbols?.fish || facts.fish || "",
        quarterYear: loc?.symbols?.quarterYear || facts.quarterYear || "",
        sosUrl: loc?.symbols?.sosUrl || facts.sosUrl || `https://sos.${facts.abbreviation.toLowerCase()}.gov`,
        taxDeptUrl: loc?.symbols?.taxDeptUrl || facts.taxDeptUrl || `https://revenue.${facts.abbreviation.toLowerCase()}.gov`,
      },
      areaCodes: loc?.areaCodes || (facts.areaCodesRange ? facts.areaCodesRange.split(", ") : []),
      zipCodes: loc?.zipCodes || (facts.zipCodesRange ? facts.zipCodesRange.split(" – ") : []),
      extendedFacts: loc?.extendedFacts || []
    });
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleAddExtendedFact = () => {
    setFormData((prev: any) => ({
      ...prev,
      extendedFacts: [...(prev.extendedFacts || []), { label: "", value: "" }]
    }));
  };

  const handleRemoveExtendedFact = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      extendedFacts: prev.extendedFacts.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleExtendedFactChange = (index: number, key: 'label' | 'value', value: string) => {
    setFormData((prev: any) => {
      const updated = [...prev.extendedFacts];
      updated[index][key] = value;
      return { ...prev, extendedFacts: updated };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updateLocationFacts(selectedStateSlug, 'state', formData);
      if (res.success) {
        toast.success(res.message || `Saved facts for ${formData.name}`);
      } else {
        toast.error(res.error || "Failed to update state facts");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* State Selector & Header Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" /> Admin State Facts Override Engine
            </Badge>
          </div>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
            Editing {formData.name} ({formData.postal})
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manually update symbols, elevations, government URLs, and facts stored in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedStateSlug}
            onChange={(e) => handleStateSelect(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 uppercase tracking-wider cursor-pointer"
          >
            {Object.keys(US_STATE_FACTS).sort().map(slug => (
              <option key={slug} value={slug}>
                {US_STATE_FACTS[slug].abbreviation} - {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </option>
            ))}
          </select>

          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase text-xs tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save State Facts"}
          </Button>

          <a 
            href={`/locations/${selectedStateSlug}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            title="View Public Page"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Editor Tabbed Interface */}
      <Tabs defaultValue="symbols" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl mb-8 flex-wrap h-auto gap-2">
          <TabsTrigger value="symbols" className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <Award className="w-3.5 h-3.5 mr-1.5 inline" /> Symbols & Heritage
          </TabsTrigger>
          <TabsTrigger value="geography" className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <Compass className="w-3.5 h-3.5 mr-1.5 inline" /> Topography & Elevation
          </TabsTrigger>
          <TabsTrigger value="portals" className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <Globe className="w-3.5 h-3.5 mr-1.5 inline" /> Government URLs & Portals
          </TabsTrigger>
          <TabsTrigger value="telecom" className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <PhoneCall className="w-3.5 h-3.5 mr-1.5 inline" /> Postal & Telecom
          </TabsTrigger>
          <TabsTrigger value="extended" className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            <Plus className="w-3.5 h-3.5 mr-1.5 inline" /> Custom Extended Facts
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Symbols */}
        <TabsContent value="symbols" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Motto</Label>
              <Input 
                value={formData.symbols.motto || ""}
                onChange={(e) => handleNestedChange("symbols", "motto", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Motto English Translation</Label>
              <Input 
                value={formData.symbols.mottoTranslation || ""}
                onChange={(e) => handleNestedChange("symbols", "mottoTranslation", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Statehood Order / Rank</Label>
              <Input 
                value={formData.symbols.statehoodRank || ""}
                onChange={(e) => handleNestedChange("symbols", "statehoodRank", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="e.g. 22nd State"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Bird</Label>
              <Input 
                value={formData.symbols.bird || ""}
                onChange={(e) => handleNestedChange("symbols", "bird", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Flower</Label>
              <Input 
                value={formData.symbols.flower || ""}
                onChange={(e) => handleNestedChange("symbols", "flower", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Tree</Label>
              <Input 
                value={formData.symbols.tree || ""}
                onChange={(e) => handleNestedChange("symbols", "tree", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Song / Anthem</Label>
              <Input 
                value={formData.symbols.song || ""}
                onChange={(e) => handleNestedChange("symbols", "song", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Beverage</Label>
              <Input 
                value={formData.symbols.beverage || ""}
                onChange={(e) => handleNestedChange("symbols", "beverage", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Gemstone</Label>
              <Input 
                value={formData.symbols.gemstone || ""}
                onChange={(e) => handleNestedChange("symbols", "gemstone", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Mineral</Label>
              <Input 
                value={formData.symbols.mineral || ""}
                onChange={(e) => handleNestedChange("symbols", "mineral", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Insect / Butterfly</Label>
              <Input 
                value={formData.symbols.insect || ""}
                onChange={(e) => handleNestedChange("symbols", "insect", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Commemorative Quarter Year</Label>
              <Input 
                value={formData.symbols.quarterYear || ""}
                onChange={(e) => handleNestedChange("symbols", "quarterYear", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Geography & Elevation */}
        <TabsContent value="geography" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Highest Natural Point Name & Altitude</Label>
              <Input 
                value={formData.highest_point || ""}
                onChange={(e) => setFormData({ ...formData, highest_point: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="e.g. Cheaha Mountain: 2,413 ft (735 m)"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Lowest Natural Point Name & Altitude</Label>
              <Input 
                value={formData.lowest_point || ""}
                onChange={(e) => setFormData({ ...formData, lowest_point: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="e.g. Gulf of Mexico: 0 ft (0 m)"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Total Territory Land Area</Label>
              <Input 
                value={formData.area.land_mi || ""}
                onChange={(e) => handleNestedChange("area", "land_mi", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="e.g. 52,420 sq mi"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Water Mass Share %</Label>
              <Input 
                value={formData.area.water_percent || ""}
                onChange={(e) => handleNestedChange("area", "water_percent", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="e.g. 2.4%"
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Government URLs & Portals */}
        <TabsContent value="portals" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Official State Portal URL</Label>
              <Input 
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="https://www.alabama.gov"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Secretary of State (SOS) Filing URL</Label>
              <Input 
                value={formData.symbols.sosUrl || ""}
                onChange={(e) => handleNestedChange("symbols", "sosUrl", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="https://www.sos.alabama.gov"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Department of Revenue (Tax) URL</Label>
              <Input 
                value={formData.symbols.taxDeptUrl || ""}
                onChange={(e) => handleNestedChange("symbols", "taxDeptUrl", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
                placeholder="https://revenue.alabama.gov"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State Capital City Name</Label>
              <Input 
                value={formData.capital.name || ""}
                onChange={(e) => handleNestedChange("capital", "name", e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Telecom & Postal Identifiers */}
        <TabsContent value="telecom" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Postal Abbreviation</Label>
              <Input 
                value={formData.postal || ""}
                onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">State FIPS Code</Label>
              <Input 
                value={formData.fips || ""}
                onChange={(e) => setFormData({ ...formData, fips: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Area Codes (Comma Separated)</Label>
              <Input 
                value={Array.isArray(formData.areaCodes) ? formData.areaCodes.join(", ") : formData.areaCodes || ""}
                onChange={(e) => setFormData({ ...formData, areaCodes: e.target.value.split(",").map(s => s.trim()) })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono font-bold text-slate-300 uppercase">Zip Code Range (Comma or Dash Separated)</Label>
              <Input 
                value={Array.isArray(formData.zipCodes) ? formData.zipCodes.join(" – ") : formData.zipCodes || ""}
                onChange={(e) => setFormData({ ...formData, zipCodes: e.target.value.split("–").map(s => s.trim()) })}
                className="bg-slate-950 border-slate-800 text-slate-100 text-sm font-medium"
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 5: Extended Custom Facts */}
        <TabsContent value="extended" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight">Custom Key-Value State Facts</h4>
              <p className="text-xs text-slate-400">Add arbitrary custom state facts that display on the public state page.</p>
            </div>
            <Button 
              type="button"
              onClick={handleAddExtendedFact}
              variant="outline"
              className="border-slate-700 hover:border-cyan-500 text-slate-200 text-xs font-mono font-bold uppercase"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Fact Field
            </Button>
          </div>

          {formData.extendedFacts.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs font-mono uppercase">
              No custom extended facts added yet. Click "+ Add Fact Field" above.
            </div>
          ) : (
            <div className="space-y-3">
              {formData.extendedFacts.map((fact: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input 
                    value={fact.label}
                    onChange={(e) => handleExtendedFactChange(idx, "label", e.target.value)}
                    placeholder="Fact Label (e.g. State Folk Dance)"
                    className="bg-slate-950 border-slate-800 text-slate-100 text-xs font-medium w-1/3"
                  />
                  <Input 
                    value={fact.value}
                    onChange={(e) => handleExtendedFactChange(idx, "value", e.target.value)}
                    placeholder="Fact Value (e.g. Square Dance)"
                    className="bg-slate-950 border-slate-800 text-slate-100 text-xs font-medium flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={() => handleRemoveExtendedFact(idx)}
                    variant="ghost"
                    className="text-slate-500 hover:text-rose-400 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

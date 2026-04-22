import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocation, getCitiesByState, syncHospitalData, syncEducationalInstitutions } from "@/lib/actions/location.actions";
import { MapPin, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Search } from "@/components/ui/Search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { getDirectoryProducts } from "@/lib/actions/directory-product.actions";
import RotatingAffiliateBanner from "@/components/glossary/RotatingAffiliateBanner";
import { StateEducationSection } from "@/components/locations/state-education-section";
import { StateHealthcareSection } from "@/components/locations/state-healthcare-section";
import { TaxDirectoryList } from "@/components/locations/tax-directory-list";
import { getCPAsByState } from "@/lib/actions/cpa.actions";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { StatePopulationStats } from "@/components/locations/state-population-stats";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ stateSlug: string }>;
}): Promise<Metadata> {
    const { stateSlug } = await params;
    const state = await getLocation(stateSlug);
    
    if (!state) return { title: 'State Not Found' };

    return {
        title: `${state.name} Business Map | K Business Academy`,
        description: `Everything you need to start a business in ${state.name}. We've collected the best data on cities, schools, hospitals, and taxes for you.`,
        openGraph: {
            title: `${state.name} Business Map`,
            description: `Unlock business insights for ${state.name}.`,
        }
    };
}

// Massive requested state facts array
const STATE_FACTS = [
        "State Capital",
        "State Flag",
        "State Seal",
        "State Motto",
        "State Nickname",
        "State Song",
        "State Colors",
        "State Bird",
        "State Mammal",
        "State Fish",
        "State Insect",
        "State Butterfly",
        "State Reptile",
        "State Amphibian",
        "State Crustacean",
        "State Mollusk",
        "State Fossil",
        "State Flower",
        "State Tree",
        "State Grass",
        "State Plant",
        "State Shrub",
        "State Wildflower",
        "State Gemstone",
        "State Mineral",
        "State Rock",
        "State Stone",
        "State Soil",
        "State Fruit",
        "State Vegetable",
        "State Grain",
        "State Herb",
        "State Nut",
        "State Beverage",
        "State Food",
        "State Dish",
        "State Pie",
        "State Dessert",
        "State Snack",
        "State Dance",
        "State Folk Dance",
        "State Musical Instrument",
        "State Sport",
        "State Game",
        "State Theater",
        "State Film",
        "State Poem",
        "State Literature",
        "State Artwork",
        "State Tartan",
        "State Fabric",
        "State Dinosaur",
        "State Prehistoric Animal",
        "State Microbe",
        "State Mushroom",
        "State Lichen",
        "State Moss",
        "State Shell",
        "State Star",
        "State Route",
        "State Highway",
        "State Ship",
        "State Firearm",
        "State Toy",
        "State Coin",
        "State Currency",
        "State Airplane",
        "State Railroad",
        "State Dog",
        "State Horse",
        "State Cat",
        "State Bear",
        "State Wolf",
        "State Bison",
        "State Deer",
        "State Whale",
        "State Marine Mammal",
        "State Raptor",
        "State Waterfowl",
        "State Game Bird",
        "State Freshwater Fish",
        "State Saltwater Fish",
        "State Butterfly (additional)",
        "State Spider",
        "State Scorpion",
        "State Snake",
        "State Turtle",
        "State Crocodilian",
        "State Dinosaur Species",
        "State Historic Event",
        "State Historic Site",
        "State Landmark",
        "State Park",
        "State Forest",
        "State River",
        "State Lake",
        "State Mountain",
        "State Cave",
        "State Waterfall",
        "State Beach",
        "State Trail",
        "State Scenic Byway",
        "State Festival",
        "State Fair",
        "State Holiday",
        "State Day",
        "State Week",
        "State Month",
        "State Season",
        "State Motto (Latin)",
        "State Pledge",
        "State Oath",
        "State Prayer",
        "State Hymn",
        "State Lullaby",
        "State March",
        "State Polka",
        "State Jazz Piece",
        "State Country Song",
        "State Rock Song",
        "State Folk Song",
        "State Children's Song",
        "State Anthem (alternative)",
        "State Official Language",
        "State Second Language",
        "State Sign Language",
        "State Alphabet",
        "State Numeral",
        "State Mathematical Concept",
        "State Scientific Discovery",
        "State Invention",
        "State Industry",
        "State Agricultural Product",
        "State Dairy Product",
        "State Cheese",
        "State Ice Cream",
        "State Candy",
        "State Chocolate",
        "State Coffee",
        "State Tea",
        "State Beer",
        "State Wine",
        "State Cocktail",
        "State Bread",
        "State Pancake",
        "State Waffle",
        "State Cookie",
        "State Cake",
        "State Pastry",
        "State Sandwich",
        "State Pizza",
        "State Taco",
        "State Burrito",
        "State Chili",
        "State Soup",
        "State Salad",
        "State Sauce",
        "State Condiment",
        "State Spice",
        "State Pepper",
        "State Bean",
        "State Potato",
        "State Tomato",
        "State Onion",
        "State Garlic",
        "State Mushroom (culinary)",
        "State Berry",
        "State Citrus",
        "State Melon",
        "State Stone Fruit",
        "State Tropical Fruit",
        "State Dried Fruit",
        "State Juice",
        "State Smoothie",
        "State Milk (type)",
        "State Yogurt",
        "State Butter",
        "State Oil",
        "State Vinegar",
        "State Honey",
        "State Syrup",
        "State Jam",
        "State Jelly",
        "State Pickle",
        "State Sauerkraut",
        "State Kimchi",
        "State Salsa",
        "State Guacamole",
        "State Hummus",
        "State Dip",
        "State Spread",
        "State Topping",
        "State Filling",
        "State Crust",
        "State Dough",
        "State Batter",
        "State Frosting",
        "State Icing",
        "State Glaze",
        "State Sprinkle",
        "State Chip",
        "State Cracker",
        "State Pretzel",
        "State Popcorn",
        "State Nut Mix",
        "State Trail Mix",
        "State Granola",
        "State Cereal",
        "State Oatmeal",
        "State Porridge",
        "State Grits",
        "State Polenta",
        "State Couscous",
        "State Quinoa",
        "State Rice",
        "State Pasta",
        "State Noodle",
        "State Dumpling",
        "State Empanada",
        "State Samosa",
        "State Spring Roll",
        "State Sushi",
        "State Ramen",
        "State Pho",
        "State Curry",
        "State Stir Fry",
        "State Kebob",
        "State BBQ",
        "State Brisket",
        "State Ribs",
        "State Pulled Pork",
        "State Fried Chicken",
        "State Roast",
        "State Steak",
        "State Burger",
        "State Hot Dog",
        "State Sausage",
        "State Bacon",
        "State Ham",
        "State Turkey",
        "State Duck",
        "State Goose",
        "State Quail",
        "State Pheasant",
        "State Grouse",
        "State Ptarmigan",
        "State Partridge",
        "State Dove",
        "State Pigeon",
        "State Swan",
        "State Crane",
        "State Heron",
        "State Egret",
        "State Ibis",
        "State Spoonbill",
        "State Flamingo",
        "State Pelican",
        "State Cormorant",
        "State Loon",
        "State Grebe",
        "State Albatross",
        "State Petrel",
        "State Shearwater",
        "State Tern",
        "State Gull",
        "State Skimmer",
        "State Jaeger",
        "State Skua",
        "State Auk",
        "State Murre",
        "State Puffin",
        "State Guillemot",
        "State Murrelet",
        "State Kittiwake",
        "State Phalarope",
        "State Sandpiper",
        "State Plover",
        "State Oystercatcher",
        "State Avocet",
        "State Stilts",
        "State Lapwing",
        "State Dotterel",
        "State Courser",
        "State Pratincole",
        "State Thicknee",
        "State Stone Curlew",
        "State Bustard",
        "State Buttonquail",
        "State Megapode",
        "State Curassow",
        "State Guan",
        "State Chachalaca",
        "State Tinamou",
        "State Cassowary",
        "State Emu",
        "State Kiwi",
        "State Ostrich",
        "State Rhea",
        "State Penguin",
        "State Loon (additional)",
        "State Grebe (additional)",
        "State Cormorant (additional)",
        "State Anhinga",
        "State Frigatebird",
        "State Booby",
        "State Gannet",
        "State Tropicbird",
        "State Storm Petrel",
        "State Diving Petrel",
        "State Fairy Prion",
        "State Broad-billed Prion",
        "State Antarctic Prion",
        "State Slender-billed Prion",
        "State Fairy Tern",
        "State Noddy",
        "State Brown Noddy",
        "State Black Noddy",
        "State Blue-gray Noddy",
        "State White Tern",
        "State Crested Tern",
        "State Sandwich Tern",
        "State Royal Tern",
        "State Elegant Tern",
        "State Least Tern",
        "State Roseate Tern",
        "State Arctic Tern",
        "State Common Tern",
        "State Forster's Tern",
        "State Caspian Tern",
        "State Gull-billed Tern",
        "State Black Skimmer",
        "State Laughing Gull",
        "State Franklin's Gull",
        "State Bonaparte's Gull",
        "State Little Gull",
        "State Ross's Gull",
        "State Ivory Gull",
        "State Sabine's Gull",
        "State Black-legged Kittiwake",
        "State Red-legged Kittiwake",
        "State Mew Gull",
        "State Ring-billed Gull",
        "State California Gull",
        "State Herring Gull",
        "State American Herring Gull",
        "State European Herring Gull",
        "State Lesser Black-backed Gull",
        "State Great Black-backed Gull",
        "State Kelp Gull",
        "State Glaucous Gull",
        "State Iceland Gull",
        "State Thayer's Gull",
        "State Glaucous-winged Gull",
        "State Western Gull",
        "State Yellow-footed Gull",
        "State Heermann's Gull",
        "State Franklin's Gull (additional)",
        "State Swallow-tailed Gull",
        "State Lava Gull",
        "State Dolphin Gull",
        "State Gray Gull",
        "State Belcher's Gull",
        "State Olrog's Gull",
        "State Atlantic Yellow-nosed Albatross",
        "State Black-browed Albatross",
        "State Shy Albatross",
        "State Campbell Albatross",
        "State Grey-headed Albatross",
        "State Light-mantled Albatross",
        "State Salvin's Albatross",
        "State Chatham Albatross",
        "State Buller's Albatross",
        "State White-capped Albatross",
        "State Shy Albatross (additional)",
        "State Wandering Albatross",
        "State Royal Albatross",
        "State Northern Royal Albatross",
        "State Southern Royal Albatross",
        "State Laysan Albatross",
        "State Black-footed Albatross",
        "State Short-tailed Albatross",
        "State Sooty Albatross",
        "State Light-mantled Albatross (additional)",
        "State Atlantic Petrel",
        "State Bermuda Petrel",
        "State Black-capped Petrel",
        "State Cook's Petrel",
        "State Stejneger's Petrel",
        "State Herald Petrel",
        "State Murphy's Petrel",
        "State Phoenix Petrel",
        "State Kermadec Petrel",
        "State Juan Fernandez Petrel",
        "State White-necked Petrel",
        "State Barau's Petrel",
        "State Mottled Petrel",
        "State Black-winged Petrel",
        "State Collared Petrel",
        "State Tahiti Petrel",
        "State Providence Petrel",
        "State Gould's Petrel",
        "State Chatham Petrel",
        "State Magenta Petrel",
        "State Pycroft's Petrel",
        "State Parkinson's Petrel"
];

export default async function StatePage({
    params,
    searchParams,
}: {
    params: Promise<{ stateSlug: string }>;
    searchParams: Promise<{ query?: string }>;
}) {
    const { stateSlug } = await params;
    const { query } = await searchParams;
    
    let state = await getLocation(stateSlug);

    if (!state) {
        notFound();
    }
    
    console.log(`[DEBUG] Loaded state ${state.name}. Extended facts count: ${state.extendedFacts?.length || 0}`);

    // TEMPORARILY DISABLE HOSPITAL SYNC TO FIX OTHER TABS
    // The hospital sync is causing database validation errors that break the entire page
    console.log(`[DEBUG] Hospital sync temporarily disabled to fix other tabs`);
    
    // Get hospital data using raw MongoDB to bypass Mongoose issues (Next.js caching)
    let hospitals = [];
    let mongoState = null;
    try {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        await client.connect();
        const db = client.db();
        const locations = db.collection('locations');
        
        mongoState = await locations.findOne({ slug: stateSlug, type: 'state' });
        if (mongoState?.hospitals && Array.isArray(mongoState.hospitals)) {
            hospitals = mongoState.hospitals;
            console.log(`[DEBUG] Found ${hospitals.length} hospitals using raw MongoDB for ${stateSlug}`);
        }
        
        await client.close();
    } catch (error) {
        console.error(`[DEBUG] Error getting hospitals with raw MongoDB:`, error);
    }

    const cities = await getCitiesByState(stateSlug, query);

const uniqueLabels = Array.from(new Set([
    ...STATE_FACTS,
    ...(state.extendedFacts ? state.extendedFacts.map((f: any) => f.label) : [])
]));

    // Create a dummy mapping of lowercase labels to available data, if needed
    // Otherwise fallback to "Not Specified"
    const getFieldValue = (label: string, state: any) => {
        if (label === "State Capital" && state.capital?.name) return state.capital.name;
        if (label === "State Motto" && state.symbols?.motto) return state.symbols.motto;
        if (label === "State Nickname" && state.nickname) return state.nickname;
        if (label === "State Song" && state.symbols?.song) return state.symbols.song;
        if (label === "State Bird" && state.symbols?.bird) return state.symbols.bird;
        if (label === "State Flower" && state.symbols?.flower) return state.symbols.flower;
        if (label === "State Tree" && state.symbols?.tree) return state.symbols.tree;
        
        // For custom mapped extendedFacts dynamically added in the future:
        if (state.extendedFacts) {
            const found = state.extendedFacts.find((f: any) => f.label === label);
            if (found && found.value) return found.value;
        }
        
        return "Not Specified";
    };

    const stateDoc = await getLocation(stateSlug, "");
    const { products } = await getDirectoryProducts();
    const stateCPAs = await getCPAsByState(state.name);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Top Navigation Bar */}
            <SiteHeader />

            <main className="flex-1 mt-16 pb-20">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-20 bg-[#fefae0] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#606c38]/5" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <Link 
                            href="/locations"
                            className="inline-flex items-center gap-2 text-[#283618]/50 hover:text-[#283618] transition-all mb-8 font-black uppercase tracking-[0.3em] text-[10px] group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to States
                        </Link>
                        <div className="text-left max-w-4xl">
                            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 text-[#283618] uppercase leading-tight" suppressHydrationWarning>
                                {state.name} <span className="text-emerald-700/60 underline decoration-emerald-500 decoration-8 underline-offset-8">Business Map</span>
                            </h1>
                            <p className="text-[#283618]/60 text-lg md:text-2xl mb-12 font-medium max-w-2xl leading-relaxed" suppressHydrationWarning>
                                Find everything you need to start a business in {state.name}. We've collected the best data on cities, schools, hospitals, and taxes for you.
                            </p>
                            
                            <div className="max-w-xl" suppressHydrationWarning>
                                <Suspense fallback={<div className="h-12 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />}>
                                    <Search placeholder={`Search cities in ${state.name}...`} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Market & State Details Section */}
                <section className="w-full py-12 bg-[#fefae0] min-h-[600px]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="bg-[#283618]/5 border-2 border-[#283618]/10 p-1.5 rounded-2xl mb-12 w-full md:w-fit justify-start flex-wrap h-auto">
                                <TabsTrigger value="details" className="px-8 py-3 rounded-xl data-[state=active]:bg-[#283618] data-[state=active]:text-[#fefae0] uppercase font-black text-[10px] tracking-[0.2em] text-[#283618]/40 hover:text-[#283618] transition-all">
                                    State Details
                                </TabsTrigger>
                                <TabsTrigger value="cities" className="px-8 py-3 rounded-xl data-[state=active]:bg-[#283618] data-[state=active]:text-[#fefae0] uppercase font-black text-[10px] tracking-[0.2em] text-[#283618]/40 hover:text-[#283618] transition-all">
                                    Market Cities
                                </TabsTrigger>
                                {(state as any).educationalInstitutions?.length > 0 && (
                                    <TabsTrigger value="education" className="px-8 py-3 rounded-xl data-[state=active]:bg-[#283618] data-[state=active]:text-[#fefae0] uppercase font-black text-[10px] tracking-[0.2em] text-[#283618]/40 hover:text-[#283618] transition-all">
                                        Education
                                    </TabsTrigger>
                                )}
                                {(hospitals.length > 0 || (state as any).hospitalStats) && (
                                    <TabsTrigger value="healthcare" className="px-8 py-3 rounded-xl data-[state=active]:bg-[#283618] data-[state=active]:text-[#fefae0] uppercase font-black text-[10px] tracking-[0.2em] text-[#283618]/40 hover:text-[#283618] transition-all">
                                        Healthcare
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="taxhub" className="px-8 py-3 rounded-xl data-[state=active]:bg-[#283618] data-[state=active]:text-[#fefae0] uppercase font-black text-[10px] tracking-[0.2em] text-[#283618]/40 hover:text-[#283618] transition-all">
                                    Tax & Accounting
                                </TabsTrigger>
                                {state.detailedPopulation && (
                                    <TabsTrigger value="demographics" className="px-8 py-3 rounded-xl data-[state=active]:bg-[#283618] data-[state=active]:text-[#fefae0] uppercase font-black text-[10px] tracking-[0.2em] text-[#283618]/40 hover:text-[#283618] transition-all">
                                        Demographics
                                    </TabsTrigger>
                                )}
                            </TabsList>

                             {/* State Details Tab Content */}
                            <TabsContent value="details" className="space-y-8 w-full max-w-full" suppressHydrationWarning>
                                <div className="flex items-center justify-between border-l-8 border-[#606c38] pl-6 mb-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-[#283618] uppercase tracking-tight">Important State Facts</h2>
                                        <p className="text-[#283618]/50 text-[11px] font-black uppercase tracking-[0.2em] mt-1 space-x-2"><span>• Symbols</span> <span>• Heritage</span> <span>• Key Info</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                                    {uniqueLabels.map((label, idx) => {
                                        const val = getFieldValue(label, state);
                                        if (val === "Not Specified") return null;
                                        
                                        return (
                                            <div key={label + idx} className="bg-white border-2 border-[#283618]/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#606c38]/20 transition-all hover:shadow-lg hover:shadow-[#283618]/5">
                                                <div className="text-[10px] font-black uppercase text-[#606c38] tracking-widest mb-3">{label}</div>
                                                <div className="text-base font-bold text-[#283618]" suppressHydrationWarning>
                                                    {val}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </TabsContent>

                             <TabsContent value="cities" className="space-y-8">
                                <div className="flex items-center justify-between mb-8 border-l-8 border-[#283618] pl-6">
                                    <h2 className="text-3xl font-black text-[#283618] uppercase tracking-tight">
                                        {query ? `Results for "${query}"` : 'The Best Cities to Visit'}
                                    </h2>
                                    <span className="text-[#283618] text-[10px] font-black uppercase tracking-widest bg-[#283618]/5 px-4 py-2 rounded-xl">
                                        {cities.length} Cities in the System
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {cities.map((city: any) => (
                                        <Link 
                                            key={city.slug}
                                            href={`/locations/${stateSlug}/${city.slug}`}
                                            className="group relative overflow-hidden bg-white border-2 border-[#283618]/5 hover:bg-[#283618]/5 p-8 rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-[#283618]/5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#606c38]/10 flex items-center justify-center text-[#606c38] group-hover:bg-[#606c38] group-hover:text-white transition-all duration-300">
                                                        <MapPin size={24} />
                                                    </div>
                                                    <span className="font-black text-[#283618] text-lg group-hover:text-[#606c38] transition-colors leading-tight">
                                                        {city.name}
                                                    </span>
                                                </div>
                                                <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-all text-[#606c38] -translate-x-2 group-hover:translate-x-0" size={18} />
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>
                                
                                {cities.length === 0 && (
                                    <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-300 bg-slate-50 rounded-[2rem] text-center">
                                        <SearchIcon className="h-12 w-12 text-slate-700 mb-4" />
                                        <h2 className="text-xl font-bold text-slate-500 uppercase italic">No Cities Found</h2>
                                        <p className="text-slate-600 mt-2 max-w-sm text-sm">
                                            We couldn't find any cities matching your search.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                            {/* Education Tab */}
                            {(state as any).educationalInstitutions?.length > 0 && (
                                <TabsContent value="education" className="space-y-8">
                                    <StateEducationSection
                                        institutions={(state as any).educationalInstitutions}
                                        stateName={state.name}
                                    />
                                </TabsContent>
                            )}
                            {/* Healthcare Tab */}
                            {(hospitals.length > 0 || (mongoState as any)?.hospitalStats) && (
                                <TabsContent value="healthcare" className="space-y-8">
                                    <StateHealthcareSection
                                        hospitals={hospitals}
                                        stats={(mongoState as any)?.hospitalStats || (state as any).hospitalStats}
                                        stateName={state.name}
                                    />
                                </TabsContent>
                            )}
                            {/* Tax Hub Tab Content */}
                            <TabsContent value="taxhub" className="space-y-8">
                                <div className="flex items-center justify-between mb-8 border-l-8 border-[#606c38] pl-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-[#283618] uppercase tracking-tight italic">Verified CPAs in {state.name}</h2>
                                        <p className="text-[#283618]/50 text-[11px] font-black uppercase tracking-[0.2em] mt-1 italic">Professional Help in Your Area</p>
                                    </div>
                                </div>
                                <TaxDirectoryList 
                                    listings={stateCPAs} 
                                    cityName={state.name} 
                                    stateName={state.name} 
                                />
                            </TabsContent>
                            {/* Demographics Tab Content */}
                            {state.detailedPopulation && (
                                <TabsContent value="demographics" className="space-y-8">
                                    <StatePopulationStats 
                                        data={state.detailedPopulation as any} 
                                        raceData={state.racePopulation as any}
                                        stateName={state.name} 
                                    />
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 bg-[#283618] text-[#fefae0]/40 border-t border-[#fefae0]/5">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest italic" suppressHydrationWarning>
                        © 2026 K Business Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

"use server";

import dbConnect from "@/lib/db/connect";
import CPAListing from "@/lib/db/models/CPAListing";

const STATE_MAP: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

function normalizeState(state: string): string {
  if (state.length === 2) return state.toUpperCase();
  // Standardize Title Case
  const formatted = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  return STATE_MAP[formatted] || state;
}

export async function getCPAsByLocation(city: string, state: string) {
  try {
    await dbConnect();
    
    const normalizedState = normalizeState(state);
    
    // Perform a case-insensitive search for city and state
    const listings = await CPAListing.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
      state: { $regex: new RegExp(`^${normalizedState}$`, "i") },
    })
    .sort({ name: 1 })
    .lean();

    return JSON.parse(JSON.stringify(listings));
  } catch (error) {
    console.error("Failed to fetch CPAs:", error);
    return [];
  }
}

export async function getCPAsByState(state: string) {
  try {
    await dbConnect();
    
    const normalizedState = normalizeState(state);
    
    const listings = await CPAListing.find({
      state: { $regex: new RegExp(`^${normalizedState}$`, "i") },
    })
    .sort({ city: 1, name: 1 })
    .limit(100)
    .lean();

    return JSON.parse(JSON.stringify(listings));
  } catch (error) {
    console.error("Failed to fetch CPAs by state:", error);
    return [];
  }
}

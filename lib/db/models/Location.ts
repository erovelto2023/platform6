import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    name: string;
    slug: string;
    type: 'state' | 'city';
    stateSlug?: string; // Parent state slug for cities
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    image?: string;
    zipCodes?: string[];
    areaCodes?: string[];
    timezone?: string;
    // Comprehensive state data matching the JSON template
    postal?: string;
    capital?: {
        name: string;
        latitude?: string;
        longitude?: string;
    };
    date?: string; // Statehood date
    population?: {
        density_km?: string;
        total?: string;
        density_mi?: string;
    };
    nickname?: string;
    fips?: string;
    demonym?: string;
    cities?: Array<{
        name: string;
        population?: string;
    }>;
    lowest_point?: string;
    highest_point?: string;
    elevation?: {
        min_ft?: string;
        min_m?: string;
        mean_ft?: string;
        max_rank?: string;
        max_ft?: string;
        span_ft?: string;
        mean_rank?: string;
        span_m?: string;
        mean_m?: string;
        max_m?: string;
    };
    area?: {
        total_mi?: string;
        land_rank?: string;
        land_km?: string;
        water_rank?: string;
        total_rank?: string;
        land_mi?: string;
        water_km?: string;
        total_km?: string;
        land_percent?: string;
        water_mi?: string;
        water_percent?: string;
    };
    website?: string;
    per_capita_income?: string;
    median_household_income?: string;
    status?: string;
    other_nicknames?: string[];
    standard_federal_region?: string;
    census_bureau?: {
        region?: string;
        division?: string;
    };
    ap_abbreviation?: string;
    gpo_abbreviation?: string;
    representatives?: string;
    time_zones?: string[];
    koppen_climate?: string[];
    motto?: string;
    symbols?: {
        song?: string;
        tartan?: string;
        tree?: string;
        folk_dance?: string;
        hero?: string;
        fossil?: string;
        flower?: string;
        shellfish?: string;
        childrens_flower?: string;
        bird?: string;
        fish?: string;
        insect?: string;
        heroine?: string;
        dinosaur?: string;
        mineral?: string;
        polka?: string;
    };
    subdivisions?: string[];
    extendedFacts?: Array<{
        label: string;
        value: string;
    }>;
    // Legislative data for business intelligence
    legislativeData?: {
        jurisdictionId?: string;
        legislators: Array<{
            name: string;
            party?: string;
            chamber?: string;
            district?: string;
            email?: string;
            phone?: string;
            photo?: string;
            url?: string;
        }>;
        recentBills: Array<{
            identifier: string;
            title: string;
            status?: string;
            lastActionDate?: string;
            url?: string;
            subjects?: string[];
        }>;
    };
    newspapers?: Array<{
        name: string;
        url: string;
        description?: string;
        type?: 'Local' | 'Regional' | 'Statewide';
    }>;
    educationalInstitutions?: Array<{
        name: string;
        url?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['state', 'city'],
            required: true,
            index: true,
        },
        stateSlug: {
            type: String,
            index: true,
        },
        description: String,
        metaTitle: String,
        metaDescription: String,
        image: String,
        zipCodes: [String],
        areaCodes: [String],
        timezone: String,
        // Comprehensive state data
        postal: String,
        capital: {
            name: String,
            latitude: String,
            longitude: String,
        },
        date: String, // Statehood date
        population: {
            density_km: String,
            total: String,
            density_mi: String,
        },
        nickname: String,
        fips: String,
        demonym: String,
        cities: [{
            name: String,
            population: String,
        }],
        lowest_point: String,
        highest_point: String,
        elevation: {
            min_ft: String,
            min_m: String,
            mean_ft: String,
            max_rank: String,
            max_ft: String,
            span_ft: String,
            mean_rank: String,
            span_m: String,
            mean_m: String,
            max_m: String,
        },
        area: {
            total_mi: String,
            land_rank: String,
            land_km: String,
            water_rank: String,
            total_rank: String,
            land_mi: String,
            water_km: String,
            total_km: String,
            land_percent: String,
            water_mi: String,
            water_percent: String,
        },
        website: String,
        per_capita_income: String,
        median_household_income: String,
        status: String,
        other_nicknames: [String],
        standard_federal_region: String,
        census_bureau: {
            region: String,
            division: String,
        },
        ap_abbreviation: String,
        gpo_abbreviation: String,
        representatives: String,
        time_zones: [String],
        koppen_climate: [String],
        motto: String,
        symbols: {
            song: String,
            tartan: String,
            tree: String,
            folk_dance: String,
            hero: String,
            fossil: String,
            flower: String,
            shellfish: String,
            childrens_flower: String,
            bird: String,
            fish: String,
            insect: String,
            heroine: String,
            dinosaur: String,
            mineral: String,
            polka: String,
        },
        subdivisions: [String],
        extendedFacts: [{
            label: String,
            value: String,
        }],
        // Legislative data for business intelligence
        legislativeData: {
            jurisdictionId: String,
            legislators: [{
                name: String,
                party: String,
                chamber: String,
                district: String,
                email: String,
                phone: String,
                photo: String,
                url: String,
            }],
            recentBills: [{
                identifier: String,
                title: String,
                status: String,
                lastActionDate: String,
                url: String,
                subjects: [String],
            }],
        },
        newspapers: [{
            name: String,
            url: String,
            description: String,
            type: {
                type: String,
                enum: ['Local', 'Regional', 'Statewide'],
                default: 'Local',
            },
        }],
        educationalInstitutions: [{
            name: String,
            url: String,
        }],
    },
    {
        timestamps: true,
    }
);

// Compound index for city within a state
LocationSchema.index({ slug: 1, stateSlug: 1 });

if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Location;
}
const Location = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);

export default Location;

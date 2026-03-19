export interface MarketCategory {
    label: string;
    tag: string;
    sector: string;
    searchIntent?: string;
}

export const MARKET_CATEGORIES: MarketCategory[] = [
    { label: "Restaurants", tag: 'amenity=restaurant', sector: "Dining & Beverage" },
    { label: "Coffee Shops / Cafes", tag: 'amenity=cafe', sector: "Dining & Beverage" },
    { label: "Grocery Stores", tag: 'shop=supermarket', sector: "Essential Retail" },
    { label: "Pharmacies", tag: 'amenity=pharmacy', sector: "Essential Retail" },
    { label: "Gas Stations", tag: 'amenity=fuel', sector: "Essential Retail" },
    { label: "Auto Repair", tag: 'shop=car_repair', sector: "Transport & Logistics" },
    { label: "Hair Salons", tag: 'shop=hairdresser', sector: "Personal Care" },
    { label: "Fast Food", tag: 'amenity=fast_food', sector: "Dining & Beverage" },
    { label: "Banks", tag: 'amenity=bank', sector: "Professional Services" },
    { label: "ATMs", tag: 'amenity=atm', sector: "Professional Services" },
    { label: "Medical Clinics", tag: 'amenity=clinic', sector: "Health & Wellness" },
    { label: "Dentists", tag: 'amenity=dentist', sector: "Health & Wellness" },
    { label: "Urgent Care", tag: 'amenity=hospital', sector: "Health & Wellness" }, // Usually hospitals/clinics
    { label: "Hotels", tag: 'tourism=hotel', sector: "Lifestyle & Leisure" },
    { label: "Pizza", tag: 'amenity=pizzeria', sector: "Dining & Beverage" },
    { label: "Clothing Stores", tag: 'shop=clothes', sector: "Lifestyle & Leisure" },
    { label: "Gyms", tag: 'leisure=fitness_centre', sector: "Health & Wellness" },
    { label: "Pet Stores", tag: 'shop=pet', sector: "Lifestyle & Leisure" },
    { label: "Hardware Stores", tag: 'shop=hardware', sector: "Home & Trade" },
    { label: "Convenience Stores", tag: 'shop=convenience', sector: "Essential Retail" },
    { label: "Bakeries", tag: 'shop=bakery', sector: "Dining & Beverage" },
    { label: "Insurance", tag: 'office=insurance', sector: "Professional Services" },
    { label: "Real Estate", tag: 'office=estate_agent', sector: "Professional Services" },
    { label: "Lawyers", tag: 'office=lawyer', sector: "Professional Services" },
    { label: "Child Care", tag: 'amenity=kindergarten', sector: "Lifestyle & Leisure" },
    { label: "Spas", tag: 'amenity=spa', sector: "Personal Care" },
    { label: "Electronics", tag: 'shop=electronics', sector: "Lifestyle & Leisure" },
    { label: "Cleaning Services", tag: 'shop=cleaning', sector: "Home & Trade" },
    { label: "Plumbers", tag: 'craft=plumber', sector: "Home & Trade" },
    { label: "Electricians", tag: 'craft=electrician', sector: "Home & Trade" },
    { label: "HVAC", tag: 'craft=hvac', sector: "Home & Trade" }, // Note: may vary by tagging
    { label: "Landscaping", tag: 'craft=gardener', sector: "Home & Trade" },
    { label: "Movers", tag: 'office=moving_company', sector: "Transport & Logistics" }, // Rare in OSM
    { label: "Towing", tag: 'amenity=towing', sector: "Transport & Logistics" },
    { label: "Locksmiths", tag: 'shop=locksmith', sector: "Home & Trade" },
    { label: "Pest Control", tag: 'office=pest_control', sector: "Home & Trade" },
    { label: "Car Wash", tag: 'amenity=car_wash', sector: "Transport & Logistics" },
    { label: "Florists", tag: 'shop=florist', sector: "Lifestyle & Leisure" },
    { label: "Bookstores", tag: 'shop=books', sector: "Lifestyle & Leisure" },
    { label: "Jewelry", tag: 'shop=jewelry', sector: "Lifestyle & Leisure" },
    { label: "Optometrists", tag: 'shop=optician', sector: "Health & Wellness" },
    { label: "Physical Therapy", tag: 'healthcare=physical_therapist', sector: "Health & Wellness" },
    { label: "Chiropractors", tag: 'healthcare=chiropractor', sector: "Health & Wellness" },
    { label: "Massage", tag: 'amenity=massage', sector: "Health & Wellness" },
    { label: "Tax Prep", tag: 'office=tax', sector: "Professional Services" },
    { label: "Accountants", tag: 'office=accountant', sector: "Professional Services" },
    { label: "Print & Copy", tag: 'shop=copy', sector: "Lifestyle & Leisure" },
    { label: "Laundromats", tag: 'amenity=laundry', sector: "Lifestyle & Leisure" },
    { label: "Party Supply", tag: 'shop=party_supplies', sector: "Lifestyle & Leisure" },
    { label: "Bike Shops", tag: 'shop=bicycle', sector: "Transport & Logistics" },
];

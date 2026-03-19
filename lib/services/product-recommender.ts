export interface ProductOpportunity {
    type: "digital" | "virtual" | "physical" | "saas";
    title: string;
    description: string;
    reason: string;
}

export class ProductRecommender {
    static getRecommendations(data: any): ProductOpportunity[] {
        const age = data.audience.medianAge;
        const income = data.medianIncome;
        const lowIncome = income < 35000;
        const highIncome = income > 75000;

        const recs: ProductOpportunity[] = [];

        // 1. Digital Products
        if (age < 30) {
            recs.push({
                type: "digital",
                title: "Local Side-Hustle Blueprint",
                description: "PDF guide on launching 5 high-demand local services for students.",
                reason: "Young, hungry population looking for flexible income."
            });
        } else if (age < 45) {
            recs.push({
                type: "digital",
                title: "Smart Homeowner Planner",
                description: "Digital toolkit for home renovation and maintenance tracking.",
                reason: "Active family/homeowning age bracket."
            });
        } else {
            recs.push({
                type: "digital",
                title: "Legacy & Estate Guide",
                description: "Step-by-step digital guide for estate planning and legacy preservation.",
                reason: "Senior-heavy demographic focused on family security."
            });
        }

        // 2. Virtual Services
        if (highIncome) {
            recs.push({
                type: "virtual",
                title: "Remote Wellness Concierge",
                description: "One-on-one virtual coaching for health, longevity, and aesthetics.",
                reason: "High disposable income and health-conscious middle-age/senior base."
            });
        } else if (lowIncome) {
            recs.push({
                type: "virtual",
                title: "Budget Optimization Coach",
                description: "Virtual consulting for maximizing local subsidies and reducing bills.",
                reason: "High price sensitivity and economic vulnerability."
            });
        } else {
            recs.push({
                type: "virtual",
                title: "Virtual Interior Consultant",
                description: "Remote design consultations for modernizing existing suburban homes.",
                reason: "Stable middle-class base focused on home improvement."
            });
        }

        // 3. Physical Products
        if (data.affordability.homeownershipRate > 65) {
            recs.push({
                type: "physical",
                title: "Smart Garden Tech Kits",
                description: "IOT-enabled indoor/outdoor garden kits for hobbyist homeowners.",
                reason: "High concentration of stable homeowners with yard space."
            });
        } else {
            recs.push({
                type: "physical",
                title: "Ultra-Efficient Home Gym Gear",
                description: "Compact, high-quality fitness gear for apartment/rental living.",
                reason: "Higher density of renters or multi-family dwellings."
            });
        }

        // 4. SaaS Opportunities
        if (data.digital.workFromHomePct > 10) {
            recs.push({
                type: "saas",
                title: "Local Remote-Work Hub",
                description: "App for discovering and booking hyper-local quiet workspaces and perks.",
                reason: "Significant work-from-home population needing local structure."
            });
        } else if (data.economy.vehiclesAvailable.zero > (data.population / 10)) {
            recs.push({
                type: "saas",
                title: "Neighborhood Supply Sync",
                description: "SaaS platform for community group-buying and last-mile delivery sharing.",
                reason: "High vehicle-dependency gap in local logistics."
            });
        } else {
            recs.push({
                type: "saas",
                title: "Local Service Connector",
                description: "SaaS portal for residents to book and review trusted local trade services.",
                reason: "Universal need in stable residential areas."
            });
        }

        return recs;
    }
}

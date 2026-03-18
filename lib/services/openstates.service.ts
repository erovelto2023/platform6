const OPENSTATES_API_KEY = process.env.OPENSTATES_API_KEY;
const OPENSTATES_GRAPHQL_URL = "https://openstates.org/graphql";

export interface OpenStatesBill {
    identifier: string;
    title: string;
    latestActionDate: string;
    latestActionDescription: string;
    openstatesUrl: string;
    subjects: string[];
}

export interface OpenStatesLegislator {
    name: string;
    party: string;
    currentRole: {
        chamber: string;
        district: string;
    };
    contactDetails: Array<{
        type: string;
        value: string;
    }>;
    image: string;
    links: Array<{ url: string }>;
}

export class OpenStatesService {
    /**
     * Fetch legislators and business-related bills from Open States.
     */
    static async fetchLegislativeData(stateAbbr: string) {
        if (!OPENSTATES_API_KEY) {
            console.warn("OPENSTATES_API_KEY not found.");
            return null;
        }

        const jurisdictionId = `ocd-jurisdiction/country:us/state:${stateAbbr.toLowerCase()}/government`;

        const query = `
            query getLegislativeData($jurisdictionId: String!) {
                jurisdiction(id: $jurisdictionId) {
                    people(first: 8, currentMember: true) {
                        edges {
                            node {
                                name
                                party: currentParty { name }
                                image
                                links { url }
                                currentRole {
                                    chamber
                                    district
                                }
                                contactDetails {
                                    type
                                    value
                                }
                            }
                        }
                    }
                    bills(first: 5, searchQuery: "business commerce tax", sort: LATEST_ACTION_DESC) {
                        edges {
                            node {
                                identifier
                                title
                                latestActionDate
                                latestActionDescription
                                openstatesUrl
                                subjects
                            }
                        }
                    }
                }
            }
        `;

        try {
            const response = await fetch(OPENSTATES_GRAPHQL_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": OPENSTATES_API_KEY,
                },
                body: JSON.stringify({
                    query,
                    variables: { jurisdictionId },
                }),
            });

            if (!response.ok) {
                console.error("Open States API error:", response.status, response.statusText);
                return null;
            }

            const { data } = await response.json();
            const jurisdiction = data?.jurisdiction;

            if (!jurisdiction) return null;

            return {
                jurisdictionId,
                legislators: jurisdiction.people.edges.map((edge: any) => {
                    const node = edge.node;
                    const email = node.contactDetails.find((c: any) => c.type === "email")?.value || "";
                    const phone = node.contactDetails.find((c: any) => c.type === "voice" || c.type === "phone")?.value || "";
                    
                    return {
                        name: node.name,
                        party: node.party?.name || "Unknown",
                        chamber: node.currentRole?.chamber || "",
                        district: node.currentRole?.district || "",
                        email,
                        phone,
                        photo: node.image,
                        url: node.links[0]?.url || ""
                    };
                }),
                recentBills: jurisdiction.bills.edges.map((edge: any) => {
                    const node = edge.node;
                    return {
                        identifier: node.identifier,
                        title: node.title,
                        status: node.latestActionDescription,
                        lastActionDate: node.latestActionDate,
                        url: node.openstatesUrl,
                        subjects: node.subjects
                    };
                })
            };
        } catch (error) {
            console.error("Error in OpenStatesService.fetchLegislativeData:", error);
            return null;
        }
    }
}

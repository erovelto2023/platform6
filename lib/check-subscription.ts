import { auth } from "@clerk/nextjs/server";

export const checkSubscription = async () => {
    const { has } = await auth();

    // Check if the user has the 'pro' plan.
    // IMPORTANT: You must match 'pro' with the "Plan Key" or "Slug" you defined in the Clerk Dashboard.
    // If you have multiple plans (e.g. monthly, yearly), you might need to check for either,
    // or use a Feature based permission if you set that up.
    // Example: has({ permission: 'access:tools' })

    // For now, checking for 'pro' plan as requested.
    // This will return true if the user has an active subscription (including trial) to this plan.
    // Check if the user has the specific 'member' plan.
    // The plan ID provided is: member cplan_39fr79vVaxrXx5rxl1tw2XcSsQX
    const hasMemberPlan = has({ plan: "member cplan_39fr79vVaxrXx5rxl1tw2XcSsQX" });

    return hasMemberPlan;
};

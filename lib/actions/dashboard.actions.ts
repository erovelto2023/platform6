"use server";

import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import Course from "@/lib/db/models/Course";
import NicheBox from "@/lib/db/models/NicheBox";
import Article from "@/lib/db/models/Article";
import BrandBase from "@/lib/db/models/BrandBase";
import Resource from "@/lib/db/models/Resource";
import Payment from "@/lib/db/models/Payment";
import CommunityEvent from "@/lib/db/models/CommunityEvent";
import AffiliateCompany from "@/lib/db/models/AffiliateCompany";
import Group from "@/lib/db/models/Group";
import Survey from "@/lib/db/models/Survey";
import Supplier from "@/lib/db/models/Supplier";

export async function getDashboardStats() {
    try {
        await connectDB();

        // Get current date and date 30 days ago
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total users and growth
        const totalUsers = await User.countDocuments();
        const usersLastMonth = await User.countDocuments({
            createdAt: { $lt: thirtyDaysAgo }
        });
        const newUsers = totalUsers - usersLastMonth;
        const userGrowth = usersLastMonth > 0
            ? ((newUsers / usersLastMonth) * 100).toFixed(1)
            : totalUsers > 0 ? 100 : 0;

        // Active users (logged in within last 30 days)
        // Note: User model may not have lastLoginAt field, so we'll use a fallback
        const activeUsers = await User.countDocuments({
            updatedAt: { $gte: thirtyDaysAgo }
        });
        const activeUsersLastPeriod = await User.countDocuments({
            updatedAt: {
                $gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
                $lt: thirtyDaysAgo
            }
        });
        const activeGrowth = activeUsersLastPeriod > 0
            ? (((activeUsers - activeUsersLastPeriod) / activeUsersLastPeriod) * 100).toFixed(1)
            : activeUsers > 0 ? 100 : 0;

        // Content counts
        const totalCourses = await Course.countDocuments();
        const totalNicheBoxes = await NicheBox.countDocuments();
        const totalArticles = await Article.countDocuments();
        const totalBrandBases = await BrandBase.countDocuments();
        const totalResources = await Resource.countDocuments();
        const totalAffiliatePartners = await AffiliateCompany.countDocuments();
        const totalGroups = await Group.countDocuments();
        const totalSurveys = await Survey.countDocuments({ status: "Active" });
        const totalWholesaleSuppliers = await Supplier.countDocuments();

        // Calculate total content items
        const totalContent = totalCourses + totalNicheBoxes + totalArticles + totalBrandBases + totalResources;

        // Content from last month
        const contentLastMonth =
            await Course.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }) +
            await NicheBox.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }) +
            await Article.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }) +
            await BrandBase.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }) +
            await Resource.countDocuments({ createdAt: { $lt: thirtyDaysAgo } });

        const newContent = totalContent - contentLastMonth;
        const contentGrowth = contentLastMonth > 0
            ? ((newContent / contentLastMonth) * 100).toFixed(1)
            : totalContent > 0 ? 100 : 0;

        // Revenue from Stripe payments
        const successfulPayments = await Payment.find({ status: 'succeeded' });
        const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);

        // Revenue from last month
        const paymentsLastMonth = await Payment.find({
            status: 'succeeded',
            createdAt: { $lt: thirtyDaysAgo }
        });
        const revenueLastMonth = paymentsLastMonth.reduce((sum, payment) => sum + payment.amount, 0);

        const recentRevenue = totalRevenue - revenueLastMonth;
        const revenueGrowth = revenueLastMonth > 0
            ? ((recentRevenue / revenueLastMonth) * 100).toFixed(1)
            : totalRevenue > 0 ? 100 : 0;

        // Page views - placeholder for now
        const pageViews = 0; // TODO: Integrate with Google Analytics or similar
        const viewsGrowth = 0;

        return {
            totalUsers,
            userGrowth: parseFloat(userGrowth as string),
            totalRevenue,
            revenueGrowth: parseFloat(revenueGrowth as string),
            pageViews,
            viewsGrowth,
            activeUsers,
            activeGrowth: parseFloat(activeGrowth as string),
            totalContent,
            contentGrowth: parseFloat(contentGrowth as string),
            breakdown: {
                courses: totalCourses,
                nicheBoxes: totalNicheBoxes,
                articles: totalArticles,
                brandBases: totalBrandBases,
                resources: totalResources,
                events: await CommunityEvent.countDocuments({ startDate: { $gte: new Date() } }),
                affiliatePartners: totalAffiliatePartners,
                groups: totalGroups,
                surveys: totalSurveys,
                wholesaleSuppliers: totalWholesaleSuppliers,
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Return default values on error
        return {
            totalUsers: 0,
            userGrowth: 0,
            totalRevenue: 0,
            revenueGrowth: 0,
            pageViews: 0,
            viewsGrowth: 0,
            activeUsers: 0,
            activeGrowth: 0,
            totalContent: 0,
            contentGrowth: 0,
            breakdown: {
                courses: 0,
                nicheBoxes: 0,
                articles: 0,
                brandBases: 0,
                resources: 0,
                events: 0,
                affiliatePartners: 0,
                groups: 0,
                surveys: 0,
                wholesaleSuppliers: 0,
            }
        };
    }
}

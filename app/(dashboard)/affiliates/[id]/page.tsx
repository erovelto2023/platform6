import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import AffiliateCompany from "@/lib/db/models/AffiliateCompany";
import UserAffiliateCompany from "@/lib/db/models/UserAffiliateCompany";
import AffiliateProduct from "@/lib/db/models/AffiliateProduct";
import UserAffiliateProduct from "@/lib/db/models/UserAffiliateProduct";
import AffiliateDetailView from "./_components/affiliate-detail-view";
import { getAffiliateSales, getAffiliateLinks } from "@/lib/actions/affiliate-user.actions";

export default async function AffiliateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    // Check if company exists
    let company;
    try {
        company = await AffiliateCompany.findById(id).lean();
    } catch (e) {
        // Invalid ID format
        notFound();
    }

    if (!company) notFound();

    // Check if user has this affiliate
    const userAffiliate = await UserAffiliateCompany.findOne({
        userId: dbUser._id,
        companyId: company._id
    }).lean();

    if (!userAffiliate) {
        // If the user hasn't added this company yet, we could either:
        // 1. Redirect to explore
        // 2. Show a preview with an "Add" button
        // For now, redirecting to explore seems safest to avoid errors in the view component
        return redirect("/affiliates/explore");
    }

    const sales = await getAffiliateSales(userAffiliate._id.toString());
    const links = await getAffiliateLinks(userAffiliate._id.toString());

    // Fetch products
    const companyProducts = await AffiliateProduct.find({ companyId: company._id }).lean();
    const userProducts = await UserAffiliateProduct.find({ userId: dbUser._id, companyId: company._id }).populate('productId').lean();

    return (
        <AffiliateDetailView
            company={JSON.parse(JSON.stringify(company))}
            userAffiliate={JSON.parse(JSON.stringify(userAffiliate))}
            initialSales={sales}
            initialLinks={links}
            companyProducts={JSON.parse(JSON.stringify(companyProducts))}
            userProducts={JSON.parse(JSON.stringify(userProducts))}
        />
    );
}

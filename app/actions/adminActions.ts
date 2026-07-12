'use server';

import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { PillarPage, BlogPost, Glossary, Directory, Product, Author, PaymentGateway, ProductFunnel, SiteTheme } from '@/models';
import { revalidatePath } from 'next/cache';

// Helper to ensure current session is an admin
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized. Admin access required.');
  }
  return session;
}

// Revalidate all relevant pages (including layout for global theme changes)
function revalidateAppPages() {
  revalidatePath('/', 'layout');                       // Global layout (theme vars)
  revalidatePath('/admin');
  revalidatePath('/hub/[slug]', 'layout');
  revalidatePath('/courses/[courseId]', 'layout');
  revalidatePath('/checkout', 'layout');
  revalidatePath('/hubs');
}

/* ==========================================================================
   1. PILLAR PAGES CRUD
   ========================================================================== */
export async function upsertPillarPage(formData: {
  id?: string;
  keyword: string;
  slug: string;
  title: string;
  metaDescription: string;
  heroTitle?: string;
  heroSubtitle?: string;
  introductionText?: string;
  primaryProduct?: string;
  author: string;
  // Niche branding fields
  accentColor?: string;
  icon?: string;
  category?: string;
  isPublished?: boolean;
  trustBadges?: string | string[];
  affiliateDisclosure?: string;
  coverImageUrl?: string;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, trustBadges, ...data } = formData;

  // trustBadges comes as comma-separated string from form, convert to array
  const badges = typeof trustBadges === 'string'
    ? trustBadges.split(',').map((b) => b.trim()).filter(Boolean)
    : (trustBadges || []);

  const payload = { ...data, trustBadges: badges };

  if (id) {
    await PillarPage.findByIdAndUpdate(id, payload, { runValidators: true });
  } else {
    await PillarPage.create(payload);
  }

  revalidateAppPages();
  return { success: true };
}

/* ==========================================================================
   SITE THEME CRUD
   ========================================================================== */
export async function upsertSiteTheme(tokens: Record<string, string>) {
  await requireAdmin();
  await dbConnect();

  await SiteTheme.findOneAndUpdate(
    { isDefault: true },
    { ...tokens, updatedAt: new Date() },
    { upsert: true, runValidators: false }
  );

  // Bust the layout cache globally so ALL pages pick up the new theme
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deletePillarPage(id: string) {
  await requireAdmin();
  await dbConnect();
  await PillarPage.findByIdAndDelete(id);
  
  // Also clean up dependent records
  await BlogPost.deleteMany({ pillarId: id });
  await Glossary.deleteMany({ pillarId: id });
  await Directory.deleteMany({ pillarId: id });

  revalidateAppPages();
  return { success: true };
}

/* ==========================================================================
   2. BLOG POSTS CRUD
   ========================================================================== */
export async function upsertBlogPost(formData: {
  id?: string;
  pillarId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  isFeatured?: boolean;
  readTime?: string;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, ...data } = formData;

  if (id) {
    await BlogPost.findByIdAndUpdate(id, data, { runValidators: true });
  } else {
    await BlogPost.create(data);
  }

  revalidateAppPages();
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await dbConnect();
  await BlogPost.findByIdAndDelete(id);
  
  revalidateAppPages();
  return { success: true };
}

/* ==========================================================================
   3. GLOSSARY TERMS CRUD
   ========================================================================== */
export async function upsertGlossaryTerm(formData: {
  id?: string;
  pillarId: string;
  term: string;
  definition: string;
  slug: string;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, ...data } = formData;

  if (id) {
    await Glossary.findByIdAndUpdate(id, data, { runValidators: true });
  } else {
    await Glossary.create(data);
  }

  revalidateAppPages();
  return { success: true };
}

export async function deleteGlossaryTerm(id: string) {
  await requireAdmin();
  await dbConnect();
  await Glossary.findByIdAndDelete(id);

  revalidateAppPages();
  return { success: true };
}

/* ==========================================================================
   4. GEAR DIRECTORY CRUD
   ========================================================================== */
export async function upsertDirectoryResource(formData: {
  id?: string;
  pillarId: string;
  resourceName: string;
  category?: string;
  description?: string;
  affiliateUrl?: string;
  rating?: number;
  isSponsored?: boolean;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, ...data } = formData;

  if (id) {
    await Directory.findByIdAndUpdate(id, data, { runValidators: true });
  } else {
    await Directory.create(data);
  }

  revalidateAppPages();
  return { success: true };
}

export async function deleteDirectoryResource(id: string) {
  await requireAdmin();
  await dbConnect();
  await Directory.findByIdAndDelete(id);

  revalidateAppPages();
  return { success: true };
}

/* ==========================================================================
   5. PRODUCTS & AUTHORS CRUD
   ========================================================================== */
export async function upsertProduct(formData: {
  id?: string;
  title: string;
  type: 'ebook' | 'course' | 'service';
  price: number;
  stripePriceId?: string;
  description?: string;
  landingPageUrl?: string;
  gatewayId?: string;
  curriculum?: string;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, ...data } = formData;
  
  // Clean gatewayId
  if (data.gatewayId === '') {
    delete (data as any).gatewayId;
    await Product.findByIdAndUpdate(id, { $unset: { gatewayId: 1 } });
  }

  if (id) {
    await Product.findByIdAndUpdate(id, data, { runValidators: true });
  } else {
    await Product.create(data);
  }

  revalidateAppPages();
  return { success: true };
}

export async function upsertAuthor(formData: {
  id?: string;
  name: string;
  bio?: string;
  credentials?: string;
  avatarUrl?: string;
  verificationBadge?: boolean;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, ...data } = formData;

  if (id) {
    await Author.findByIdAndUpdate(id, data, { runValidators: true });
  } else {
    await Author.create(data);
  }

  revalidateAppPages();
  return { success: true };
}

/* ==========================================================================
   6. PAYMENT GATEWAYS CRUD
   ========================================================================== */
export async function upsertPaymentGateway(formData: {
  id?: string;
  name: string;
  type: 'stripe' | 'simulate';
  stripeSecretKey?: string;
  stripePublishableKey?: string;
  isActive?: boolean;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, ...data } = formData;

  if (id) {
    await PaymentGateway.findByIdAndUpdate(id, data, { runValidators: true });
  } else {
    await PaymentGateway.create(data);
  }

  revalidateAppPages();
  return { success: true };
}

export async function deletePaymentGateway(id: string) {
  await requireAdmin();
  await dbConnect();
  await PaymentGateway.findByIdAndDelete(id);
  
  // Unset gatewayId from products that were using this gateway
  await Product.updateMany({ gatewayId: id }, { $unset: { gatewayId: "" } });

  revalidateAppPages();
  return { success: true };
}

/* ==========================================================================
   7. PRODUCT FUNNELS CRUD
   ========================================================================== */
export async function upsertProductFunnel(formData: {
  id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  primaryProduct: string;
  upsellProduct?: string;
  downsellProduct?: string;
}) {
  await requireAdmin();
  await dbConnect();

  const { id, ...data } = formData;

  // Convert empty strings to null or undefined for optional object id relations
  const cleanedData: any = {
    ...data,
    primaryProduct: data.primaryProduct || undefined,
    upsellProduct: data.upsellProduct || undefined,
    downsellProduct: data.downsellProduct || undefined
  };

  // If upsell/downsell are empty strings, unset them
  if (cleanedData.upsellProduct === '') cleanedData.upsellProduct = null;
  if (cleanedData.downsellProduct === '') cleanedData.downsellProduct = null;

  if (id) {
    await ProductFunnel.findByIdAndUpdate(id, cleanedData, { runValidators: true });
  } else {
    await ProductFunnel.create(cleanedData);
  }

  revalidateAppPages();
  return { success: true };
}

export async function deleteProductFunnel(id: string) {
  await requireAdmin();
  await dbConnect();
  await ProductFunnel.findByIdAndDelete(id);

  revalidateAppPages();
  return { success: true };
}


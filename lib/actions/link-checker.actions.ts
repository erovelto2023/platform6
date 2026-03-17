'use server';

import connectToDatabase from '../db/connect';
import GlossaryTerm from '../db/models/GlossaryTerm';
import NicheBox from '../db/models/NicheBox';
import Resource from '../db/models/Resource';
import AffiliateLink from '../db/models/AffiliateLink';
import { revalidatePath } from 'next/cache';

export interface ExternalLink {
    id: string;
    sourceType: 'Glossary' | 'NicheBox' | 'Resource' | 'Affiliate';
    sourceName: string;
    field: string;
    url: string;
    label: string;
    adminLink: string;
}

export async function getAggregatedLinks() {
    try {
        await connectToDatabase();
        const links: ExternalLink[] = [];

        // 1. Fetch Glossary Term links
        const terms = await GlossaryTerm.find({}).lean();
        terms.forEach((term: any) => {
            const baseAdminLink = `/admin/glossary`;
            if (term.videoUrl) {
                links.push({
                    id: term._id.toString(),
                    sourceType: 'Glossary',
                    sourceName: term.term,
                    field: 'videoUrl',
                    url: term.videoUrl,
                    label: 'Video URL',
                    adminLink: baseAdminLink
                });
            }
            if (term.audioOrVideoResources) {
                links.push({
                    id: term._id.toString(),
                    sourceType: 'Glossary',
                    sourceName: term.term,
                    field: 'audioOrVideoResources',
                    url: term.audioOrVideoResources,
                    label: 'Audio/Video Resource',
                    adminLink: baseAdminLink
                });
            }
            term.caseStudies?.forEach((cs: any, idx: number) => {
                if (cs.url) {
                    links.push({
                        id: term._id.toString(),
                        sourceType: 'Glossary',
                        sourceName: term.term,
                        field: `caseStudies.${idx}.url`,
                        url: cs.url,
                        label: `Case Study: ${cs.title || idx}`,
                        adminLink: baseAdminLink
                    });
                }
            });
            term.amazonProducts?.forEach((p: any, idx: number) => {
                if (p.url) {
                    links.push({
                        id: term._id.toString(),
                        sourceType: 'Glossary',
                        sourceName: term.term,
                        field: `amazonProducts.${idx}.url`,
                        url: p.url,
                        label: `Amazon Product: ${p.name || idx}`,
                        adminLink: baseAdminLink
                    });
                }
            });
            term.websitesRanking?.forEach((w: any, idx: number) => {
                if (w.url) {
                    links.push({
                        id: term._id.toString(),
                        sourceType: 'Glossary',
                        sourceName: term.term,
                        field: `websitesRanking.${idx}.url`,
                        url: w.url,
                        label: `Authority Site: ${w.name || idx}`,
                        adminLink: baseAdminLink
                    });
                }
            });
            term.podcastsRanking?.forEach((p: any, idx: number) => {
                if (p.url) {
                    links.push({
                        id: term._id.toString(),
                        sourceType: 'Glossary',
                        sourceName: term.term,
                        field: `podcastsRanking.${idx}.url`,
                        url: p.url,
                        label: `Podcast: ${p.name || idx}`,
                        adminLink: baseAdminLink
                    });
                }
            });
        });

        // 2. Fetch NicheBox links
        const niches = await NicheBox.find({}).lean();
        niches.forEach((niche: any) => {
            const baseAdminLink = `/admin/niche-boxes/${niche.nicheSlug}`;
            if (niche.ideas?.youtube) {
                links.push({
                    id: niche._id.toString(),
                    sourceType: 'NicheBox',
                    sourceName: niche.nicheName,
                    field: 'ideas.youtube',
                    url: niche.ideas.youtube,
                    label: 'YouTube Strategy',
                    adminLink: baseAdminLink
                });
            }
            niche.assets?.forEach((asset: any, idx: number) => {
                if (asset.fileUrl) {
                    links.push({
                        id: niche._id.toString(),
                        sourceType: 'NicheBox',
                        sourceName: niche.nicheName,
                        field: `assets.${idx}.fileUrl`,
                        url: asset.fileUrl,
                        label: `Asset: ${asset.name}`,
                        adminLink: baseAdminLink
                    });
                }
                if (asset.link) {
                    links.push({
                        id: niche._id.toString(),
                        sourceType: 'NicheBox',
                        sourceName: niche.nicheName,
                        field: `assets.${idx}.link`,
                        url: asset.link,
                        label: `Asset Link: ${asset.name}`,
                        adminLink: baseAdminLink
                    });
                }
            });
            niche.recommendedTools?.forEach((tool: any, idx: number) => {
                if (tool.affiliateLink) {
                    links.push({
                        id: niche._id.toString(),
                        sourceType: 'NicheBox',
                        sourceName: niche.nicheName,
                        field: `recommendedTools.${idx}.affiliateLink`,
                        url: tool.affiliateLink,
                        label: `Tool: ${tool.toolName}`,
                        adminLink: baseAdminLink
                    });
                }
            });
        });

        // 3. Fetch Resource links
        const resources = await Resource.find({ type: 'link' }).lean();
        resources.forEach((res: any) => {
            if (res.url) {
                links.push({
                    id: res._id.toString(),
                    sourceType: 'Resource',
                    sourceName: res.title,
                    field: 'url',
                    url: res.url,
                    label: 'Resource Link',
                    adminLink: `/admin/resources/${res._id.toString()}`
                });
            }
        });

        // 4. Fetch Affiliate links
        const affLinks = await AffiliateLink.find({}).lean();
        affLinks.forEach((aff: any) => {
            if (aff.url) {
                links.push({
                    id: aff._id.toString(),
                    sourceType: 'Affiliate',
                    sourceName: aff.label,
                    field: 'url',
                    url: aff.url,
                    label: 'Affiliate Link',
                    adminLink: `/admin/affiliates/${aff._id.toString()}`
                });
            }
        });


        return { success: true, links: JSON.parse(JSON.stringify(links)) };
    } catch (error: any) {
        console.error('[GET_AGGREGATED_LINKS]', error);
        return { success: false, error: error.message };
    }
}

export async function updateLink(link: ExternalLink, newUrl: string) {
    try {
        await connectToDatabase();
        
        let model: any;
        switch (link.sourceType) {
            case 'Glossary':
                model = GlossaryTerm;
                break;
            case 'NicheBox':
                model = NicheBox;
                break;
            case 'Resource':
                model = Resource;
                break;
            case 'Affiliate':
                model = AffiliateLink;
                break;
            default:
                throw new Error('Unsupported source type');
        }

        const update: any = {};
        update[link.field] = newUrl;

        const result = await model.findByIdAndUpdate(link.id, { $set: update }, { new: true });
        
        if (!result) {
            return { success: false, error: 'Entity not found' };
        }

        revalidatePath('/admin/link-checker');
        return { success: true };
    } catch (error: any) {
        console.error('[UPDATE_LINK]', error);
        return { success: false, error: error.message };
    }
}

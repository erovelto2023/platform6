import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import PageType from "../lib/db/models/PageType";
import ContentEntry from "../lib/db/models/ContentEntry";

const samplePuckTemplate = {
  root: {
    props: {}
  },
  content: [
    {
      type: "SectionLayout",
      props: {
        bgType: "solid",
        bg: "white",
        paddingTop: "xl",
        paddingBottom: "xl",
        id: "SectionLayout-1"
      }
    }
  ],
  zones: {
    "SectionLayout-1:content": [
      {
        type: "HeadingBlock",
        props: {
          title: "{{title}} Review",
          align: "center",
          color: "slate",
          size: "2xl",
          fontWeight: "black",
          id: "HeadingBlock-1"
        }
      },
      {
        type: "TextBlock",
        props: {
          content: "Looking for an honest review of the {{brand}} {{title}}? You have come to the right place. Read our comprehensive analysis below!",
          align: "center",
          color: "slate",
          size: "base",
          id: "TextBlock-1"
        }
      },
      {
        type: "CardBlock",
        props: {
          title: "Pros & Cons of {{brand}} {{title}}",
          description: "Real-world test results and customer feedback highlights.",
          shadow: "md",
          bgColor: "white",
          id: "CardBlock-1"
        }
      },
      {
        type: "SpacerBlock",
        props: {
          height: "sm",
          id: "SpacerBlock-1"
        }
      },
      {
        type: "ButtonBlock",
        props: {
          text: "Buy {{title}} Now for {{price}}",
          href: "{{buttonLink}}",
          variant: "default",
          size: "lg",
          width: "auto",
          id: "ButtonBlock-1"
        }
      }
    ],
    "CardBlock-1:card-content": [
      {
        type: "TextBlock",
        props: {
          content: "👍 PROS: {{pros}}",
          align: "left",
          color: "slate",
          size: "base",
          id: "TextBlock-2"
        }
      },
      {
        type: "TextBlock",
        props: {
          content: "👎 CONS: {{cons}}",
          align: "left",
          color: "slate",
          size: "base",
          id: "TextBlock-3"
        }
      }
    ]
  }
};

async function seedCustomPages() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error("MONGODB_URI is not defined in .env.local");
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB database:", mongoose.connection.name);

        // 1. Seed PageType
        const pageTypeSlug = "affiliate";
        await PageType.deleteOne({ slug: pageTypeSlug });
        console.log("Cleared existing affiliate PageType.");

        const affiliatePageType = await PageType.create({
            name: "Affiliate Product Review",
            slug: pageTypeSlug,
            fields: [
                { name: "brand", label: "Brand Name", type: "text" },
                { name: "price", label: "Retail Price", type: "text" },
                { name: "rating", label: "Star Rating (1-5)", type: "number" },
                { name: "pros", label: "Product Pros", type: "textarea" },
                { name: "cons", label: "Product Cons", type: "textarea" },
                { name: "buttonLink", label: "Affiliate Link URL", type: "url" },
                { name: "imageUrl", label: "Product Image URL", type: "image" }
            ],
            puckTemplate: JSON.stringify(samplePuckTemplate)
        });
        console.log("Created 'Affiliate Product Review' PageType with puck template.");

        // 2. Seed Content Entries
        await ContentEntry.deleteMany({ pageTypeSlug });
        console.log("Cleared existing affiliate ContentEntries.");

        const entry1 = await ContentEntry.create({
            pageTypeSlug,
            title: "Best Ergonomic Dog Bed",
            slug: "best-ergonomic-dog-bed",
            data: {
                brand: "Orthopedic Pup",
                price: "$69.99",
                rating: 4.8,
                pros: "Super soft orthopedic foam, fully machine washable cover, non-slip bottom base.",
                cons: "Premium pricing, slightly heavy to carry, foam takes 24 hours to fully expand.",
                buttonLink: "https://amazon.com/example-dog-bed",
                imageUrl: "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?w=500"
            },
            metaTitle: "Best Ergonomic Dog Bed Review - 2026 Buyers Guide",
            metaDescription: "Read our comprehensive review of the Orthopedic Pup Ergonomic Dog Bed to see if it is worth your money.",
            isPublished: true
        });
        console.log("Created content entry:", entry1.title);

        const entry2 = await ContentEntry.create({
            pageTypeSlug,
            title: "Premium Cat Scratcher Post",
            slug: "premium-cat-scratcher-post",
            data: {
                brand: "MeowCare",
                price: "$29.99",
                rating: 4.5,
                pros: "Durable natural sisal rope wrapping, 32-inch extra tall height for scratching, stable heavy base.",
                cons: "Slight chemical odor when first opened, base fabric can shed fluff under heavy scratching.",
                buttonLink: "https://amazon.com/example-cat-scratcher",
                imageUrl: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500"
            },
            metaTitle: "MeowCare Premium Cat Scratcher Post Review",
            metaDescription: "Does your cat keep scratching the sofa? Our review details why the MeowCare post is the best solution.",
            isPublished: true
        });
        console.log("Created content entry:", entry2.title);

        console.log("Custom page type seeding finished successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error during custom page seeding:", error);
        process.exit(1);
    }
}

seedCustomPages();

---
description: how to seed your hostinger mongo database
---

# Seeding Deployment (Hostinger)

To populate your live database on Hostinger with the new USPS ZIP and Area Code data, follow these steps:

## 1. Get your Production URI
Retrieve your MongoDB connection string from your Hostinger Dashboard (VPS or Managed MongoDB section). It should look like this:
`mongodb+srv://admin:PASSWORD@your-hostinger-ip:27017/kbusiness`

## 2. Update Environment Variables
You have two options to run the seeder:

### Option A: Run from your Local Machine (Recommended)
1. Add your Hostinger IP to the **Whitelist** in your Hostinger MongoDB settings.
2. In your local `.env.local`, temporarily update `MONGODB_URI` to your Hostinger URI.
3. Run the command:
// turbo
   `npx tsx scripts/seed-zip-data.ts`
4. Revert your `.env.local` to `localhost` once finished.

### Option B: Run via SSH on Hostinger
1. Connect to your server: `ssh root@your-hostinger-ip`
2. Navigate to your project root.
3. Ensure your production `.env` has the correct `MONGODB_URI`.
4. Run the seeder:
// turbo
   `npx tsx scripts/seed-zip-data.ts`

## 3. Verify on Hostinger
Navigate to any city page on your live site (e.g., `https://your-domain.com/locations/kentucky/louisville`) and verify the "Local Identity" card is populated.

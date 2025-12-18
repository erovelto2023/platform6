# Database Update Guide - Post Deployment

## 🚀 Quick Answer

**For your Mongoose setup: Database updates happen AUTOMATICALLY!** ✅

When you deploy new code with updated models, Mongoose will:
1. Create new collections if they don't exist
2. Add new fields to documents (they'll be `undefined` until set)
3. Create indexes defined in your schemas

**No manual migration needed for schema changes!**

---

## 📋 Deployment Checklist

### **Before Deployment**

- [ ] Update your models in `lib/db/models/`
- [ ] Test locally with `npm run dev`
- [ ] Commit changes to git
- [ ] Push to GitHub

### **During Deployment**

Your deployment platform (Vercel, Railway, etc.) will:
1. Pull latest code
2. Run `npm install`
3. Run `npm run build`
4. Start the application
5. Mongoose connects and updates schema automatically

### **After Deployment**

✅ **Nothing required!** Your database is updated automatically.

---

## 🔧 When You NEED Manual Migration

Only needed for:
- **Data transformations** (changing existing data format)
- **Bulk updates** (updating all existing records)
- **Complex changes** (renaming fields, merging data)

### **Example Scenarios:**

#### ❌ **Don't Need Migration:**
```typescript
// Adding new field to model
interface IWebPage {
  name: string;
  slug: string;
  newField: string; // ← Mongoose handles this automatically
}
```

#### ✅ **Need Migration:**
```typescript
// Renaming field or transforming data
// Old: { price: "100" }
// New: { pricing: { amount: 100, currency: "USD" } }
```

---

## 🛠️ How to Run Manual Migrations

### **Option 1: Via SSH (Production Server)**

```bash
# SSH into your server
ssh user@your-server.com

# Navigate to app directory
cd /var/www/kbusinessacademy.com

# Run migration script
node scripts/migrate-database.js
```

### **Option 2: Via MongoDB Atlas (Cloud)**

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Use the built-in editor to update documents
4. Or use MongoDB Compass for GUI

### **Option 3: Via Local Script (Connects to Production)**

```bash
# Set production MongoDB URI
export MONGODB_URI="your-production-mongodb-uri"

# Run migration
node scripts/migrate-database.js
```

---

## 📝 Common Migration Tasks

### **1. Add New Field to All Documents**

```javascript
await WebPage.updateMany(
  { newField: { $exists: false } },
  { $set: { newField: "default value" } }
);
```

### **2. Rename Field**

```javascript
await WebPage.updateMany(
  {},
  { $rename: { oldFieldName: "newFieldName" } }
);
```

### **3. Transform Data**

```javascript
const pages = await WebPage.find({});
for (const page of pages) {
  page.newField = transformOldField(page.oldField);
  await page.save();
}
```

### **4. Remove Old Field**

```javascript
await WebPage.updateMany(
  {},
  { $unset: { oldField: "" } }
);
```

### **5. Create Indexes**

```javascript
await WebPage.createIndexes();
```

---

## 🔐 Environment Variables

Make sure these are set in production:

```bash
# .env.production (or in your hosting platform)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
NODE_ENV=production
```

---

## 🎯 Best Practices

### **1. Backwards Compatible Changes**
✅ **Good:**
```typescript
// Add optional field
interface IWebPage {
  name: string;
  newField?: string; // Optional - won't break existing data
}
```

❌ **Bad:**
```typescript
// Required field without default
interface IWebPage {
  name: string;
  newField: string; // Required - breaks existing data!
}
```

### **2. Use Default Values**
```typescript
const WebPageSchema = new Schema({
  newField: { 
    type: String, 
    default: "" // ← Provides default for existing docs
  }
});
```

### **3. Test Migrations Locally First**
```bash
# Use a copy of production data
mongodump --uri="production-uri" --out=./backup
mongorestore --uri="local-uri" ./backup

# Test migration
node scripts/migrate-database.js

# Verify results
```

---

## 🚨 Emergency Rollback

If something goes wrong:

### **1. Restore from Backup**
```bash
# MongoDB Atlas has automatic backups
# Go to: Clusters → Backup → Restore

# Or restore from mongodump
mongorestore --uri="production-uri" ./backup
```

### **2. Revert Code**
```bash
git revert HEAD
git push origin main
```

---

## 📊 Monitoring

After deployment, check:

1. **Application Logs**
   - Look for Mongoose connection errors
   - Check for schema validation errors

2. **Database Metrics**
   - MongoDB Atlas → Metrics
   - Watch for unusual activity

3. **Test Critical Paths**
   - Create a new page
   - Update existing page
   - Verify data integrity

---

## 🔄 Typical Deployment Flow

```mermaid
graph TD
    A[Update Models] --> B[Test Locally]
    B --> C[Commit & Push]
    C --> D[Deploy to Production]
    D --> E{Schema Changes?}
    E -->|Simple| F[Mongoose Auto-Updates]
    E -->|Complex| G[Run Migration Script]
    F --> H[Verify]
    G --> H
    H --> I[Monitor]
```

---

## 💡 Pro Tips

1. **Always use optional fields** when adding new properties
2. **Set defaults in schema** to handle existing documents
3. **Test with production data copy** before migrating
4. **Keep backups** before major changes
5. **Monitor after deployment** for any issues

---

## 📞 Quick Reference

**Automatic (No Action Needed):**
- Adding new optional fields
- Adding new collections
- Creating indexes
- Updating field types (compatible changes)

**Manual Migration Required:**
- Renaming fields
- Transforming data
- Removing fields
- Complex data restructuring

---

## ✅ Your Current Setup

Based on your models, these changes are **automatic**:
- ✅ New SEO fields in WebPage
- ✅ customHTML/customCSS in sections
- ✅ New indexes
- ✅ New collections (when first document is created)

**No migration script needed!** Just deploy and Mongoose handles it. 🎉

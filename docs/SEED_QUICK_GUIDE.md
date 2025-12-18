# Quick Seed Script

## 🚀 **Easiest Way - Use npm script**

Add this to your `package.json` scripts section:

```json
"scripts": {
  "seed:content": "node -r dotenv/config scripts/seed-content-templates.js"
}
```

Then run:
```bash
npm run seed:content
```

This will automatically load from `.env` file!

---

## 📋 **On Production Server**

### **Step 1: Check if .env exists**
```bash
ls -la .env
```

### **Step 2: If .env doesn't exist, create it**
```bash
# Find your MongoDB URI from your app's environment
# It might be in .env.local or .env.production

# Create .env with your MongoDB URI
nano .env
```

Add this line:
```
MONGODB_URI=mongodb+srv://your-connection-string
```

Save and exit (Ctrl+X, Y, Enter)

### **Step 3: Run the seed script**
```bash
npm run seed:content
```

OR

```bash
node -r dotenv/config scripts/seed-content-templates.js
```

---

## ⚡ **One-Line Command (if you know your MongoDB URI)**

```bash
MONGODB_URI="mongodb+srv://..." node scripts/seed-content-templates.js
```

Replace `mongodb+srv://...` with your actual MongoDB connection string.

---

## 🔍 **Find Your MongoDB URI**

Check these files on your server:
```bash
cat .env.local
cat .env.production
cat .env
```

Look for a line starting with `MONGODB_URI=`

---

## ✅ **Success!**

After running, you should see:
```
✅ Inserted 8 new templates
```

Then refresh your Content Studio page!

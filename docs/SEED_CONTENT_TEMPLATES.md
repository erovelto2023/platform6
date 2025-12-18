# Seed Content Templates - Instructions

## 🚀 How to Run on Production Server

### **Option 1: Set Environment Variable (Recommended)**

```bash
# Set MONGODB_URI and run in one command
MONGODB_URI="your-mongodb-connection-string" node scripts/seed-content-templates.js
```

### **Option 2: Create .env File**

```bash
# Create .env file
echo "MONGODB_URI=your-mongodb-connection-string" > .env

# Run script
node scripts/seed-content-templates.js
```

### **Option 3: Export Environment Variable**

```bash
# Export for current session
export MONGODB_URI="your-mongodb-connection-string"

# Run script
node scripts/seed-content-templates.js
```

---

## 📋 **Get Your MongoDB URI**

Your MongoDB URI should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Where to find it:**
1. MongoDB Atlas Dashboard
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

---

## ✅ **Expected Output**

```
🌱 Starting content template seeding...
✅ Connected to MongoDB
📦 Seeding 8 content templates
✅ Inserted 8 new templates
✅ Updated 0 existing templates

📊 Summary:
   Total content templates: 8
   Categories: Blog, E-commerce, Social Media, Email, Marketing, SEO, Video, Advertising

🎉 Content template seeding completed successfully!
```

---

## 🔧 **Troubleshooting**

### **Error: MONGODB_URI not found**
- Make sure you set the environment variable
- Check spelling: `MONGODB_URI` (all caps)
- Make sure there are no spaces around the `=`

### **Error: Authentication failed**
- Check your MongoDB password
- Make sure IP is whitelisted in MongoDB Atlas
- Verify database name is correct

### **Error: Cannot connect**
- Check internet connection
- Verify MongoDB cluster is running
- Check firewall settings

---

## 🎯 **Quick Command**

Replace `YOUR_MONGODB_URI` with your actual connection string:

```bash
MONGODB_URI="YOUR_MONGODB_URI" node scripts/seed-content-templates.js
```

Example:
```bash
MONGODB_URI="mongodb+srv://admin:mypassword@cluster0.mongodb.net/kbusiness?retryWrites=true&w=majority" node scripts/seed-content-templates.js
```

---

## 📝 **After Seeding**

1. Refresh the Content Studio page
2. You should see 8 templates
3. Try creating content with AI!

---

## 🆘 **Still Having Issues?**

Check if you have a `.env.local` file in your project root with `MONGODB_URI` set.

Or run this to check:
```bash
echo $MONGODB_URI
```

If it shows nothing, the variable isn't set.

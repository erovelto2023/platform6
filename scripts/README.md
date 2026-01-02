# User Management Scripts

This folder contains utility scripts for managing users in the application.

## Available Scripts

### 1. Make Admin (`make-admin.ts`)

Promotes a user to admin role.

**Usage:**
```bash
npm run make-admin <email>
```

**Example:**
```bash
npm run make-admin admin@example.com
```

**What it does:**
- Finds a user by their email address
- Updates their role from `student` to `admin`
- Displays confirmation with user details

---

### 2. List Users (`list-users.ts`)

Lists all users in the database with their roles.

**Usage:**
```bash
npm run list-users
```

**What it displays:**
- Email address
- Full name
- Role (admin/student)
- Account creation date
- Summary statistics (total admins and students)

---

## First-Time Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Make sure your MongoDB connection is configured** in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **List existing users** to find the email you want to promote:
   ```bash
   npm run list-users
   ```

4. **Promote a user to admin**:
   ```bash
   npm run make-admin your-email@example.com
   ```

---

## Alternative Methods

### Direct Database Update

If you prefer to update the database directly:

1. Connect to your MongoDB database (using MongoDB Compass, mongosh, or your hosting provider)
2. Find the `users` collection
3. Update the user's role:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Via MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find your user document
5. Edit the `role` field to `"admin"`
6. Save the changes

---

## Notes

- By default, all new users are created with the `student` role
- Only users with `role: "admin"` can access admin routes (`/admin/*`)
- Non-admin users will be redirected to `/dashboard` if they try to access admin pages
- The Admin navigation link is automatically hidden for non-admin users

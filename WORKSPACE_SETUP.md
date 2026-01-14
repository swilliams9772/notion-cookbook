# 🏢 Workspace-Wide Integration Setup Guide

Your integration is configured with the API key, but it needs permission to access your Notion workspace content. This guide shows you how to grant **bulk access** instead of adding the integration to each page individually.

## 🎯 Three Ways to Grant Access

### ⭐ Option 1: Workspace Administrator Method (Best for Full Access)

**Requirements:** You must be a workspace administrator

**Steps:**

1. **Open Notion** in your browser or desktop app

2. **Go to Settings & members:**
   - Click on "Settings & members" in the left sidebar
   - Or visit: https://www.notion.so/settings

3. **Navigate to Integrations/Connections:**
   - Look for "Connections" or "Integrations" in the settings menu
   - You should see your integration listed

4. **Grant Workspace Access:**
   - Find your integration in the list
   - Look for an option to grant workspace-wide access
   - Enable "Can access all workspace content" or similar option

5. **Verify:**
   ```bash
   node test-workspace-access.js
   ```
   You should now see all your pages and databases!

---

### 📁 Option 2: Top-Level Page Method (Recommended - No Admin Required)

**How it works:** When you share an integration with a parent page, **all child pages automatically inherit the connection**.

**Steps:**

1. **Identify your main workspace page:**
   - Look for your "Home" page
   - Or find the top-level page that contains most of your content
   - This is usually the page at the root of your sidebar

2. **Share the integration:**
   - Open that top-level page
   - Click the `•••` menu (top-right corner)
   - Select "Add connections"
   - Find and select your integration
   - Click "Confirm"

3. **Done!** All pages nested under this parent now have access

4. **Verify:**
   ```bash
   node test-workspace-access.js
   ```

**Example workspace structure:**

```
📄 Home (← Share integration here)
  ├── 📄 Projects
  │   ├── 📄 Project A (✅ automatically has access)
  │   └── 📄 Project B (✅ automatically has access)
  ├── 🗃️ Tasks Database (✅ automatically has access)
  └── 📄 Notes
      └── 📄 Meeting Notes (✅ automatically has access)
```

---

### 📄 Option 3: Individual Page Method (For Selective Access)

**When to use:** When you only want the integration to access specific pages/databases

**Steps:**

1. For each page or database you want to grant access to:
   - Open the page/database
   - Click `•••` → "Add connections"
   - Select your integration

2. **Verify:**
   ```bash
   node test-workspace-access.js
   ```

---

## 🔍 Verify Your Setup

After granting access using any method above, run:

```bash
node test-workspace-access.js
```

**Expected output after granting access:**

```
📊 WORKSPACE ACCESS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📄 Pages accessible: 45
   🗃️  Databases accessible: 12
   📦 Total resources: 57
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ WORKSPACE ACCESS GRANTED!
```

If you see `0` resources, the integration doesn't have access yet.

---

## 🚀 Test the Examples

Once you have workspace access, try these examples:

### 1. Auto-generate data in a database

```bash
cd examples/javascript/generate-random-data
npm run ts-run
```

This will automatically find your first accessible database and add 10 random rows.

### 2. Add content to a page

```bash
# First, get a page ID from: node test-workspace-access.js
# Then add it to the .env file:
echo 'NOTION_PAGE_ID=your-page-id-here' >> examples/javascript/intro-to-notion-api/.env

# Run the example:
cd examples/javascript/intro-to-notion-api
npm run basic:1
```

### 3. Start the web form server

```bash
# Add a page ID to the .env:
echo 'NOTION_PAGE_ID=your-page-id-here' >> examples/javascript/web-form-with-express/.env

# Start the server:
cd examples/javascript/web-form-with-express
npm start

# Open in browser: http://localhost:3000
```

---

## 🔐 Security Note

**Internal integrations** (like yours) are designed to:

- Only work within your workspace
- Have the permissions you explicitly grant
- Not be shared with other workspaces

**Get your API key:** https://www.notion.com/my-integrations

Create a `.env` file with: `NOTION_KEY=your-api-key`

**Keep this key secure!** Don't commit it to public repositories or share it publicly.

---

## 📚 Helpful Commands

```bash
# Check workspace access level
node test-workspace-access.js

# Quick setup check
node check-setup.js

# List all .env files
find examples/javascript -name ".env" -type f

# See what examples are available
ls examples/javascript/
```

---

## 🆘 Troubleshooting

### "0 resources accessible"

**Solution:** You haven't granted the integration access yet. Use Option 1 or 2 above.

### "I granted access but still see 0 resources"

**Checklist:**

- Wait 10-30 seconds and run the test again
- Make sure you selected the correct integration
- Try refreshing Notion and granting access again
- Verify the API key is correct in the .env files

### "I'm not a workspace admin"

**Solution:** Use Option 2 (Top-Level Page Method) instead. This works for all users.

### "I want to revoke access"

**Solution:** Go to the page/database → `•••` → "Connections" → Remove the integration

---

## ✅ Next Steps

Once you verify workspace access is working:

1. ✅ Copy Page/Database IDs from `test-workspace-access.js` output
2. ✅ Add them to the relevant `.env` files (see `QUICK_START.md`)
3. ✅ Test the examples
4. ✅ Build something awesome! 🚀

---

**Integration Dashboard:** https://www.notion.com/my-integrations

**Notion API Documentation:** https://developers.notion.com/

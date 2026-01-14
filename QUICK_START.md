# 🚀 Quick Start Guide

## ✅ What's Been Completed

1. **✅ All dependencies installed** - All JavaScript examples are ready
2. **✅ TypeScript type checking passed** - No errors in any example
3. **✅ API key configured** - Your Notion integration key is set up
4. **✅ Environment files created** - All `.env` files have been created with your API key

## 🎯 What You Need to Do Next

### Step 1: Grant Integration Access

Your integration currently has **NO ACCESS** to any Notion resources. Choose one of these methods:

#### 🏢 METHOD A: Workspace-Wide Access (Recommended - Admin Only)

If you're a workspace admin and want the integration to access everything:

1. **Go to Notion Settings:**
   - Click "Settings & members" in the sidebar
   - Or visit: https://www.notion.so/my-integrations
2. **Find your integration** in the workspace connections
3. **Grant workspace-wide permissions** (exact option name may vary)
4. ✅ Your integration now has access to all workspace content!

#### 📁 METHOD B: Bulk Access via Top-Level Page (Easiest)

Share your integration with a top-level page, and **all child pages automatically inherit access**:

1. **Go to your main workspace page** (e.g., "Home" or top-level page)
2. **Click `•••` menu** (top-right corner)
3. **Click "Add connections"**
4. **Select your integration**
5. ✅ All pages nested under this page now have access!

#### 📄 METHOD C: Individual Page Access

For specific pages/databases only:

1. **Go to each page or database** you want to use
2. **Click `•••` → "Add connections"**
3. **Select your integration**

💡 **Tip:** Use Method A or B to avoid manually adding the integration to each page!

### Step 2: Check Your Setup

Run this command to see what resources are accessible:

```bash
node test-workspace-access.js
```

This will show you:

- ✅ If your API key is working
- 📊 How many pages/databases are accessible
- 📄 List of accessible pages with their IDs
- 🗃️ List of accessible databases with their IDs
- 📋 What to do next

**Alternative:** Run `node check-setup.js` for a simpler check

### Step 3: Add IDs to Environment Files

After granting access, copy the Page/Database IDs and add them to the appropriate `.env` files:

**For Page-based examples:**

```bash
# Edit these files and add NOTION_PAGE_ID=your-page-id
examples/javascript/intro-to-notion-api/.env
examples/javascript/parse-text-from-any-block-type/.env
examples/javascript/web-form-with-express/.env
```

**For Database-based examples:**

```bash
# Edit these files and add NOTION_DATABASE_ID=your-database-id
examples/javascript/database-email-update/.env
examples/javascript/notion-github-sync/.env
examples/javascript/notion-task-github-pr-sync/.env
```

**Note:** The `generate-random-data` example will automatically use the first database it finds!

## 🧪 Test an Example

### Easiest Test (with a Database)

1. Grant integration access to any database
2. Run:

   ```bash
   cd examples/javascript/generate-random-data
   npm run ts-run
   ```

   This will add 10 rows of random data to your database.

### Simple Test (with a Page)

1. Grant integration access to a page
2. Add the page ID to `examples/javascript/intro-to-notion-api/.env`
3. Run:

   ```bash
   cd examples/javascript/intro-to-notion-api
   npm run basic:1
   ```

   This will add a simple text block to your page.

### Web App Test

1. Grant integration access to a page
2. Add the page ID to `examples/javascript/web-form-with-express/.env`
3. Run:
   ```bash
   cd examples/javascript/web-form-with-express
   npm start
   ```
4. Open http://localhost:3000 in your browser

## 📚 Available Examples

| Example                          | Requires                   | Description                            |
| -------------------------------- | -------------------------- | -------------------------------------- |
| `intro-to-notion-api`            | Page ID                    | Learn basic Notion API operations      |
| `generate-random-data`           | Database access            | Auto-generates fake data in a database |
| `parse-text-from-any-block-type` | Page ID                    | Extracts text from all block types     |
| `web-form-with-express`          | Page ID                    | Web form that creates Notion content   |
| `notion-github-sync`             | Database ID + GitHub token | Syncs GitHub issues to Notion          |
| `notion-task-github-pr-sync`     | Database ID + GitHub token | Syncs tasks with GitHub PRs            |
| `database-email-update`          | Database ID + SendGrid key | Email updates from database            |

## 🆘 Troubleshooting

### "No resources accessible"

→ You haven't granted the integration access to any pages/databases yet. See Step 1 above.

### "Cannot find module"

→ Run `npm install` in the example directory

### "NOTION_PAGE_ID is not defined"

→ Add the page ID to the `.env` file for that example

### Need more help?

→ Check the `README.md` in each example directory for detailed instructions
→ See `SETUP_STATUS.md` for a complete overview of configuration

---

**Get your Notion API Key:** https://www.notion.com/my-integrations

Create a `.env` file in the root directory with:

```
NOTION_KEY=your-notion-api-key-here
```

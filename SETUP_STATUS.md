# Notion Cookbook Setup Status

## ✅ Completed

### 1. Dependencies Installed

- All JavaScript example dependencies have been installed successfully
- All examples passed TypeScript type checking

### 2. API Key Configuration

- Notion API Key: Configured in `.env` file (see `.env.example`)
- ✅ API key is **VALID** and working

### 3. Environment Files Created

All `.env` files have been created with the Notion API key:

- ✅ `database-email-update/.env`
- ✅ `generate-random-data/.env`
- ✅ `intro-to-notion-api/.env`
- ✅ `notion-github-sync/.env`
- ✅ `notion-task-github-pr-sync/.env`
- ✅ `parse-text-from-any-block-type/.env`
- ✅ `web-form-with-express/.env`

---

## ⚠️ Action Required

### Grant Integration Access

Your integration currently has **NO ACCESS** to any Notion pages or databases.

**🏢 For Workspace-Wide Access (Recommended):**
See **`WORKSPACE_SETUP.md`** for detailed instructions on granting bulk access to all your pages.

**Quick options:**

- **Method A (Admin):** Grant workspace-wide permissions in Settings
- **Method B (Anyone):** Share with a top-level page - all child pages inherit access automatically
- **Method C (Selective):** Manually add to individual pages

**Test your access:**

```bash
node test-workspace-access.js
```

### Additional Configuration Needed

#### 📝 Examples that need a Page ID

- `intro-to-notion-api` - Add `NOTION_PAGE_ID` to `.env`
- `parse-text-from-any-block-type` - Add `NOTION_PAGE_ID` to `.env`
- `web-form-with-express` - Add `NOTION_PAGE_ID` to `.env`

To get a Page ID:

- Open any Notion page
- The ID is the 32-character string in the URL: `https://notion.so/PAGE_ID`

#### 🗃️ Examples that need a Database ID

- `generate-random-data` - Needs access to any database (will auto-find first available)
- `database-email-update` - Add `NOTION_DATABASE_ID` + SendGrid credentials to `.env`
- `notion-github-sync` - Add `NOTION_DATABASE_ID` + GitHub credentials to `.env`
- `notion-task-github-pr-sync` - Add `NOTION_DATABASE_ID` + GitHub credentials to `.env`

To get a Database ID:

- Open any Notion database
- The ID is the 32-character string before the `?v=` in the URL

#### 🔑 Examples needing additional API keys

- `database-email-update` - Needs SendGrid API key
- `notion-github-sync` - Needs GitHub Personal Access Token
- `notion-task-github-pr-sync` - Needs GitHub Personal Access Token

---

## 🧪 Testing the Examples

### Quick Test (Simple)

Once you grant access to a database:

```bash
cd examples/javascript/generate-random-data
npm run ts-run
```

This will generate random data in your first accessible database.

### Test with Page ID

After adding a `NOTION_PAGE_ID` to the `.env`:

```bash
cd examples/javascript/intro-to-notion-api
npm run basic:1  # Adds a block to your page
```

### Web Form Example

After adding a `NOTION_PAGE_ID`:

```bash
cd examples/javascript/web-form-with-express
npm start
```

Then open http://localhost:3000 in your browser.

---

## 📚 Documentation Templates

### Recommended Database Templates

- [Generate Random Data Template](https://public-api-examples.notion.site/f3e098475baa45878759ed8d04ea79af)
- [GitHub Sync Template](https://www.notion.com/367cd67cfe8f49bfaf0ac21305ebb9bf?v=bc79ca62b36e4c54b655ceed4ef06ebd)

---

## 🎯 Next Steps

1. **Grant integration access** to at least one page or database
2. **Add Page/Database IDs** to the relevant `.env` files
3. **Test a simple example** like `intro-to-notion-api/basic:1`
4. **Explore more complex examples** as needed

---

**Need help?** Check the README.md in each example directory for detailed setup instructions.

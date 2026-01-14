#!/usr/bin/env node

import { Client } from "@notionhq/client"
import { config } from "dotenv"

config()

const NOTION_KEY = process.env.NOTION_KEY || process.env.NOTION_API_KEY
if (!NOTION_KEY) {
  console.error(
    "❌ Error: NOTION_KEY or NOTION_API_KEY environment variable is required"
  )
  console.error("   Create a .env file with: NOTION_KEY=your-api-key")
  process.exit(1)
}

const notion = new Client({ auth: NOTION_KEY })

console.log("🔍 Checking Notion Integration Setup...\n")

async function checkSetup() {
  try {
    // Test API connection
    console.log("1️⃣  Testing API connection...")
    const response = await notion.search({})
    console.log("   ✅ API key is valid!\n")

    // Check for available resources
    console.log("2️⃣  Checking accessible resources...")
    const pages = response.results.filter((r) => r.object === "page")
    const databases = response.results.filter((r) => r.object === "database")

    if (response.results.length === 0) {
      console.log("   ⚠️  No resources accessible yet!\n")
      console.log("📋 TO FIX THIS:")
      console.log("   1. Open Notion in your browser")
      console.log("   2. Go to any page or database")
      console.log("   3. Click '...' menu → 'Add connections'")
      console.log("   4. Select your integration\n")
      console.log("   Then run this script again!\n")
      return
    }

    console.log(
      `   ✅ Found ${response.results.length} accessible resources!\n`
    )

    // List pages
    if (pages.length > 0) {
      console.log("📄 PAGES:")
      pages.forEach((page) => {
        const title =
          page.properties?.title?.title?.[0]?.plain_text ||
          page.properties?.Name?.title?.[0]?.plain_text ||
          "Untitled"
        console.log(`   • ${title}`)
        console.log(`     ID: ${page.id}`)
        console.log(`     URL: ${page.url}\n`)
      })
    }

    // List databases
    if (databases.length > 0) {
      console.log("🗃️  DATABASES:")
      databases.forEach((db) => {
        const title = db.title?.[0]?.plain_text || "Untitled Database"
        console.log(`   • ${title}`)
        console.log(`     ID: ${db.id}`)
        console.log(`     URL: ${db.url}\n`)
      })
    }

    // Provide next steps
    console.log("\n✨ NEXT STEPS:")
    if (pages.length > 0) {
      console.log("\n   Copy a Page ID above and add it to these .env files:")
      console.log("   • examples/javascript/intro-to-notion-api/.env")
      console.log(
        "   • examples/javascript/parse-text-from-any-block-type/.env"
      )
      console.log("   • examples/javascript/web-form-with-express/.env")
      console.log('\n   Add as: NOTION_PAGE_ID="your-page-id-here"')
    }

    if (databases.length > 0) {
      console.log(
        "\n   Copy a Database ID above and add it to these .env files:"
      )
      console.log("   • examples/javascript/database-email-update/.env")
      console.log("   • examples/javascript/notion-github-sync/.env")
      console.log("   • examples/javascript/notion-task-github-pr-sync/.env")
      console.log('\n   Add as: NOTION_DATABASE_ID="your-database-id-here"')
      console.log(
        "\n   Note: generate-random-data will automatically use the first database"
      )
    }

    console.log("\n🧪 TRY AN EXAMPLE:")
    if (pages.length > 0) {
      console.log("   cd examples/javascript/intro-to-notion-api")
      console.log("   npm run basic:1")
    } else if (databases.length > 0) {
      console.log("   cd examples/javascript/generate-random-data")
      console.log("   npm run ts-run")
    }
    console.log("")
  } catch (error) {
    console.error("❌ Error:", error.message)
    if (error.code === "unauthorized") {
      console.log("\n   The API key appears to be invalid or expired.")
      console.log("   Please check your integration settings at:")
      console.log("   https://www.notion.com/my-integrations\n")
    }
  }
}

checkSetup()

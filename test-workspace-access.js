#!/usr/bin/env node
import { config } from "dotenv"

import { Client } from "@notionhq/client"

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

console.log("🔍 Testing Workspace Access...\n")

async function testWorkspaceAccess() {
  try {
    console.log("Searching for all accessible resources...\n")

    // Search with pagination to get ALL resources
    let allResults = []
    let hasMore = true
    let startCursor = undefined

    while (hasMore) {
      const response = await notion.search({
        start_cursor: startCursor,
        page_size: 100,
      })

      allResults = allResults.concat(response.results)
      hasMore = response.has_more
      startCursor = response.next_cursor
    }

    const pages = allResults.filter((r) => r.object === "page")
    const databases = allResults.filter((r) => r.object === "database")

    console.log("📊 WORKSPACE ACCESS SUMMARY")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log(`   📄 Pages accessible: ${pages.length}`)
    console.log(`   🗃️  Databases accessible: ${databases.length}`)
    console.log(`   📦 Total resources: ${allResults.length}`)
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    if (allResults.length === 0) {
      console.log("⚠️  NO WORKSPACE ACCESS YET\n")
      console.log("To grant workspace-wide access:\n")
      console.log("METHOD 1: Workspace-Level Access (Admin only)")
      console.log("   1. Go to Settings & members")
      console.log("   2. Go to 'Connections' or 'Integrations'")
      console.log("   3. Find your integration")
      console.log("   4. Grant workspace-wide permissions\n")
      console.log("METHOD 2: Share Top-Level Page (Easiest)")
      console.log("   1. Go to your main workspace page")
      console.log("   2. Click '...' → 'Add connections'")
      console.log("   3. Select your integration")
      console.log("   4. All child pages will inherit access!\n")
      return
    }

    console.log("✅ WORKSPACE ACCESS GRANTED!\n")

    // Show databases
    if (databases.length > 0) {
      console.log("🗃️  ACCESSIBLE DATABASES:")
      databases.slice(0, 10).forEach((db, index) => {
        const title = db.title?.[0]?.plain_text || "Untitled Database"
        console.log(`   ${index + 1}. ${title}`)
        console.log(`      ID: ${db.id}`)
      })
      if (databases.length > 10) {
        console.log(`   ... and ${databases.length - 10} more databases`)
      }
      console.log("")
    }

    // Show pages
    if (pages.length > 0) {
      console.log("📄 ACCESSIBLE PAGES:")
      pages.slice(0, 10).forEach((page, index) => {
        const title =
          page.properties?.title?.title?.[0]?.plain_text ||
          page.properties?.Name?.title?.[0]?.plain_text ||
          "Untitled"
        console.log(`   ${index + 1}. ${title}`)
        console.log(`      ID: ${page.id}`)
      })
      if (pages.length > 10) {
        console.log(`   ... and ${pages.length - 10} more pages`)
      }
      console.log("")
    }

    console.log("🎉 READY TO USE THE EXAMPLES!")
    console.log("\nYou can now run any example. Try:")

    if (databases.length > 0) {
      console.log("\n   cd examples/javascript/generate-random-data")
      console.log("   npm run ts-run")
      console.log("   (Will use first database automatically)")
    }

    if (pages.length > 0) {
      console.log("\n   Or copy a Page ID above and add to .env, then:")
      console.log("   cd examples/javascript/intro-to-notion-api")
      console.log("   npm run basic:1")
    }

    console.log("\n")
  } catch (error) {
    console.error("❌ Error:", error.message)
    if (error.code === "unauthorized") {
      console.log("\n   The API key is invalid or expired.")
      console.log("   Check: https://www.notion.com/my-integrations\n")
    }
  }
}

testWorkspaceAccess()

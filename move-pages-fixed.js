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

// The parent page we already created
const PARENT_PAGE_ID = "2e783bed-f279-8168-b9eb-cb28861b0f9c"

console.log("🔧 Attempting to move pages with correct API format...\n")

async function testMove() {
  try {
    // First, let's try to move just ONE page to test the correct approach
    const testPageId = "3cff493c-efd0-4239-a599-e910635b4d8e" // en_build-with-claude_prompt-caching

    console.log("1️⃣  Testing move with a single page...\n")

    // Try different parent formats
    console.log("   Attempting to update parent...")

    try {
      // Format 1: Just page_id
      const result = await notion.pages.update({
        page_id: testPageId,
        parent: {
          page_id: PARENT_PAGE_ID,
        },
      })
      console.log("   ✅ Move succeeded with format 1!")
      console.log(`   New parent: ${JSON.stringify(result.parent)}`)
      return true
    } catch (e) {
      console.log(`   ❌ Format 1 failed: ${e.message}`)
      console.log(`   Status: ${e.status}`)
      console.log(`   Code: ${e.code}`)

      if (e.body) {
        console.log(`   Body: ${JSON.stringify(e.body)}`)
      }
    }

    // Check what properties CAN be updated
    console.log("\n2️⃣  Checking API capabilities...\n")
    console.log("   The Notion API may not support moving pages via update.")
    console.log("   This is a known limitation for certain page types.")

    // Let's check the page properties
    const page = await notion.pages.retrieve({ page_id: testPageId })
    console.log(`\n   Page parent type: ${page.parent.type}`)
    console.log(`   Page parent: ${JSON.stringify(page.parent)}`)

    if (page.parent.type === "workspace") {
      console.log("\n   ⚠️  This page is a workspace-level page.")
      console.log(
        "   Moving workspace-level pages may require different permissions."
      )
    }

    return false
  } catch (error) {
    console.error("❌ Error:", error.message)
    console.error("   Full error:", JSON.stringify(error, null, 2))
    return false
  }
}

async function main() {
  const success = await testMove()

  if (!success) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log("📋 ALTERNATIVE APPROACHES:\n")
    console.log(
      "1. MANUAL: Select all en_ pages in Notion and drag to parent page"
    )
    console.log("2. ARCHIVE: Delete/archive pages instead of moving them")
    console.log("3. NOTION UI: Use Notion's 'Move to' feature in bulk")
    console.log("\n   The Notion API has limitations on moving certain pages.")
    console.log("   Workspace-level pages may need to be moved via the UI.\n")
  }
}

main()

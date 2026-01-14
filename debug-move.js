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

const PARENT_PAGE_ID = "2e783bed-f279-8168-b9eb-cb28861b0f9c"

console.log("🔍 Debugging page move capability...\n")

async function debug() {
  try {
    const testPageId = "3cff493c-efd0-4239-a599-e910635b4d8e"

    // Get page before
    console.log("1️⃣  Page BEFORE move attempt:")
    const before = await notion.pages.retrieve({ page_id: testPageId })
    console.log(`   Parent: ${JSON.stringify(before.parent)}`)

    // Try to update with explicit type
    console.log("\n2️⃣  Attempting move with type: page_id...")
    try {
      const result = await notion.pages.update({
        page_id: testPageId,
        parent: {
          type: "page_id",
          page_id: PARENT_PAGE_ID,
        },
      })
      console.log(`   Response parent: ${JSON.stringify(result.parent)}`)
    } catch (e) {
      console.log(`   Error: ${e.message}`)
    }

    // Get page after
    console.log("\n3️⃣  Page AFTER move attempt:")
    const after = await notion.pages.retrieve({ page_id: testPageId })
    console.log(`   Parent: ${JSON.stringify(after.parent)}`)

    // Check if parent changed
    if (JSON.stringify(before.parent) === JSON.stringify(after.parent)) {
      console.log("\n❌ Parent did NOT change!")
      console.log(
        "   The Notion API accepted the request but didn't move the page."
      )
    } else {
      console.log("\n✅ Parent changed successfully!")
    }

    // Check parent page capabilities
    console.log("\n4️⃣  Checking parent page...")
    const parentPage = await notion.pages.retrieve({ page_id: PARENT_PAGE_ID })
    console.log(`   Parent page type: ${parentPage.parent.type}`)
    console.log(`   Parent page parent: ${JSON.stringify(parentPage.parent)}`)

    // Try with blocks append instead
    console.log("\n5️⃣  Checking if we can use block references...")
    console.log(
      "   This approach uses child_page blocks instead of parent updates."
    )
  } catch (error) {
    console.error("❌ Error:", error.message)
  }
}

debug()

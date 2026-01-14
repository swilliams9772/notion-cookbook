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

console.log("🔍 Verifying organization status...\n")

async function verify() {
  try {
    // Check the parent page
    console.log("1️⃣  Checking parent page...")
    try {
      const parentPage = await notion.pages.retrieve({
        page_id: PARENT_PAGE_ID,
      })
      console.log(`   ✅ Parent page exists: ${parentPage.url}`)
    } catch (e) {
      console.log(`   ❌ Parent page not found or inaccessible`)
      console.log(`   Error: ${e.message}`)
    }

    // Search for en_ pages and check their parents
    console.log("\n2️⃣  Checking sample of en_ pages...\n")

    const searchResponse = await notion.search({
      query: "en_",
      filter: { property: "object", value: "page" },
      page_size: 20,
    })

    let movedCount = 0
    let notMovedCount = 0
    let notMovedPages = []

    for (const page of searchResponse.results) {
      const title =
        page.properties?.title?.title?.[0]?.plain_text ||
        page.properties?.Name?.title?.[0]?.plain_text ||
        "Untitled"

      if (!title.startsWith("en_")) continue

      const parent = page.parent

      if (parent.type === "page_id" && parent.page_id === PARENT_PAGE_ID) {
        movedCount++
        console.log(`   ✅ MOVED: ${title}`)
      } else {
        notMovedCount++
        notMovedPages.push({ id: page.id, title, parent })
        console.log(`   ❌ NOT MOVED: ${title}`)
        console.log(`      Parent type: ${parent.type}`)
        if (parent.type === "page_id") {
          console.log(`      Parent ID: ${parent.page_id}`)
        } else if (parent.type === "workspace") {
          console.log(`      Still at workspace root!`)
        }
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log("📊 SAMPLE RESULTS:")
    console.log(`   ✅ Moved to parent: ${movedCount}`)
    console.log(`   ❌ Still at root: ${notMovedCount}`)

    if (notMovedCount > 0) {
      console.log("\n⚠️  ISSUE DETECTED: Pages were not actually moved!")
      console.log(
        "\nThe API calls may have failed silently or the parent parameter"
      )
      console.log("may not work as expected for moving pages.")

      console.log("\n📋 Pages still at root:")
      notMovedPages.forEach((p) => {
        console.log(`   - ${p.title} (${p.id})`)
      })
    } else if (movedCount > 0) {
      console.log("\n✅ Pages appear to be correctly organized!")
      console.log("Try refreshing Notion or check the parent page directly.")
    }
  } catch (error) {
    console.error("❌ Error:", error.message)
  }
}

verify()

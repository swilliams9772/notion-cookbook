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

console.log("🔍 Finding all pages starting with 'en_'...\n")

async function listEnPages() {
  try {
    // Search for all pages
    let allPages = []
    let hasMore = true
    let startCursor = undefined

    while (hasMore) {
      const response = await notion.search({
        filter: { property: "object", value: "page" },
        start_cursor: startCursor,
        page_size: 100,
      })

      allPages = allPages.concat(response.results)
      hasMore = response.has_more
      startCursor = response.next_cursor
    }

    // Filter pages that start with "en_"
    const enPages = allPages.filter((page) => {
      const title =
        page.properties?.title?.title?.[0]?.plain_text ||
        page.properties?.Name?.title?.[0]?.plain_text ||
        ""
      return title.startsWith("en_")
    })

    console.log(`📊 Found ${enPages.length} pages starting with "en_"\n`)

    if (enPages.length === 0) {
      console.log("✅ No pages found starting with 'en_'")
      return
    }

    console.log("📄 ALL EN_ PAGES:\n")
    enPages.forEach((page, index) => {
      const title =
        page.properties?.title?.title?.[0]?.plain_text ||
        page.properties?.Name?.title?.[0]?.plain_text ||
        "Untitled"
      console.log(`${index + 1}. ${title}`)
      console.log(`   ID: ${page.id}`)
      console.log(`   URL: ${page.url}`)
      console.log("")
    })

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log(`📊 Total: ${enPages.length} pages\n`)

    console.log("🎯 NEXT STEPS:")
    console.log("\nTo organize these pages, run:")
    console.log("   node organize-en-pages.js\n")
    console.log("This will:")
    console.log("   1. Create a parent page called 'Documentation Pages (en_)'")
    console.log("   2. Move all these pages under it")
    console.log("   3. Keep them organized in one place\n")
  } catch (error) {
    console.error("❌ Error:", error.message)
  }
}

listEnPages()

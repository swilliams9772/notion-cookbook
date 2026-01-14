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

async function organizeEnPages() {
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

    // Show the first 20
    console.log("📄 PAGES TO ORGANIZE:")
    enPages.slice(0, 20).forEach((page, index) => {
      const title =
        page.properties?.title?.title?.[0]?.plain_text ||
        page.properties?.Name?.title?.[0]?.plain_text ||
        "Untitled"
      console.log(`   ${index + 1}. ${title}`)
      console.log(`      ID: ${page.id}`)
    })

    if (enPages.length > 20) {
      console.log(`   ... and ${enPages.length - 20} more pages`)
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    // Create a parent page to hold all en_ pages
    console.log("📝 Creating parent page 'Documentation Pages'...\n")

    const parentPage = await notion.pages.create({
      parent: {
        type: "page_id",
        page_id: "2e683bed-f279-8076-a6db-eeddcfac2d9f", // Using the test page as workspace root
      },
      properties: {
        title: [
          {
            type: "text",
            text: { content: "Documentation Pages (en_)" },
          },
        ],
      },
    })

    console.log(`✅ Created parent page: ${parentPage.id}`)
    console.log(`   URL: ${parentPage.url}\n`)

    // Move all en_ pages under the parent
    console.log("📦 Moving pages under parent page...\n")

    let movedCount = 0
    let errorCount = 0

    for (const page of enPages) {
      try {
        const title =
          page.properties?.title?.title?.[0]?.plain_text ||
          page.properties?.Name?.title?.[0]?.plain_text ||
          "Untitled"

        await notion.pages.update({
          page_id: page.id,
          parent: {
            type: "page_id",
            page_id: parentPage.id,
          },
        })

        movedCount++
        console.log(`   ✅ Moved: ${title}`)

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        errorCount++
        const title =
          page.properties?.title?.title?.[0]?.plain_text ||
          page.properties?.Name?.title?.[0]?.plain_text ||
          "Untitled"
        console.log(`   ❌ Failed to move: ${title}`)
        console.log(`      Error: ${error.message}`)
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log("📊 SUMMARY:")
    console.log(`   ✅ Successfully moved: ${movedCount} pages`)
    if (errorCount > 0) {
      console.log(`   ❌ Failed to move: ${errorCount} pages`)
    }
    console.log(`\n   📁 Parent page: ${parentPage.url}`)
    console.log("\n✨ Organization complete! Check your Notion workspace.\n")
  } catch (error) {
    console.error("❌ Error:", error.message)
    console.error(error)
  }
}

organizeEnPages()

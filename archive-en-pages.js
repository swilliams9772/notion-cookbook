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

console.log("🗑️  Moving all 'en_' pages to trash...\n")

async function archiveEnPages() {
  try {
    // First, find all pages starting with "en_"
    console.log("1️⃣  Finding all 'en_' pages...\n")

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

      // Show progress
      process.stdout.write(`\r   Found ${allPages.length} pages so far...`)
    }

    console.log(`\n   Total pages found: ${allPages.length}`)

    // Filter pages that start with "en_"
    const enPages = allPages.filter((page) => {
      const title =
        page.properties?.title?.title?.[0]?.plain_text ||
        page.properties?.Name?.title?.[0]?.plain_text ||
        ""
      return title.startsWith("en_")
    })

    console.log(`   Pages starting with 'en_': ${enPages.length}\n`)

    if (enPages.length === 0) {
      console.log("✅ No 'en_' pages found. Nothing to archive.")
      return
    }

    // Confirm before proceeding
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log(`⚠️  About to move ${enPages.length} pages to TRASH!\n`)
    console.log("   This action can be undone from Notion's Trash.\n")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    // Move pages to trash
    console.log("2️⃣  Moving pages to trash...\n")

    let archivedCount = 0
    let errorCount = 0
    const errors = []

    for (const page of enPages) {
      try {
        const title =
          page.properties?.title?.title?.[0]?.plain_text ||
          page.properties?.Name?.title?.[0]?.plain_text ||
          "Untitled"

        // Move to trash by setting in_trash to true
        await notion.pages.update({
          page_id: page.id,
          in_trash: true,
        })

        archivedCount++

        // Show progress every 10 pages
        if (archivedCount % 10 === 0) {
          console.log(
            `   ✅ Archived ${archivedCount} / ${enPages.length} pages...`
          )
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 50))
      } catch (error) {
        errorCount++
        const title =
          page.properties?.title?.title?.[0]?.plain_text ||
          page.properties?.Name?.title?.[0]?.plain_text ||
          "Untitled"
        errors.push({ title, error: error.message })
      }
    }

    // Final summary
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log("📊 ARCHIVE SUMMARY:")
    console.log(`   ✅ Successfully trashed: ${archivedCount} pages`)
    console.log(`   ❌ Failed: ${errorCount} pages`)

    if (errors.length > 0) {
      console.log("\n   Failed pages:")
      errors.slice(0, 10).forEach((e) => {
        console.log(`   - ${e.title}: ${e.error}`)
      })
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`)
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    if (archivedCount > 0) {
      console.log("✅ Done! Pages have been moved to Notion's Trash.")
      console.log("\n💡 To restore pages:")
      console.log("   1. Open Notion")
      console.log("   2. Go to Settings & members → Trash")
      console.log("   3. Find and restore any pages you want to keep")
      console.log("\n⚠️  Pages in trash are permanently deleted after 30 days.")
    }

    console.log("")
  } catch (error) {
    console.error("❌ Error:", error.message)
  }
}

archiveEnPages()

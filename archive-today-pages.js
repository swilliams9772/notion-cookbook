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

// Get today's date (start of day)
const today = new Date()
today.setHours(0, 0, 0, 0)
const todayISO = today.toISOString().split("T")[0] // "2026-01-13"

console.log(`🗑️  Moving 'en_' pages created TODAY (${todayISO}) to trash...\n`)

async function archiveTodayPages() {
  try {
    // First, find all pages starting with "en_"
    console.log("1️⃣  Finding all 'en_' pages created today...\n")

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
      process.stdout.write(`\r   Searched ${allPages.length} pages...`)
    }

    console.log(`\n   Total pages in workspace: ${allPages.length}`)

    // Filter pages that:
    // 1. Start with "en_"
    // 2. Were created TODAY
    const enPagesToday = allPages.filter((page) => {
      const title =
        page.properties?.title?.title?.[0]?.plain_text ||
        page.properties?.Name?.title?.[0]?.plain_text ||
        ""

      if (!title.startsWith("en_")) return false

      // Check if created today
      const createdDate = page.created_time.split("T")[0]
      return createdDate === todayISO
    })

    console.log(`   'en_' pages created today: ${enPagesToday.length}\n`)

    if (enPagesToday.length === 0) {
      console.log("✅ No 'en_' pages created today. Nothing to archive.")
      return
    }

    // Show sample of pages to be deleted
    console.log("📋 Sample of pages to be trashed:")
    enPagesToday.slice(0, 10).forEach((page, i) => {
      const title =
        page.properties?.title?.title?.[0]?.plain_text ||
        page.properties?.Name?.title?.[0]?.plain_text ||
        "Untitled"
      console.log(`   ${i + 1}. ${title}`)
    })
    if (enPagesToday.length > 10) {
      console.log(`   ... and ${enPagesToday.length - 10} more pages`)
    }

    // Confirm before proceeding
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log(`⚠️  About to move ${enPagesToday.length} pages to TRASH!\n`)
    console.log(
      "   Only pages starting with 'en_' created TODAY will be deleted."
    )
    console.log("   This action can be undone from Notion's Trash.\n")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    // Move pages to trash
    console.log("2️⃣  Moving pages to trash...\n")

    let archivedCount = 0
    let errorCount = 0
    const errors = []

    for (const page of enPagesToday) {
      try {
        const title =
          page.properties?.title?.title?.[0]?.plain_text ||
          page.properties?.Name?.title?.[0]?.plain_text ||
          "Untitled"

        // Move to trash
        await notion.pages.update({
          page_id: page.id,
          in_trash: true,
        })

        archivedCount++

        // Show progress every 50 pages
        if (archivedCount % 50 === 0) {
          console.log(
            `   ✅ Trashed ${archivedCount} / ${enPagesToday.length} pages...`
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
      console.log("✅ Done! Today's 'en_' pages have been moved to Trash.")
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

archiveTodayPages()

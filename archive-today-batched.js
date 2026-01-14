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

const notion = new Client({
  auth: NOTION_KEY,
  timeoutMs: 60000, // 60 second timeout
})

// Get today's date
const today = new Date()
today.setHours(0, 0, 0, 0)
const todayISO = today.toISOString().split("T")[0]

console.log(`🗑️  Moving 'en_' pages created TODAY (${todayISO}) to trash...\n`)

async function searchWithRetry(startCursor, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await notion.search({
        filter: { property: "object", value: "page" },
        start_cursor: startCursor,
        page_size: 100,
      })
    } catch (error) {
      if (i === retries - 1) throw error
      console.log(`   Retry ${i + 1}/${retries}...`)
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}

async function archiveTodayPages() {
  try {
    console.log("1️⃣  Searching and archiving in batches...\n")

    let hasMore = true
    let startCursor = undefined
    let totalSearched = 0
    let totalArchived = 0
    let totalErrors = 0

    while (hasMore) {
      try {
        const response = await searchWithRetry(startCursor)

        // Filter for en_ pages created today
        const todayEnPages = response.results.filter((page) => {
          const title =
            page.properties?.title?.title?.[0]?.plain_text ||
            page.properties?.Name?.title?.[0]?.plain_text ||
            ""

          if (!title.startsWith("en_")) return false

          const createdDate = page.created_time.split("T")[0]
          return createdDate === todayISO
        })

        totalSearched += response.results.length

        // Archive these pages immediately
        for (const page of todayEnPages) {
          try {
            await notion.pages.update({
              page_id: page.id,
              in_trash: true,
            })
            totalArchived++

            const title =
              page.properties?.title?.title?.[0]?.plain_text ||
              page.properties?.Name?.title?.[0]?.plain_text ||
              "Untitled"

            if (totalArchived % 25 === 0) {
              console.log(
                `   ✅ Trashed ${totalArchived} pages (searched ${totalSearched})...`
              )
            }

            // Small delay
            await new Promise((r) => setTimeout(r, 30))
          } catch (e) {
            totalErrors++
          }
        }

        hasMore = response.has_more
        startCursor = response.next_cursor

        // Progress update
        if (totalSearched % 500 === 0) {
          console.log(
            `   📊 Searched ${totalSearched} pages, archived ${totalArchived}...`
          )
        }

        // Small delay between batches
        await new Promise((r) => setTimeout(r, 100))
      } catch (error) {
        console.log(`   ⚠️ Batch error: ${error.message}`)
        console.log(`   Waiting 5 seconds before retry...`)
        await new Promise((r) => setTimeout(r, 5000))
      }
    }

    // Final summary
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log("📊 ARCHIVE SUMMARY:")
    console.log(`   📄 Total pages searched: ${totalSearched}`)
    console.log(`   ✅ Pages trashed: ${totalArchived}`)
    console.log(`   ❌ Errors: ${totalErrors}`)
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    if (totalArchived > 0) {
      console.log("✅ Done! Today's 'en_' pages have been moved to Trash.")
      console.log("\n💡 To restore: Notion → Settings → Trash")
      console.log("⚠️  Pages auto-delete after 30 days in trash.")
    } else {
      console.log("ℹ️  No 'en_' pages from today were found to archive.")
    }

    console.log("")
  } catch (error) {
    console.error("❌ Fatal error:", error.message)
  }
}

archiveTodayPages()

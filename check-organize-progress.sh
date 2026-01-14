#!/bin/bash

echo "🔍 Checking organization progress..."
echo ""

# Check if process is running
if ps aux | grep -q "[o]rganize-en-pages.js"; then
    echo "✅ Process is running"
    
    # Show the last 20 lines of the log
    echo ""
    echo "📋 Recent activity:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    tail -20 /Volumes/Samsung990/notion-cookbook/organize-log.txt
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Count moved pages
    MOVED_COUNT=$(grep -c "✅ Moved:" /Volumes/Samsung990/notion-cookbook/organize-log.txt 2>/dev/null || echo "0")
    FAILED_COUNT=$(grep -c "❌ Failed to move:" /Volumes/Samsung990/notion-cookbook/organize-log.txt 2>/dev/null || echo "0")
    
    echo "📊 Progress:"
    echo "   ✅ Pages moved: $MOVED_COUNT / 1686"
    echo "   ❌ Failed: $FAILED_COUNT"
    
    PERCENT=$((MOVED_COUNT * 100 / 1686))
    echo "   📈 Progress: $PERCENT%"
    echo ""
    echo "💡 Run this script again to check progress: bash check-organize-progress.sh"
    echo "   Or watch live: tail -f organize-log.txt"
    
else
    echo "⚠️  Process is not running"
    echo ""
    echo "📋 Final results:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    tail -30 /Volumes/Samsung990/notion-cookbook/organize-log.txt
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

---
name: RSB Calendar Integration
description: Implementation notes for the Regola di San Benedetto daily reading calendar in Benedictus
---

## Source
- Calendar: https://www.ora-et-labora.net/RSB_calendario.html
- Full Italian text: https://www.ora-et-labora.net/RSB_it.html

## Encoding
The site serves HTML with **Windows-1252** encoding (not UTF-8). Fetching with `response.arrayBuffer()` then `new TextDecoder('windows-1252').decode(buf)` is required.
**Why:** Plain `response.text()` misinterprets Italian accented characters as garbled UTF-8.

## CRLF normalization
After HTML-to-text conversion, normalize line endings: `.replace(/\r\n/g, "\n").replace(/\r/g, "\n")` before any regex that uses `\n\n`.
**Why:** The site uses Windows CRLF; `indexOf("\n\n")` returns -1 without normalization.

## Calendar structure
- 3 reading cycles per year (Rule read 3× annually)
- Left group: Jan/May(from 2)/Sep + Feb/Jun/Oct + Mar(1)/Jul(1)/Oct(31)
- Right group: Mar(2-31)/Jul(2-31)/Nov + Apr/Aug/Dec + May(1)/Aug(31)/Dec(31)
- Leap year: Feb 24 = "18, 20" (extra reading); Feb 24-28 shift by +1 in non-leap years
- All data is hardcoded in `rsb-calendario.ts`

## Chapter text parsing
- Chapter headings wrap across lines in HTML (e.g. "Capitolo XVIII - L'ordine dei\nsalmi nelle ore del giorno")
- Regex captures only first line of title; title continuation appears at top of body
- Fix: strip leading short lines (< 80 chars, no sentence-ending punctuation) before first `\n\n`

## Files
- `artifacts/api-server/src/routes/benedictus/rsb-calendario.ts` — complete date→chapter lookup + parseRiferimento()
- `artifacts/api-server/src/routes/benedictus/regola.ts` — GET /b/regola/giorno endpoint + in-memory chapter cache (24h TTL)
- `artifacts/benedictus/src/pages/lectio/index.tsx` — RegolaGiorno component added above the archive list

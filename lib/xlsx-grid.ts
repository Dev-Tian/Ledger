export async function readXlsxGrid(file: File): Promise<(string | null)[][]> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const entries = await zipEntries(bytes)
  const shared = entries.get("xl/sharedStrings.xml")
  const sheet = await firstSheet(entries)
  const strings = shared ? sharedStrings(shared) : []
  return grid(sheet, strings)
}

async function firstSheet(entries: Map<string, string>): Promise<string> {
  const direct = entries.get("xl/worksheets/sheet1.xml")
  if (direct) return direct
  const rels = entries.get("xl/_rels/workbook.xml.rels") ?? ""
  const target = rels.match(/Target="(worksheets\/[^"]+\.xml)"/)?.[1]
  const sheet = target ? entries.get(`xl/${target}`) : undefined
  if (!sheet) throw new Error("The first worksheet could not be read.")
  return sheet
}

function sharedStrings(xml: string): string[] {
  return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((match) =>
    [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map((text) => decodeXml(text[1]))
      .join(""),
  )
}

function grid(xml: string, shared: string[]): (string | null)[][] {
  const rows: (string | null)[][] = []
  for (const row of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = new Map<number, string>()
    for (const cell of row[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = cell[1]
      const inner = cell[2] ?? ""
      const reference = attr(attrs, "r")
      const letters = reference.replace(/\d+/g, "") || "A"
      const index = columnIndex(letters)
      const type = attr(attrs, "t")
      const value = inner.match(/<v\b[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? ""
      if (type === "s") cells.set(index, shared[Number(value)] ?? "")
      else if (type === "inlineStr") {
        cells.set(
          index,
          [...inner.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((text) => decodeXml(text[1])).join(""),
        )
      } else cells.set(index, decodeXml(value))
    }
    if (cells.size === 0) continue
    const width = Math.max(...cells.keys())
    const line: (string | null)[] = []
    for (let index = 0; index <= width; index += 1) line.push(cells.get(index) ?? null)
    rows.push(line)
  }
  return rows
}

function attr(attrs: string, name: string) {
  return attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? ""
}

function columnIndex(letters: string) {
  let index = 0
  for (const letter of letters.toUpperCase()) index = index * 26 + (letter.charCodeAt(0) - 64)
  return index - 1
}

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
}

async function zipEntries(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let eocd = -1
  const scan = Math.max(0, bytes.length - 22 - 0xffff)
  for (let index = bytes.length - 22; index >= scan; index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) {
      eocd = index
      break
    }
  }
  if (eocd < 0) throw new Error("Use an .xlsx file. Older .xls files cannot be read.")

  const count = view.getUint16(eocd + 10, true)
  let cursor = view.getUint32(eocd + 16, true)
  const files = new Map<string, { method: number; compressed: number; offset: number }>()
  for (let index = 0; index < count; index += 1) {
    if (view.getUint32(cursor, true) !== 0x02014b50) break
    const method = view.getUint16(cursor + 10, true)
    const compressed = view.getUint32(cursor + 20, true)
    const nameLength = view.getUint16(cursor + 28, true)
    const extraLength = view.getUint16(cursor + 30, true)
    const commentLength = view.getUint16(cursor + 32, true)
    const offset = view.getUint32(cursor + 42, true)
    const name = new TextDecoder().decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength))
    files.set(name, { method, compressed, offset })
    cursor += 46 + nameLength + extraLength + commentLength
  }

  const entries = new Map<string, string>()
  for (const [name, file] of files) {
    if (!name.startsWith("xl/")) continue
    const localNameLength = view.getUint16(file.offset + 26, true)
    const localExtraLength = view.getUint16(file.offset + 28, true)
    const start = file.offset + 30 + localNameLength + localExtraLength
    const data = bytes.subarray(start, start + file.compressed)
    entries.set(name, file.method === 0 ? new TextDecoder().decode(data) : await inflate(data))
  }
  return entries
}

async function inflate(data: Uint8Array) {
  const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream("deflate-raw"))
  const text = await new Response(stream).arrayBuffer()
  return new TextDecoder().decode(text)
}

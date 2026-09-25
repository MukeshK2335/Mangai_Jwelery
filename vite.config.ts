import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type MangaiCustom = {
  category_slug: 'rings' | 'necklaces' | 'earrings' | 'bangles'
  featured?: boolean
  craftsmanship_note?: string
  tags?: string[]
}

const META_GRAPH_VERSION = 'v22.0'
const FIELDS = [
  'id', 'retailer_id', 'name', 'description', 'short_description', 'image_url',
  'additional_image_url', 'url', 'currency', 'price', 'sale_price',
  'sale_price_start_date', 'sale_price_end_date', 'availability', 'brand',
  'condition', 'inventory', 'category', 'product_type', 'google_product_category',
  'size', 'variant', 'gender', 'age_group', 'material', 'color', 'pattern', 'weight',
  'weight_unit', 'shipping_costs', 'shipping_weight', 'shipping_weight_unit',
  'return_policy_days', 'warranty_info', 'gtin', 'mpn', 'created_time', 'updated_time',
  'review_status',
].join(',')

function fallbackCustom(metaProductTypeOrCategory: string): MangaiCustom {
  const s = String(metaProductTypeOrCategory || '').toLowerCase()
  let category_slug: MangaiCustom['category_slug'] = 'necklaces'
  if (/ring/.test(s)) category_slug = 'rings'
  else if (/necklace|chain|pendant|har|m/.test(s)) category_slug = 'necklaces'
  else if (/earring|stud|hoop|drop|jhum/.test(s)) category_slug = 'earrings'
  else if (/bangle|bracelet|kada|cuff/.test(s)) category_slug = 'bangles'
  return { category_slug, featured: false }
}

function corsHeaders(extras: Record<string, string> = {}): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    ...extras,
  }
}

function loadDotEnv(root: string): Record<string, string> {
  const env: Record<string, string> = {}
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v === 'string') env[k] = v
  }
  const candidates = ['.env.local', '.env']
  for (const name of candidates) {
    const p = resolve(root, name)
    if (!existsSync(p)) continue
    const raw = readFileSync(p, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let val = trimmed.slice(eq + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!(key in env)) env[key] = val
    }
  }
  return env
}

async function handleCatalog(req: unknown, env: Record<string, string>): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  const method = (req as { method?: string }).method || 'GET'
  if (method.toUpperCase() === 'OPTIONS') {
    return { status: 204, headers: corsHeaders(), body: '' }
  }

  const token = env.META_CATALOG_TOKEN
  const catalogId = env.META_CATALOG_ID
  const customRaw = env.MANGAI_CUSTOM_COLUMNS || '{}'

  if (!token || !catalogId) {
    return {
      status: 500,
      headers: corsHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        error:
          'Missing META_CATALOG_TOKEN or META_CATALOG_ID in Vite dev env. Add them to .env.local and restart `npm run dev`.',
      }),
    }
  }

  let customMap: Record<string, MangaiCustom> = {}
  try {
    customMap = JSON.parse(customRaw)
  } catch {
    customMap = {}
  }

  try {
    const metaUrl =
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${catalogId}/products` +
      `?fields=${encodeURIComponent(FIELDS)}&limit=500`

    const metaRes = await fetch(metaUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    const metaJson = (await metaRes.json()) as any

    if (!metaRes.ok) {
      return {
        status: metaRes.status,
        headers: corsHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ error: metaJson }),
      }
    }

    const list: any[] = Array.isArray(metaJson)
      ? metaJson
      : Array.isArray(metaJson?.data)
        ? metaJson.data
        : []

    const items = list.map((it) => {
      const retailerId = String(it.retailer_id ?? it.id ?? '')
      const custom = customMap[retailerId] ?? fallbackCustom(it.product_type || it.category || '')
      return { ...it, mangai: custom }
    })

    return {
      status: 200,
      headers: corsHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      }),
      body: JSON.stringify(items),
    }
  } catch (err: any) {
    return {
      status: 502,
      headers: corsHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ error: err?.message || String(err) || 'Unknown proxy error' }),
    }
  }
}

function metaCatalogDevPlugin(): Plugin {
  return {
    name: 'mangai-meta-catalog-dev',
    configureServer(server: ViteDevServer) {
      const env = loadDotEnv(server.config.root)
      server.middlewares.use('/api/catalog', async (req, res, next) => {
        try {
          const { status, headers, body } = await handleCatalog(req, env)
          for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
          res.statusCode = status
          res.end(body)
        } catch (e) {
          next(e)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), metaCatalogDevPlugin()],
  server: {
    watch: {
      ignored: ['**/api/**'],
    },
    fs: {
      allow: ['.', 'src', 'public', 'node_modules'],
      deny: ['**/api/**'],
    },
  },
  optimizeDeps: {
    exclude: ['api'],
  },
  build: {
    rollupOptions: {
      external: [/^\.\/?api\//, /^api\//],
    },
  },
})

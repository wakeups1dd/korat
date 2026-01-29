// Supabase Edge Function: analyze-url
// This function performs SEO analysis on a given URL and stores results in the database

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuditIssue {
    id: string
    title: string
    severity: 'error' | 'warning' | 'pass'
    description: string
    suggestion?: string
}

async function analyzeURL(url: string) {
    const startTime = Date.now()

    try {
        // Ensure URL has protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`
        }

        // Fetch the page with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'KORAT-SEO-Audit-Bot/1.0'
            }
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const html = await response.text()

        // Parse HTML (basic parsing without DOM)
        const seoIssues: AuditIssue[] = []
        const performanceIssues: AuditIssue[] = []
        const accessibilityIssues: AuditIssue[] = []
        const technicalIssues: AuditIssue[] = []

        // === SEO CHECKS ===

        // Check meta description
        const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
        if (!metaDescMatch) {
            seoIssues.push({
                id: 'seo-1',
                title: 'Missing meta description',
                severity: 'error',
                description: 'Your page is missing a meta description tag.',
                suggestion: 'Add a compelling meta description under 160 characters that includes your target keyword.'
            })
        } else if (metaDescMatch[1].length > 160) {
            seoIssues.push({
                id: 'seo-2',
                title: 'Meta description too long',
                severity: 'warning',
                description: `Meta description is ${metaDescMatch[1].length} characters. Google typically displays 150-160.`,
                suggestion: 'Shorten your meta description to under 160 characters.'
            })
        } else {
            seoIssues.push({
                id: 'seo-pass-1',
                title: 'Meta description present',
                severity: 'pass',
                description: `Meta description found (${metaDescMatch[1].length} characters).`
            })
        }

        // Check title tag
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
        if (!titleMatch) {
            seoIssues.push({
                id: 'seo-3',
                title: 'Missing title tag',
                severity: 'error',
                description: 'Your page is missing a title tag.',
                suggestion: 'Add a descriptive title tag under 60 characters.'
            })
        } else if (titleMatch[1].length > 60) {
            seoIssues.push({
                id: 'seo-4',
                title: 'Title tag is too long',
                severity: 'warning',
                description: `Title is ${titleMatch[1].length} characters. Google typically displays 50-60 characters.`,
                suggestion: 'Shorten your title to under 60 characters while keeping the main keyword near the beginning.'
            })
        } else {
            seoIssues.push({
                id: 'seo-pass-2',
                title: 'Title tag optimal',
                severity: 'pass',
                description: `Title tag found (${titleMatch[1].length} characters).`
            })
        }

        // Check H1 tags
        const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi) || []
        if (h1Matches.length === 0) {
            seoIssues.push({
                id: 'seo-5',
                title: 'No H1 tag found',
                severity: 'error',
                description: 'Your page is missing an H1 tag.',
                suggestion: 'Add exactly one H1 tag that clearly describes the page content.'
            })
        } else if (h1Matches.length > 1) {
            seoIssues.push({
                id: 'seo-6',
                title: 'Multiple H1 tags detected',
                severity: 'error',
                description: `Found ${h1Matches.length} H1 tags on this page. You should have exactly one.`,
                suggestion: 'Keep only one H1 tag that clearly describes the page content. Convert others to H2 or H3.'
            })
        } else {
            seoIssues.push({
                id: 'seo-pass-3',
                title: 'H1 tag present',
                severity: 'pass',
                description: 'One H1 tag found on the page.'
            })
        }

        // === ACCESSIBILITY CHECKS ===

        // Check images for alt attributes
        const imgTags = html.match(/<img[^>]+>/gi) || []
        const imagesWithoutAlt = imgTags.filter(img => !img.includes('alt='))
        const imagesCount = imgTags.length

        if (imagesWithoutAlt.length > 0) {
            accessibilityIssues.push({
                id: 'a11y-1',
                title: 'Images missing alt attributes',
                severity: 'error',
                description: `${imagesWithoutAlt.length} out of ${imagesCount} images are missing alt attributes.`,
                suggestion: 'Add descriptive alt text to all images for better accessibility and SEO.'
            })
        } else if (imagesCount > 0) {
            accessibilityIssues.push({
                id: 'a11y-pass-1',
                title: 'Image alt attributes present',
                severity: 'pass',
                description: `All ${imagesCount} images have alt attributes. Great for accessibility and SEO!`
            })
        }

        // Check for lang attribute
        if (!html.match(/<html[^>]+lang=/i)) {
            accessibilityIssues.push({
                id: 'a11y-2',
                title: 'Missing lang attribute',
                severity: 'warning',
                description: 'HTML tag is missing a lang attribute.',
                suggestion: 'Add lang="en" (or appropriate language code) to your HTML tag.'
            })
        } else {
            accessibilityIssues.push({
                id: 'a11y-pass-2',
                title: 'Language declared',
                severity: 'pass',
                description: 'HTML lang attribute is present.'
            })
        }

        // === TECHNICAL SEO CHECKS ===

        // Check for HTTPS
        if (url.startsWith('https://')) {
            technicalIssues.push({
                id: 'tech-pass-1',
                title: 'HTTPS enabled',
                severity: 'pass',
                description: 'Your site uses HTTPS. Secure connections are essential for SEO and user trust.'
            })
        } else {
            technicalIssues.push({
                id: 'tech-1',
                title: 'Not using HTTPS',
                severity: 'error',
                description: 'Your site is not using HTTPS.',
                suggestion: 'Enable HTTPS to improve security and SEO rankings.'
            })
        }

        // Check for canonical URL
        if (!html.match(/<link[^>]+rel=["']canonical["']/i)) {
            technicalIssues.push({
                id: 'tech-2',
                title: 'Missing canonical URL',
                severity: 'warning',
                description: 'No canonical link element found on the page.',
                suggestion: 'Add a canonical URL to prevent duplicate content issues.'
            })
        } else {
            technicalIssues.push({
                id: 'tech-pass-2',
                title: 'Canonical URL present',
                severity: 'pass',
                description: 'Canonical link tag found.'
            })
        }

        // Check for viewport meta tag
        if (!html.match(/<meta[^>]+name=["']viewport["']/i)) {
            technicalIssues.push({
                id: 'tech-3',
                title: 'Missing viewport meta tag',
                severity: 'error',
                description: 'Page is missing a viewport meta tag.',
                suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> for mobile responsiveness.'
            })
        } else {
            technicalIssues.push({
                id: 'tech-pass-3',
                title: 'Viewport meta tag present',
                severity: 'pass',
                description: 'Mobile viewport is configured.'
            })
        }

        // === PERFORMANCE CHECKS ===

        const pageSizeKB = new Blob([html]).size / 1024
        if (pageSizeKB > 1000) {
            performanceIssues.push({
                id: 'perf-1',
                title: 'Large page size',
                severity: 'error',
                description: `Page size is ${pageSizeKB.toFixed(0)}KB. Should be under 1000KB.`,
                suggestion: 'Optimize images, minify CSS/JS, and enable compression.'
            })
        } else if (pageSizeKB > 500) {
            performanceIssues.push({
                id: 'perf-2',
                title: 'Page size could be optimized',
                severity: 'warning',
                description: `Page size is ${pageSizeKB.toFixed(0)}KB.`,
                suggestion: 'Consider optimizing images and minifying resources.'
            })
        } else {
            performanceIssues.push({
                id: 'perf-pass-1',
                title: 'Page size is good',
                severity: 'pass',
                description: `Page size is ${pageSizeKB.toFixed(0)}KB.`
            })
        }

        // === CALCULATE SCORES ===

        const calculateScore = (issues: AuditIssue[]) => {
            const errors = issues.filter(i => i.severity === 'error').length
            const warnings = issues.filter(i => i.severity === 'warning').length
            return Math.max(0, Math.min(100, 100 - (errors * 20 + warnings * 10)))
        }

        const seoScore = calculateScore(seoIssues)
        const performanceScore = calculateScore(performanceIssues)
        const accessibilityScore = calculateScore(accessibilityIssues)
        const technicalScore = calculateScore(technicalIssues)
        const overallScore = Math.round((seoScore + performanceScore + accessibilityScore + technicalScore) / 4)

        // === QUICK STATS ===

        const internalLinks = (html.match(/<a[^>]+href=["'][^"']*["']/gi) || []).length
        const wordCount = html
            .replace(/<[^>]+>/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 0).length

        const securityGrade = url.startsWith('https://') ? 'A+' : 'F'

        return {
            overall_score: overallScore,
            performance_score: performanceScore,
            accessibility_score: accessibilityScore,
            seo_score: seoScore,
            technical_score: technicalScore,
            performance_issues: performanceIssues,
            seo_issues: seoIssues,
            accessibility_issues: accessibilityIssues,
            technical_issues: technicalIssues,
            scan_duration_ms: Date.now() - startTime,
            internal_links_count: internalLinks,
            images_count: imagesCount,
            word_count: wordCount,
            security_grade: securityGrade
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        throw new Error(`Failed to analyze URL: ${errorMessage}`)
    }
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { url } = await req.json()

        if (!url) {
            throw new Error('URL is required')
        }

        // Get user from JWT
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing authorization header')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // Perform analysis
        const results = await analyzeURL(url)

        // Save to database
        const { data, error } = await supabaseClient
            .from('audits')
            .insert({
                user_id: user.id,
                url: url,
                ...results
            })
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            throw new Error(`Failed to save audit: ${error.message}`)
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error:', errorMessage)
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: errorMessage.includes('Unauthorized') ? 401 : 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})

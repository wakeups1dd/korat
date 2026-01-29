// API Service Layer for KORAT
// Handles all communication with Supabase Edge Functions and database

import { supabase } from './supabase'

export interface AuditIssue {
    id: string
    title: string
    severity: 'error' | 'warning' | 'pass'
    description: string
    suggestion?: string
}

export interface AuditResult {
    id: string
    user_id: string
    url: string
    overall_score: number
    performance_score: number
    accessibility_score: number
    seo_score: number
    technical_score: number
    performance_issues: AuditIssue[]
    seo_issues: AuditIssue[]
    accessibility_issues: AuditIssue[]
    technical_issues: AuditIssue[]
    scanned_at: string
    scan_duration_ms: number
    internal_links_count: number
    images_count: number
    word_count: number
    security_grade: string
}

/**
 * Analyze a URL using the Supabase Edge Function
 * @param url - The URL to analyze (with or without https://)
 * @returns AuditResult with scores and detailed issues
 * @throws Error if analysis fails or user is not authenticated
 */
export async function analyzeURL(url: string): Promise<AuditResult> {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
        throw new Error('You must be logged in to scan URLs')
    }

    try {
        // Call the Edge Function
        const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-url`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ url })
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}: Analysis failed`)
        }

        return data as AuditResult
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }
        throw new Error('Failed to analyze URL. Please try again.')
    }
}

/**
 * Get all audits for the current user
 * @param limit - Maximum number of audits to return (default: 10)
 * @returns Array of AuditResults, sorted by most recent first
 */
export async function getUserAudits(limit: number = 10): Promise<AuditResult[]> {
    const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('scanned_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching audits:', error)
        throw new Error('Failed to load audit history')
    }

    return (data || []) as AuditResult[]
}

/**
 * Get a specific audit by ID
 * @param id - UUID of the audit
 * @returns AuditResult or null if not found
 */
export async function getAuditById(id: string): Promise<AuditResult | null> {
    const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching audit:', error)
        return null
    }

    return data as AuditResult
}

/**
 * Delete an audit by ID
 * @param id - UUID of the audit to delete
 */
export async function deleteAudit(id: string): Promise<void> {
    const { error } = await supabase
        .from('audits')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error('Failed to delete audit')
    }
}

/**
 * Get the user's profile
 */
export async function getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

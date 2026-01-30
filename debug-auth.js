// Debug script to test Edge Function authentication
// Run this in your browser console when logged in

async function debugAuth() {
    console.log('=== KORAT Debug Script ===');

    // Check environment variables
    console.log('\n1. Environment Variables:');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

    // Import supabase
    const { supabase } = await import('./src/lib/supabase.ts');

    // Check authentication
    console.log('\n2. Authentication Status:');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error('❌ Session Error:', sessionError);
        return;
    }

    if (!session) {
        console.error('❌ Not logged in!');
        console.log('👉 Please log in first, then run this script again');
        return;
    }

    console.log('✅ User is logged in');
    console.log('User ID:', session.user.id);
    console.log('User email:', session.user.email);
    console.log('Access token (first 20 chars):', session.access_token.substring(0, 20) + '...');

    // Test Edge Function
    console.log('\n3. Testing Edge Function:');
    const edgeUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-url`;
    console.log('Edge Function URL:', edgeUrl);

    try {
        const response = await fetch(edgeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ url: 'example.com' })
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error Response:', data);

            if (response.status === 401) {
                console.log('\n🔍 401 Unauthorized - Possible causes:');
                console.log('1. Edge Function not deployed to Supabase');
                console.log('2. Edge Function expects different auth format');
                console.log('3. CORS or environment variable mismatch');
            }
        } else {
            console.log('✅ Success!', data);
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
    }

    console.log('\n=== Debug Complete ===');
}

// Run the debug function
debugAuth();

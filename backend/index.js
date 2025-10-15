const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client (optional)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// S3-compatible client (Supabase Storage S3 API)
const s3 = new S3Client({
  region: process.env.SUPABASE_S3_REGION || 'us-east-1',
  endpoint: process.env.SUPABASE_S3_ENDPOINT, // e.g., https://...supabase.co/storage/v1/s3
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'JobSearch Backend is running!' });
});

// Generate presigned PUT URL for direct uploads to Supabase Storage via S3 API
app.post('/storage/upload-url', async (req, res) => {
  try {
    const { userId, contentType = 'application/pdf' } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Validate env for S3-compatible access
    if (!process.env.SUPABASE_S3_ENDPOINT || !process.env.SUPABASE_S3_ACCESS_KEY_ID || !process.env.SUPABASE_S3_SECRET_ACCESS_KEY) {
      return res.status(500).json({ error: 'S3 not configured', detail: 'Missing SUPABASE_S3_* env vars' });
    }

    const bucket = process.env.RESUMES_BUCKET || 'resume';
    const key = `${userId}/resume-${Date.now()}.pdf`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds

    // If bucket is public, this URL will serve the file after upload
    const supaUrl = process.env.SUPABASE_URL || '';
    const publicUrl = supaUrl
      ? `${supaUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${key}`
      : undefined;

    return res.json({ url, bucket, key, publicUrl });
  } catch (error) {
    const detail = error?.message || error?.code || 'unknown';
    console.error('presign error', detail);
    return res.status(500).json({ error: 'Failed to create upload URL', detail });
  }
});

// Proxy: Scrapingdog LinkedIn Jobs → normalized jobs
app.get('/jobs', async (req, res) => {
  try {
    const apiKey = process.env.SCRAPINGDOG_API_KEY;

    // Provide a graceful fallback with sample jobs when no API key is configured
    if (!apiKey || String(req.query.mock).trim() === '1') {
      const sample = [
        {
          id: 'sample-1',
          title: 'Frontend Developer',
          company: 'Acme Corp',
          location: 'Remote',
          salary: '—',
          type: 'Full-time',
          posted: 'Recently',
          description: 'Build delightful web interfaces using React and Next.js.',
          rating: 4.6,
          isRemote: true,
          isFeatured: true,
          matchPercent: 82,
          applyUrl: 'https://example.com/apply/frontend',
          logo: undefined,
        },
        {
          id: 'sample-2',
          title: 'Backend Engineer',
          company: 'Globex',
          location: 'New York, NY',
          salary: '$130k – $160k',
          type: 'Full-time',
          posted: '1 day ago',
          description: 'Design and scale Node.js services and APIs.',
          rating: 4.2,
          isRemote: false,
          isFeatured: false,
          matchPercent: 74,
          applyUrl: 'https://example.com/apply/backend',
          logo: undefined,
        },
        {
          id: 'sample-3',
          title: 'Data Scientist',
          company: 'Initech',
          location: 'Hybrid - San Francisco, CA',
          salary: '—',
          type: 'Contract',
          posted: '3 days ago',
          description: 'Build ML models and collaborate with product teams.',
          rating: 4.8,
          isRemote: false,
          isFeatured: false,
          matchPercent: 67,
          applyUrl: 'https://example.com/apply/datasci',
          logo: undefined,
        },
      ];
      return res.json({ jobs: sample });
    }

    const params = { api_key: apiKey };
    if (typeof req.query.field === 'string' && req.query.field.trim()) params.field = req.query.field.trim();
    if (!params.field) return res.status(400).json({ error: 'field is required' });
    if (typeof req.query.location === 'string' && req.query.location.trim()) params.location = req.query.location.trim();
    if (typeof req.query.geoid === 'string' && req.query.geoid.trim()) params.geoid = req.query.geoid.trim();
    // default geoid to global if neither provided
    if (!params.location && !params.geoid) params.geoid = '92000000';
    const pageNum = Number(req.query.page || 1);
    if (!Number.isNaN(pageNum) && pageNum > 0) params.page = String(pageNum);
    const sortRaw = String(req.query.sort_by || '').toLowerCase();
    const sortMap = { dd: 'day', day: 'day', week: 'week', month: 'month' };
    if (sortMap[sortRaw]) params.sort_by = sortMap[sortRaw];
    const jobTypeRaw = String(req.query.job_type || '').toUpperCase();
    const jobMap = { F: 'full_time', P: 'part_time', C: 'contract', T: 'temporary', I: 'internship' };
    if (jobMap[jobTypeRaw]) params.job_type = jobMap[jobTypeRaw];
    const workRaw = String(req.query.work_type || '');
    const workMap = { '1': 'at_work', '2': 'remote', '3': 'hybrid' };
    if (workMap[workRaw]) params.work_type = workMap[workRaw];
    if (typeof req.query.exp_level === 'string' && req.query.exp_level.trim()) {
      const expMap = { '1': 'internship', '2': 'entry_level', '3': 'associate', '4': 'mid_senior_level', '5': 'director' };
      const mapped = req.query.exp_level.split(',').map(s => expMap[String(s).trim()]).filter(Boolean);
      if (mapped.length) params.exp_level = mapped.join(',');
    }
    if (typeof req.query.filter_by_company === 'string' && req.query.filter_by_company.trim()) params.filter_by_company = req.query.filter_by_company.trim();

    // Debug: log final params (without key)
    const debugParams = { ...params, api_key: '***' };
    console.log('Scrapingdog GET /jobs params:', debugParams);
    const { data } = await axios.get('https://api.scrapingdog.com/jobs', { params, timeout: 30000 });

    // Normalize a minimal shape for frontend
    const raw = Array.isArray(data) ? data : (Array.isArray(data?.jobs) ? data.jobs : []);
    const jobs = raw.map((j, idx) => ({
      id: String(j.job_id || j.id || idx),
      title: j.job_position || j.title || 'Job',
      company: j.company_name || j.company || 'Company',
      location: j.job_location || j.location || '—',
      salary: j.salary || j.pay || '—',
      type: j.job_type || j.employment_type || '—',
      posted: j.job_posting_date || j.posted_time || 'Recently',
      description: j.description || j.snippet || '',
      rating: j.rating || undefined,
      isRemote: /remote/i.test(String(j.location || j.job_location || '')) || false,
      isFeatured: false,
      matchPercent: j.match || j.score || undefined,
      applyUrl: j.job_link || j.job_url || j.url || undefined,
      logo: j.company_logo || undefined,
    }));

    res.json({ jobs });
  } catch (e) {
    const status = e.response?.status || 500;
    const detail = e.response?.data || e.message || 'Failed to fetch jobs';
    console.error('jobs proxy error', status, detail);
    res.status(status).json({ error: 'Failed to fetch jobs', detail });
  }
});

// Auth routes
app.post('/auth/signup', async (req, res) => {
  if (!supabase) return res.status(501).json({ error: 'Auth not configured' });
  try {
    const { email, password, userData } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData || {}
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'User created successfully', 
      user: data.user,
      session: data.session 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/signin', async (req, res) => {
  if (!supabase) return res.status(501).json({ error: 'Auth not configured' });
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Signed in successfully', 
      user: data.user,
      session: data.session 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/signout', async (req, res) => {
  if (!supabase) return res.status(501).json({ error: 'Auth not configured' });
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/user', async (req, res) => {
  if (!supabase) return res.status(501).json({ error: 'Auth not configured' });
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// No domain routes yet; jobs are fetched via external API from the frontend.

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler (Express 5: no star path)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 JobSearch Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

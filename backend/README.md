# JobSearch Backend

A Node.js backend server for the JobSearch application with Supabase authentication.

## Features

- 🔐 Supabase Authentication (Sign Up, Sign In, Sign Out)
- 🚀 Express.js REST API
- 🌐 CORS enabled for frontend integration
- 📊 Health check endpoint
- 🔧 Environment-based configuration

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `env.example` to `.env`
   - Fill in your Supabase credentials:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Start the production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create a new user account
- `POST /auth/signin` - Sign in with email and password
- `POST /auth/signout` - Sign out the current user
- `GET /auth/user` - Get current user information

### General
- `GET /health` - Health check endpoint
- `GET /jobs` - Get job listings (placeholder)

## Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and keys
3. Enable email authentication in Authentication > Settings
4. Configure your email templates if needed

## Development

The server runs on `http://localhost:3001` by default.

### Health Check
Visit `http://localhost:3001/health` to verify the server is running.

## Next Steps

- [ ] Add job posting and management endpoints
- [ ] Implement user profile management
- [ ] Add job search and filtering
- [ ] Set up database migrations
- [ ] Add input validation and error handling
- [ ] Implement rate limiting
- [ ] Add logging and monitoring

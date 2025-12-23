# VAUL AI - Quick Start Guide

Get up and running with VAUL AI in 10 minutes!

## What is VAUL AI?

VAUL AI is your personal secure vault for:
- 📝 **Notes** - Create and organize your thoughts
- 📁 **Files** - Store documents and images securely
- 🤖 **AI Assistant** - Get help with writing and ideas
- 🔐 **Security** - Everything is encrypted and protected

## Prerequisites

Before you start, make sure you have:
- ✅ A GitHub account
- ✅ A [Supabase](https://supabase.com) account (free tier works!)
- ✅ An [OpenAI](https://platform.openai.com) API key (optional for AI features)

## 5-Minute Setup

### Step 1: Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - Project name: `vaul-ai`
   - Database password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for project to be ready (~1 minute)

### Step 2: Create Database Tables (1 minute)

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Copy all content from `supabase-setup.sql` file in this repo
4. Paste and click **"Run"**
5. You should see: ✅ Success!

### Step 3: Create Storage Bucket (30 seconds)

1. Go to **Storage** in Supabase sidebar
2. Click **"New Bucket"**
3. Name it: `vault`
4. Make it **Public**
5. Click **"Create bucket"**

### Step 4: Get Your Keys (30 seconds)

1. Go to **Project Settings** → **API**
2. Copy these values:
   - Project URL
   - `anon` `public` key
3. Keep them handy for next step!

### Step 5: Set Up Locally (2 minutes)

```bash
# 1. Clone the repo
git clone https://github.com/Azoussin/Azoussin.github.io.git
cd Azoussin.github.io

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local with your values
# Open .env.local and paste your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
# OPENAI_API_KEY=your_openai_key_here (optional)

# 5. Run the app
npm run dev
```

### Step 6: Use the App! 🎉

1. Open http://localhost:3000
2. Click **"Create Account"**
3. Enter your email and password
4. You're in! Start using VAUL AI

## First Steps in VAUL AI

### Create Your First Note
1. Click **"Notes"** in the sidebar
2. Click **"New Note"**
3. Add a title and content
4. Click **"Save Note"**

### Upload Your First File
1. Click **"Files"** in the sidebar
2. Click **"Upload File"**
3. Select an image or document
4. Done! Your file is securely stored

### Try the AI Assistant (Optional)
1. Click **"AI Assistant"** in the sidebar
2. Type a message like "Help me write a professional email"
3. Get instant AI-powered responses

## Customization

### Change Theme
Click the 🌙/☀️ icon in the sidebar to toggle dark/light mode.

### Update Profile
1. Click **"Settings"**
2. Update your display name
3. Click **"Save Changes"**

## Deployment (Optional)

Want to deploy to production? It's easy!

### Deploy to Vercel (Free)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Add environment variables
5. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Troubleshooting

### "Failed to fetch" errors
- Check your Supabase URL and keys in `.env.local`
- Make sure you ran the SQL setup script
- Verify the storage bucket is created

### Can't upload files
- Ensure the `vault` bucket exists in Supabase Storage
- Check that the bucket is set to Public
- Verify RLS policies are applied

### AI Assistant not working
- Make sure you have an OpenAI API key
- Check the API key is correct in `.env.local`
- Verify you have API credits in your OpenAI account

### Build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Try `npm run build` to see detailed errors

## Getting Help

- 📖 Read the full [README.md](./README.md)
- 🔒 Check [SECURITY.md](./SECURITY.md) for security info
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
- 🐛 Open an issue on GitHub for bugs

## Tips & Tricks

### Keyboard Shortcuts (Coming Soon!)
We plan to add keyboard shortcuts for common actions.

### Organize Your Notes
Use descriptive titles to easily find notes later.

### File Management
You can download any file you've uploaded at any time.

### AI Assistant Tips
- Be specific in your questions
- Ask for different styles (formal, casual, etc.)
- Request summaries of long text
- Get help with brainstorming ideas

## What's Next?

Now that you're set up, explore these features:
- [ ] Create multiple notes
- [ ] Upload different file types
- [ ] Chat with the AI assistant
- [ ] Toggle dark mode
- [ ] Update your profile

## Need More Help?

- **Full Documentation**: See [README.md](./README.md)
- **Security Questions**: Read [SECURITY.md](./SECURITY.md)
- **Deployment Help**: Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Enjoy using VAUL AI! 🚀**

If you find this helpful, consider giving us a ⭐ on GitHub!

Last updated: December 2025

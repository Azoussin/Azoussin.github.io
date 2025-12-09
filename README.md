# 🔐 VAUL AI - Your Secure Smart Vault

A production-ready Next.js 15 application for secure note-taking, file storage, and AI-powered assistance.

## ✨ Features

### 🔐 Authentication (Supabase)
- Email/password registration and login
- Protected routes with middleware
- Session management
- User profile management

### 📝 Notes System
- Create, read, update, and delete notes
- Real-time synchronization with Supabase
- Clean, card-based UI
- Personal note organization

### 📂 File Storage
- Upload files (images, PDFs, documents)
- Store files in Supabase Storage bucket "vault"
- Image previews for uploaded images
- Download and delete files
- File metadata tracking

### 🤖 AI Assistant
- GPT-4o-mini powered chat interface
- Conversation history tracking
- Help with summarizing, rewriting, and idea generation
- Real-time responses
- Persistent chat history

### 🎨 Modern UI/UX
- shadcn/ui components
- Tailwind CSS styling
- Dark/Light mode toggle
- Responsive design for mobile and desktop
- Professional dashboard with sidebar navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- An OpenAI API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Azoussin/Azoussin.github.io.git
cd Azoussin.github.io
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the following SQL in your Supabase SQL Editor:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create notes table
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table
CREATE TABLE files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_history table
CREATE TABLE ai_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_history ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for notes
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for files
CREATE POLICY "Users can view their own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
  ON files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
  ON files FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for ai_history
CREATE POLICY "Users can view their own ai_history"
  ON ai_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ai_history"
  ON ai_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ai_history"
  ON ai_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ai_history"
  ON ai_history FOR DELETE
  USING (auth.uid() = user_id);
```

3. **Create a Storage bucket**

Go to Storage in your Supabase dashboard and create a new public bucket named `vault`.

Then add the following RLS policies for the storage bucket:

```sql
-- Storage policies for vault bucket
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vault' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'vault' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vault' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

4. **Get your Supabase credentials**

- Go to Project Settings > API
- Copy your project URL and anon public key
- Add them to your `.env.local` file

### OpenAI Setup

1. **Get an OpenAI API key** at [platform.openai.com](https://platform.openai.com)
2. Add the key to your `.env.local` file

### Running the Application

**Development mode:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production:**

```bash
npm run build
npm start
```

## 📁 Project Structure

```
.
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   └── assistant/
│   ├── dashboard/
│   ├── notes/
│   ├── files/
│   ├── assistant/
│   ├── settings/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── label.tsx
│   ├── sidebar.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to DigitalOcean App Platform

1. Push your code to GitHub
2. Create a new app in DigitalOcean App Platform
3. Connect your repository
4. Add environment variables
5. Deploy!

**Build settings:**
- Build Command: `npm run build`
- Run Command: `npm start`

## 🛡️ Security

### Row Level Security (RLS)

All database tables have RLS enabled with policies that ensure:
- Users can only access their own notes
- Users can only access their own files
- Users can only access their own AI conversation history
- All policies check `auth.uid() = user_id`

### Authentication

- Powered by Supabase Auth
- Secure session management
- Protected routes via middleware
- Email/password authentication

### Data Encryption

- All data encrypted at rest
- Secure HTTPS connections
- Environment variables for sensitive data

## 🎨 Customization

### Theme

The application supports dark and light modes. You can customize colors in `app/globals.css`.

### UI Components

UI components are based on shadcn/ui and can be customized in the `components/ui/` directory.

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 15, Supabase, OpenAI, and shadcn/ui
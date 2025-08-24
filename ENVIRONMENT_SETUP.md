# Environment Setup Guide

## 1. Create Environment File

Create a `.env` file in your project root with the following content:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 2. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select existing one
3. Go to Project Settings → API
4. Copy the "Project URL" and "anon public" key
5. Replace the placeholder values in your `.env` file

## 3. Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly', 'custom')),
  renewal_date DATE NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for user access
CREATE POLICY "Users can only access their own subscriptions"
ON subscriptions FOR ALL
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_renewal_date ON subscriptions(renewal_date);

-- Enable realtime for subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
```

## 4. Authentication Setup

1. Go to Authentication → Settings in Supabase
2. Enable "Enable email confirmations" if you want email verification
3. Configure any additional auth providers as needed

## 5. Test the Setup

After setting up:
1. Run `npm run typecheck` to verify TypeScript compilation
2. Start the app with `npm start`
3. Try to sign up with a test account
4. Verify the database connection works

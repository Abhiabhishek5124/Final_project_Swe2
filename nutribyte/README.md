# Nutribyte - Personalized Nutrition & Fitness

A web application that provides personalized nutrition and fitness plans based on user goals and preferences.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm or pnpm (recommended)
- Git

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd nutribyte
```

2. **Install dependencies**

```bash
# Using npm
npm install

# OR using pnpm (recommended)
pnpm install
```

3. **Set up Supabase**

- Go to [Supabase](https://supabase.com) and create a new project
- Once created, go to Project Settings > API
- Copy the following values:
  - Project URL
  - `anon` public key
  - `service_role` secret key

4. **Configure Environment Variables**
   Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

5. **Set up the Database**

- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Copy and paste the contents of `sql/schema.sql` into the editor
- Run the SQL script to create the necessary tables and policies

## Running the Application

1. **Development Mode**

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

The application will be available at `http://localhost:3000`

2. **Build for Production**

```bash
# Using npm
npm run build
npm start

# OR using pnpm
pnpm build
pnpm start
```

## Project Structure

```
nutribyte/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── ...
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── public/               # Static assets
├── sql/                  # Database schema and migrations
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Features

- User Authentication (Sign up, Login)
- Personalized Fitness Data Collection
- Nutrition Plan Generation
- Workout Plan Generation
- Dashboard with Progress Tracking

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Supabase (Database & Authentication)
- Tailwind CSS
- Shadcn UI Components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# NutriByte - Your Personal Health & Nutrition Companion

NutriByte is a comprehensive health and nutrition tracking application that helps users monitor their fitness goals, track their nutrition, and maintain a healthy lifestyle. The application provides personalized insights based on user data and offers tools for managing diet and exercise routines.

## Features

- **Personal Profile Management**: Store and update your personal information, fitness goals, and dietary preferences
- **Health Status Monitoring**: Track your BMI and overall health status with visual indicators
- **Nutrition Tracking**: Monitor your daily calorie intake and nutritional values
- **Fitness Goals**: Set and track progress towards your fitness objectives
- **Dietary Preferences**: Specify dietary restrictions and preferences for personalized recommendations
- **AI-Powered Chatbot**: Get instant answers to your health and nutrition questions with our intelligent chatbot
- **Personalized Workout Plans**: Receive customized workout routines based on your fitness level and goals
- **Nutrition Plans**: Get tailored meal plans and dietary recommendations based on your preferences and requirements
- **Progress Tracking**: Monitor your fitness journey with detailed analytics and progress reports

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (v9 or higher)
- A Supabase account (for backend services)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone [your-repository-url]
   cd nutribyte
   ```

2. **Install dependencies**

   ```bash
   npm install --force
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase credentials.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**
   Visit `http://localhost:3000` in your web browser

## Project Structure

```
nutribyte/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── dashboard/        # Dashboard-related components
│   └── ui/              # Reusable UI components
├── lib/                  # Utility functions and configurations
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for their invaluable tools and libraries

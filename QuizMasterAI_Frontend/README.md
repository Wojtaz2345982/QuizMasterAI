# QuizMaster AI - Frontend
# Builded with  ![image](https://github.com/user-attachments/assets/247e4669-69d6-44f3-95be-3ff5a01df22c)


A modern, AI-powered quiz application built with React and TypeScript.

## 🚀 Tech Stack

- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **State Management:** React Context
- **Routing:** React Router
- **API Integration:** Fetch API with TypeScript

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- Supabase account for authentication

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd QuizMasterAI_Frontend
```

2. Install dependencies:
```bash
npm install
# or with bun
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:
```
VITE_API_URL=your_backend_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or with bun
bun run dev
```

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── integrations/  # Third-party integrations (Supabase)
├── lib/          # Utility functions and configurations
├── pages/        # Main application pages
├── services/     # API service layer
└── types/        # TypeScript type definitions
```

## 🔐 Authentication

The application uses Supabase Authentication with the following features:
- Email/Password authentication
- Session management
- Protected routes
- Automatic token refresh

## 📱 Key Features

- **User Authentication:** Secure login/signup system
- **Quiz Creation:** Create custom quizzes with multiple questions
- **Quiz Management:** Edit and manage your created quizzes
- **Quiz Solving:** Interactive quiz-taking interface
- **Results Tracking:** View and analyze quiz results

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |
| VITE_SUPABASE_URL | Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | Yes |

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

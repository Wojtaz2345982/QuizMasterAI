# QuizMaster AI Backend

A modern, scalable backend service for the QuizMaster application built with .NET 8.0, implementing best practices and clean architecture principles.

## 🚀 Technology Stack

- **.NET 8.0** - Latest .NET platform
- **ASP.NET Core** - Web API framework
- **JWT Authentication** - Secure token-based authentication
- **Microservices Architecture** - Using .NET Aspire for cloud-native applications
- **Clean Architecture** - Following SOLID principles and clean code practices

## 📋 Prerequisites

- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0) or later
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) (recommended) or [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/) for version control

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/QuizMaster.git
cd QuizMaster
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Build the solution:
```bash
dotnet build
```

4. Run the application:
```bash
dotnet run --project QuizMaster/QuizMaster.csproj
```

## ⚙️ Configuration

### Authentication Settings
Configure JWT authentication settings in `appsettings.json`:
```json
{
  "Auth": {
    "ValidIssuer": "your_issuer",
    "ValidAudience": "your_audience"
  }
}
```

### User Secrets Configuration
```json
{
  "JWTSecretKey": "your_secret_key",
  "OPENAI_API_KEY": "your_openai_api_key",
  "SupabaseUrl": "your_supabase_url",
  "SupabaseKey": "your_supabase_key"
}
```

### Development Configuration

1. Create a user secrets file for development:
```bash
dotnet user-secrets init --project QuizMaster/QuizMaster.csproj
```

2. Add your secrets:
```bash
dotnet user-secrets set "Auth:SecretKey" "your-secret-key" --project QuizMaster/QuizMaster.csproj
```

## 🏗️ Project Structure

- `QuizMaster/` - Main application project
- `QuizMaster.AppHost/` - .NET Aspire host project for orchestrating microservices
- `QuizMaster.ServiceDefaults/` - Shared service configurations and defaults

## 🔒 Security Features

- JWT-based authentication
- User secrets management
- Secure configuration handling
- HTTPS enforcement
- Cross-Origin Resource Sharing (CORS) configuration
- Input validation and sanitization

## 🚦 API Endpoints

Document your API endpoints here using the following format:


### Quiz Management

```
GET /api/quizzes
POST /api/quizzes
GET /api/quizzes/{id}
PUT /api/quizzes/{id}
DELETE /api/quizzes/{id}
```

## 🧪 Testing

Run the tests using:
```bash
dotnet test
```

## 📦 Deployment

1. Build the release version:
```bash
dotnet publish -c Release
```

2. For containerized deployment, use Docker:
```bash
docker build -t quizmaster .
docker run -p 5000:80 quizmaster
```

## 🔍 Logging and Monitoring

The application uses structured logging with Serilog. Logs are configured in `appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## ✨ Acknowledgments

- .NET Team for the excellent framework
- All contributors who help improve this project

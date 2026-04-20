# TypeScript API Starter 🚀

Production-ready TypeScript REST API with MongoDB, Redis, JWT Authentication and security middlewares. Deploy on Railway in one click.

[

![Deploy on Railway](https://railway.com/button.svg)

](https://railway.com/template/typescript-api-starter)

## Features

- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Email verification with OTP
- ✅ Password reset with OTP
- ✅ Redis rate limiting
- ✅ Input validation with Zod
- ✅ Global error handler
- ✅ MongoDB with Mongoose
- ✅ Email provider-agnostic (Resend, SMTP, SendGrid)
- ✅ Production-ready Dockerfile

## Stack

- **Runtime**: Node.js 18
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Cache**: Redis
- **Auth**: JWT
- **Validation**: Zod

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /auth/register | Create account + send OTP |
| POST | /auth/verify-email | Verify OTP |
| POST | /auth/login | Login → JWT tokens |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/forgot-password | Send reset OTP |
| POST | /auth/reset-password | Reset password |
| POST | /auth/logout | Logout |
| GET | /health | Health check |

## Environment Variables

| Variable | Description |
|----------|-------------|
| MONGO_URL | MongoDB connection URL |
| REDIS_URL | Redis connection URL |
| JWT_SECRET | JWT secret key |
| JWT_REFRESH_SECRET | JWT refresh secret key |
| EMAIL_PROVIDER | resend / smtp / sendgrid |
| EMAIL_API_KEY | Email provider API key |
| EMAIL_FROM | Sender email address |

## Deploy on Railway

1. Click the **Deploy on Railway** button above
2. Add your environment variables
3. Your API is live!

## License

MIT

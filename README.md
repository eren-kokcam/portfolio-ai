# Portfolio AI

An AI-powered investment portfolio analyzer that provides intelligent insights and recommendations for your stock portfolio using Claude AI.

![Portfolio AI](https://img.shields.io/badge/AI-Claude-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi) ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript)

## Overview

Portfolio AI is a full-stack application that combines real-time stock market data with AI-powered analysis to help users understand their investment portfolios better. Ask questions about your holdings, get performance insights, and receive personalized recommendations.

## Features

- **AI-Powered Analysis**: Get intelligent portfolio insights using Anthropic's Claude AI
- **Real-time Stock Data**: Fetch current market data for your holdings using yfinance
- **Interactive Visualizations**: View portfolio performance with interactive charts powered by Recharts
- **User Authentication**: Secure user authentication and data persistence with Supabase
- **Portfolio Management**: Save and manage multiple portfolios
- **Natural Language Queries**: Ask questions about your portfolio in plain English
- **Beautiful UI**: Modern, responsive interface with 3D elements using Spline and Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization
- **React Markdown** - Render AI responses
- **Spline** - 3D graphics and animations
- **Supabase JS** - Authentication and database client
- **Sonner** - Toast notifications

### Backend
- **FastAPI** - Modern Python web framework
- **Anthropic SDK** - Claude AI integration
- **yfinance** - Stock market data
- **Supabase** - Authentication and database
- **Uvicorn** - ASGI server
- **Pandas** - Data manipulation
- **Python-dotenv** - Environment variable management

## Project Structure

```
portfolio-ai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and external services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   └── package.json
│
└── backend/                 # FastAPI backend application
    ├── routers/            # API route handlers
    ├── services/           # Business logic services
    ├── models/             # Pydantic models
    ├── core/               # Core configurations
    ├── main.py            # FastAPI application entry point
    └── requirements.txt
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account
- Anthropic API key

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

**Frontend `.env`:**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

### Installation

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Sign Up/Login**: Create an account or sign in using Supabase authentication
2. **Create Portfolio**: Add your stock holdings with ticker symbols and quantities
3. **Ask Questions**: Enter natural language questions about your portfolio
4. **Get Insights**: Receive AI-powered analysis and recommendations
5. **View Charts**: Visualize portfolio performance and allocation
6. **Save Portfolios**: Manage multiple portfolios for different investment strategies

## API Endpoints

### Portfolio Analysis
```
POST /portfolio
```
Analyzes a portfolio and returns AI-generated insights with stock data.

**Request Body:**
```json
{
  "items": [
    {"ticker": "AAPL", "quantity": 10}
  ],
  "user_question": "How is my portfolio performing?"
}
```

### Health Check
```
GET /health
```
Returns server health status.

## Deployment

The application is deployed on:
- **Frontend**: Vercel ([portfolio-ai-eren.vercel.app](https://portfolio-ai-eren.vercel.app))
- **Backend**: Your preferred hosting platform (configured with CORS for Vercel domains)

## Development

### Frontend Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend Development
```bash
uvicorn main:app --reload  # Start dev server with hot reload
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Anthropic Claude](https://www.anthropic.com/) for AI capabilities
- [Supabase](https://supabase.com/) for authentication and database
- [yfinance](https://github.com/ranaroussi/yfinance) for stock market data
- [Spline](https://spline.design/) for 3D graphics

## Contact

For questions or feedback, please open an issue on GitHub.

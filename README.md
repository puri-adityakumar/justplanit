# 🚀 Just Plan It!

**An AI-powered startup idea validation platform that provides comprehensive analysis and actionable insights for entrepreneurs.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://justplanit.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/puri-adityakumar/justplanit)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

## 📋 Overview

Just Plan It! is a cutting-edge web application that leverages artificial intelligence to validate startup ideas. It provides entrepreneurs with comprehensive market analysis, competitive intelligence, technical feasibility assessments, and financial projections to make informed decisions about their business ventures.

### ✨ Key Features

- **🤖 AI-Powered Analysis**: Advanced AI algorithms analyze your startup idea across multiple dimensions
- **� Secure Authentication**: Passwordless email OTP authentication with Appwrite
- **�📊 Interactive Dashboard**: Beautiful, animated dashboard with comprehensive validation results
- **📈 Market Intelligence**: Real-time market analysis with size, trends, and opportunities
- **🏆 Competitive Analysis**: In-depth competitor research and positioning insights
- **💰 Financial Projections**: Revenue forecasts, funding requirements, and ROI calculations
- **🛠️ Technical Feasibility**: Assessment of technical complexity and resource requirements
- **⚠️ Risk Assessment**: Comprehensive risk analysis with mitigation strategies
- **🗺️ Implementation Roadmap**: Phase-by-phase execution plan with timelines and budgets
- **👤 User Profiles**: Save and track your validation history
- **📄 PDF Export**: Professional report generation with one-click export
- **🎨 Smooth Animations**: Framer Motion powered animations for enhanced UX

### 🎯 Target Audience

- **Entrepreneurs** looking to validate their startup ideas
- **Investors** seeking quick due diligence on potential investments
- **Business Consultants** needing rapid market analysis tools
- **Students** learning about entrepreneurship and market validation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Authentication**: Appwrite (Email OTP)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **AI Integration**: OpenRouter API
- **PDF Generation**: html2canvas + jsPDF
- **Package Manager**: npm/bun

## 🚀 Installation

### Prerequisites

- Node.js 18.x or higher
- npm or bun package manager
- Git

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/puri-adityakumar/justplanit.git
   cd justplanit
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys to `.env.local`:

   ```env
   # OpenRouter API for AI analysis
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

   # Appwrite for authentication
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id_here
   VITE_APPWRITE_DATABASE_ID=your_database_id_here
   VITE_APPWRITE_COLLECTION_ID=your_collection_id_here
   ```

   📖 **See [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for detailed Appwrite configuration**

4. **Start the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
# or
bun run build
```

### Preview Production Build

```bash
npm run preview
# or
bun preview
```

## 📁 Project Structure

```
justplanit/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navigation.tsx
│   │   ├── HeroSection.tsx
│   │   └── QuickStartExamples.tsx
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── Index.tsx
│   │   ├── Dashboard.tsx
│   │   ├── AboutUs.tsx
│   │   ├── Validate.tsx
│   │   └── NotFound.tsx
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   └── main.tsx         # Application entry point
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🎨 Features in Detail

### AI-Powered Validation Engine

Our platform uses advanced AI models to analyze startup ideas across nine critical dimensions:

1. **Executive Summary** - Overall viability scoring and key insights
2. **Market Analysis** - TAM/SAM/SOM analysis, growth rates, and market readiness
3. **Competitive Analysis** - Competitor mapping, threat assessment, and differentiation
4. **Technical Feasibility** - Complexity rating, resource requirements, and technology stack
5. **Risk Assessment** - Risk identification, probability analysis, and mitigation strategies
6. **Financial Projections** - Revenue models, funding requirements, and ROI calculations
7. **Implementation Roadmap** - Phase-by-phase execution plan with timelines
8. **Recommendations** - Final verdict with success probability and next steps
9. **Sources & Citations** - Research quality and source verification

### Interactive Dashboard

- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Real-time Analysis**: Live progress tracking during AI analysis
- **Interactive Elements**: Hover effects, animations, and micro-interactions
- **Data Visualization**: Progress bars, charts, and visual indicators
- **Export Capabilities**: PDF generation with professional formatting

### Animation System

Built with Framer Motion for smooth, performant animations:

- **Entrance Animations**: Staggered card appearances with blur-to-clear effects
- **Hover Interactions**: Scale, brightness, and blur effects on hover
- **Progress Animations**: Animated progress bars with smooth fill effects
- **Micro-interactions**: Button states, loading spinners, and transitions

## 🔧 Configuration

### Environment Variables

| Variable                  | Description                        | Required |
| ------------------------- | ---------------------------------- | -------- |
| `VITE_OPENROUTER_API_KEY` | OpenRouter API key for AI analysis | Yes      |

### Customization

The application is highly customizable through:

- **Tailwind Config**: Modify colors, spacing, and design tokens
- **Component Library**: Extend or customize shadcn/ui components
- **Animation Settings**: Adjust Framer Motion variants and timings
- **API Integration**: Configure different AI providers or models

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Quality

This project follows best practices for:

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (via ESLint integration)
- **Component Organization**: Clear separation of concerns
- **Performance**: Optimized builds and lazy loading

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### OpenRouter Integration

The platform integrates with OpenRouter API for AI-powered analysis. The main analysis endpoint:

```typescript
POST /api/analyze
{
  "idea": "Your startup idea description"
}
```

Returns comprehensive validation data including market analysis, competitive intelligence, and recommendations.

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Add environment variables
5. Deploy!

### Other Platforms

The application can be deployed to any platform that supports static sites:

- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload build files to S3 bucket
- **GitHub Pages**: Use GitHub Actions for automatic deployment

## 🐛 Troubleshooting

### Common Issues

**Build Errors**

- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (18.x+ required)
- Clear node_modules and reinstall if needed

**API Errors**

- Verify your OpenRouter API key is correctly set
- Check API key permissions and quotas
- Ensure environment variables are properly loaded

**Animation Performance**

- Reduce motion on lower-end devices
- Check browser compatibility (modern browsers required)
- Disable animations in accessibility settings if needed

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Load Time**: < 2 seconds on 3G networks
- **Animation**: 60fps smooth animations

## 🛡️ Security

- No sensitive data stored on client-side
- API keys secured through environment variables
- HTTPS required for production deployments
- Regular dependency security audits

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🆕 Changelog

### v2.0.0 (Latest)

- ✨ Added Framer Motion animations
- 📄 Implemented PDF export functionality
- 🎨 Enhanced hover effects and micro-interactions
- 🚀 Improved performance and loading states

### v1.0.0

- 🎉 Initial release
- 🤖 AI-powered startup validation
- 📊 Interactive dashboard
- 📱 Responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Aditya Kumar Puri**

- GitHub: [@puri-adityakumar](https://github.com/puri-adityakumar)
- Project: [Just Plan It!](https://github.com/puri-adityakumar/justplanit)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [OpenRouter](https://openrouter.ai/) for AI model access
- [Lucide Icons](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 🔗 Links

- [Live Demo](https://justplanit.vercel.app)
- [Documentation](https://github.com/puri-adityakumar/justplanit/wiki)
- [Report Issues](https://github.com/puri-adityakumar/justplanit/issues)
- [Feature Requests](https://github.com/puri-adityakumar/justplanit/discussions)

---

**Made with ❤️ by [Aditya Kumar Puri](https://github.com/puri-adityakumar)**

_Empowering entrepreneurs to validate their ideas with AI-powered insights._

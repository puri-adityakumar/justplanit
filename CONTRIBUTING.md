# Contributing to Just Plan It!

First off, thank you for considering contributing to Just Plan It! 🎉

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

- **Clear title** describing the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, etc.)

### Suggesting Features

We welcome feature suggestions! Please:

- Check existing issues to avoid duplicates
- Provide clear use cases and benefits
- Include mockups or examples if possible
- Consider the scope and complexity

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   - Follow the existing code style
   - Add TypeScript types where needed
   - Include comments for complex logic
   - Update tests if applicable

4. **Test your changes**

   ```bash
   npm run build
   npm run lint
   ```

5. **Commit your changes**

   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push and create a Pull Request**

## 📝 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add meaningful comments

### Component Structure

```tsx
// Component imports
import { ... } from "react";
import { ... } from "external-library";

// Local imports
import { ... } from "@/components/...";
import { ... } from "@/lib/...";

// Types
interface ComponentProps {
  // Define props
}

// Component
export const Component = ({ ...props }: ComponentProps) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
};
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: kebab-case (`user-profile.ts`)
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Git Commit Messages

Use conventional commits:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## 🧪 Testing

Before submitting a PR:

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Run linting**

   ```bash
   npm run lint
   ```

3. **Test functionality**
   - Test the main validation flow
   - Check responsive design
   - Verify animations work smoothly
   - Test PDF export functionality

## 🎨 Design Guidelines

### UI/UX Principles

- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: 60fps animations, fast load times
- **Responsiveness**: Mobile-first design
- **Consistency**: Follow existing design patterns

### Animation Guidelines

- Use Framer Motion for all animations
- Keep animations under 300ms for micro-interactions
- Use easing functions for natural motion
- Respect `prefers-reduced-motion` settings

## 📦 Adding Dependencies

Before adding new dependencies:

1. Check if the functionality exists in current dependencies
2. Ensure the package is actively maintained
3. Consider bundle size impact
4. Add appropriate type definitions

## 🚀 Deployment

The project auto-deploys to Vercel on:

- **Main branch**: Production deployment
- **Dev branch**: Preview deployment

## 💬 Community

- **GitHub Discussions**: For questions and ideas
- **Issues**: For bugs and feature requests
- **Pull Requests**: For code contributions

## 📞 Support

If you need help:

1. Check existing documentation
2. Search closed issues
3. Create a new issue with details
4. Join our community discussions

## 🙏 Recognition

Contributors will be recognized in:

- README contributors section
- Release notes
- GitHub contributors page

Thank you for helping make Just Plan It! better! 🚀

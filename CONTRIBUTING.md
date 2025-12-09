# Contributing to VAUL AI

Thank you for your interest in contributing to VAUL AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the best interests of the project
- Help create a welcoming environment

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (for testing)
- An OpenAI API key (for AI features)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/Azoussin.github.io.git
   cd Azoussin.github.io
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/bug-description`
- Documentation: `docs/what-you-changed`

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Update documentation

3. **Test Your Changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Test additions or changes
   - `chore:` - Maintenance tasks

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` when possible
- Use strict mode

### React/Next.js

- Use functional components
- Prefer hooks over class components
- Use proper component naming (PascalCase)
- Keep components focused and reusable

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use template literals for string interpolation
- Keep lines under 100 characters when possible

### Comments

- Add JSDoc comments for functions
- Comment complex logic
- Explain "why" not "what"
- Keep comments up to date

Example:
```typescript
/**
 * Fetches user notes from Supabase
 * @returns Array of note objects
 */
async function fetchNotes() {
  // Implementation
}
```

## Component Structure

```
components/
├── ui/              # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── sidebar.tsx      # Navigation sidebar
└── theme-toggle.tsx # Dark mode toggle
```

## Adding New Features

### 1. Plan Your Feature

- Open an issue to discuss the feature
- Get feedback from maintainers
- Define acceptance criteria

### 2. Database Changes

If your feature requires database changes:

1. Update `supabase-setup.sql`
2. Add RLS policies
3. Document the schema changes

### 3. UI Components

- Use shadcn/ui components when possible
- Maintain consistent styling with Tailwind
- Ensure responsive design
- Test dark/light modes

### 4. API Routes

For new API routes:

1. Create in `app/api/[route]/route.ts`
2. Add authentication checks
3. Handle errors properly
4. Document the endpoint

Example:
```typescript
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Your logic here
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Works in light and dark mode
- [ ] Responsive on mobile
- [ ] Authentication still works
- [ ] Existing features not broken
- [ ] Build succeeds (`npm run build`)

### Future Testing

We plan to add automated tests. Contributions welcome!

## Documentation

Update documentation for:

- New features
- API changes
- Configuration changes
- Breaking changes

Files to update:
- `README.md` - Main documentation
- `SECURITY.md` - Security implications
- `DEPLOYMENT.md` - Deployment changes
- Code comments

## Security

### Reporting Vulnerabilities

**Do not** open public issues for security vulnerabilities.

Contact maintainers privately with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fixes (if any)

### Security Guidelines

- Never commit secrets or API keys
- Use environment variables
- Validate all user inputs
- Follow RLS best practices
- Keep dependencies updated

## Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add comments to new code
   - Update CHANGELOG (if exists)

2. **Ensure Quality**
   - Code builds successfully
   - No linting errors
   - Follows style guidelines
   - Tested manually

3. **Create PR**
   - Clear title and description
   - Link related issues
   - List changes made
   - Add screenshots for UI changes

4. **Review Process**
   - Address reviewer feedback
   - Update code as needed
   - Keep discussion professional
   - Be patient

## Code Review Guidelines

When reviewing PRs:

- Be constructive and respectful
- Test the changes locally
- Check for security issues
- Verify documentation
- Look for edge cases
- Suggest improvements

## Community

### Getting Help

- Open an issue for bugs
- Start a discussion for questions
- Check existing issues first
- Provide detailed information

### Communication

- Be respectful and professional
- Stay on topic
- Help others when you can
- Share knowledge

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md (when created)
- Mentioned in release notes
- Credited in commit messages
- Thanked for their work!

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## Questions?

Feel free to open an issue or reach out to maintainers.

Thank you for contributing to VAUL AI! 🎉

---

Last updated: December 2025

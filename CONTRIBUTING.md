# 🤝 Contributing to EcoFlow AI

Terima kasih sudah tertarik berkontribusi! Panduan ini membantu Anda memulai.

## 📋 Code of Conduct

- Bersikap ramah dan respectful terhadap semua kontributor
- Hindari diskriminasi dan harassment
- Fokus pada constructive feedback

---

## 🚀 Getting Started

### 1. Setup Development Environment

```bash
# Clone repo
git clone https://github.com/GomalRajaGula/EcoFlow-AI.git
cd EcoFlow-AI

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# atau untuk bug fixes:
git checkout -b fix/issue-number
```

Naming convention:
- `feature/` - Fitur baru
- `fix/` - Bug fix
- `docs/` - Documentation
- `refactor/` - Code cleanup tanpa perubahan fungsional
- `test/` - Test improvements

---

## 💻 Development Guidelines

### Backend (Python/FastAPI)

**Code Style**
```bash
# Format code
black app/

# Check linting
flake8 app/

# Type checking (optional)
mypy app/
```

**Project Structure**
- `/app/services/` - Business logic (eco_enzyme, fermentation_assistant, etc)
- `/app/routes/` - API route handlers
- `/app/models/` - Database models (SQLAlchemy)
- `/app/schemas/` - Pydantic request/response schemas
- `/app/core/` - Core utilities (auth, database, Firebase)

**Writing New Endpoints**

```python
# app/routes/example.py
from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import get_current_user
from app.models.base import User

router = APIRouter(prefix="/api/v1", tags=["example"])

@router.get("/example")
async def get_example(current_user: User = Depends(get_current_user)):
    """
    Get example data.
    
    - **current_user**: Authenticated user from Firebase
    """
    return {"status": "success", "data": {}}
```

**Writing Tests**

```python
# tests/test_example.py
import pytest
from app.services.example_service import ExampleService

class TestExampleService:
    def test_example_function(self):
        result = ExampleService.calculate_something(10)
        assert result == expected_value
```

Run tests:
```bash
pytest tests/ -v
pytest tests/test_example.py::TestExampleService::test_example_function -v
```

### Frontend (TypeScript/React)

**Code Style**
```bash
# Format & lint
npm run lint

# Type checking
npm run build
```

**Component Structure**

```typescript
// components/ExampleComponent.tsx
'use client';

import { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

interface ExampleComponentProps {
  title: string;
  onAction?: () => void;
}

export default function ExampleComponent({ title, onAction }: ExampleComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Logic here
      onAction?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button onClick={handleClick} isLoading={loading}>
        {title}
      </Button>
    </Box>
  );
}
```

**API Integration**

```typescript
// lib/api.ts sudah punya axios instance dengan auth
import apiClient from '@/lib/api';

// Usage di component
const response = await apiClient.post('/api/v1/example', {
  data: value
});
```

---

## 📝 Commit Messages

Gunakan Conventional Commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Format/whitespace (no code logic change)
- `refactor:` - Code refactor
- `test:` - Test additions/changes
- `chore:` - Dependency updates, build config

**Examples:**
```
feat(batch): add batch deletion endpoint
fix(auth): resolve Firebase token expiration issue
docs: update README with setup instructions
refactor(services): simplify eco_enzyme calculations
test(recommendations): add product ranking tests
```

---

## 🔄 Pull Request Process

### 1. Before Submitting PR

- [ ] Fork repository
- [ ] Create feature branch: `git checkout -b feature/your-feature`
- [ ] Run tests: `pytest` (backend) or `npm run lint` (frontend)
- [ ] Commit dengan descriptive messages
- [ ] Push ke fork: `git push origin feature/your-feature`

### 2. Create PR

**PR Title:** Jelas dan singkat
```
feat: add product recommendation ranking system
```

**PR Description:**

```markdown
## Description
Brief explanation of changes

## Related Issues
Closes #123

## Changes Made
- [ ] Added product ranking algorithm
- [ ] Updated API endpoint
- [ ] Added unit tests

## Testing
- [x] Manual testing di development
- [x] Unit tests passing
- [x] No console errors

## Screenshots (if applicable)
[Paste screenshots]

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Tests added/updated
- [x] No new warnings generated
```

### 3. Review Process

- Maintainer akan review code
- Request changes jika ada yang perlu diperbaiki
- Approve dan merge ketika semua OK

---

## 🐛 Reporting Issues

### Bug Reports

Title: `[BUG] Brief description`

```markdown
## Describe the bug
Clear and concise description

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected behavior
What should happen

## Actual behavior
What actually happens

## Screenshots
[If applicable]

## Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 90]
- Node version: [e.g. 16.0]
- Python version: [e.g. 3.14]
```

### Feature Requests

Title: `[FEATURE] Brief description`

```markdown
## Description
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
Any other approaches?

## Additional Context
[Any other info]
```

---

## 📚 Documentation

### Adding Documentation

1. **Docstrings (Backend)**
```python
def calculate_cogs(
    production_volume: float,
    total_cost: float
) -> float:
    """
    Calculate cost of goods sold per unit.
    
    Args:
        production_volume: Volume in liters
        total_cost: Total production cost in USD
    
    Returns:
        COGS per liter
    
    Examples:
        >>> calculate_cogs(100, 500)
        5.0
    """
    return total_cost / production_volume
```

2. **Component Comments (Frontend)**
```typescript
/**
 * BatchCard displays a fermentation batch summary
 * 
 * @param batch - The batch data to display
 * @param onLogClick - Callback when user clicks "Add Log"
 * @param isCompleted - Whether batch is completed
 */
```

3. **Update README** jika ada perubahan usage atau setup

---

## ✅ Checklist Sebelum Submit

- [ ] Code ter-format dengan benar
- [ ] Tests pass: `pytest` atau `npm run lint`
- [ ] No console errors/warnings
- [ ] Commit messages descriptive
- [ ] Documentation updated (README, docstrings)
- [ ] PR description lengkap
- [ ] Tidak ada breaking changes (atau dijelaskan)

---

## 🎓 Learning Resources

### Backend
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Pydantic Validation](https://docs.pydantic.dev/)

### Frontend
- [Next.js 15](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [Chakra UI](https://chakra-ui.com/docs/components)
- [TypeScript](https://www.typescriptlang.org/docs/)

### General
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Workflow](https://github.com/git-tips/tips)

---

## 🙏 Thank You!

Setiap kontribusi, sekecil apapun, sangat dihargai. Bersama kita bangun platform sustainable farming yang lebih baik!

Pertanyaan? Buka issue atau discuss di [Discussions](https://github.com/GomalRajaGula/EcoFlow-AI/discussions).

**Happy coding! 🌱**

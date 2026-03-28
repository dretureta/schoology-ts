# Contributing to schoology-ts

## GitFlow Workflow

This project follows a simplified GitFlow branching strategy:

```
main        → producción (releases, versiones stable)
develop     → integración (features se mergean aquí antes de release)
```

### Branch Hierarchy

| Branch | Purpose | Protected? |
|--------|---------|------------|
| `main` | Producción, releases oficiales | ✅ Yes |
| `develop` | Integración, pruebas antes de release | ✅ Yes |
| `feature/*` | Features nuevos | ❌ No |

### Workflow

#### 1. Start a Feature

```bash
# Desde develop, crea tu feature branch
git checkout develop
git pull origin develop
git checkout -b feature/mi-nueva-feature
```

#### 2. Trabaja en el Feature

```bash
# Haz commits regulares
git add .
git commit -m "feat: describe tu cambio"
```

#### 3. Mantén tu Branch Actualizado

```bash
# Rebase periodically desde develop
git fetch origin
git rebase origin/develop
```

#### 4. Merge a Develop

```bash
# Push tu feature
git push origin feature/mi-nueva-feature

# Crea PR en GitHub:
# feature/mi-nueva-feature → develop
```

#### 5. Release a Main

Cuando `develop` está listo para release:

```bash
# Desde develop, crea un release branch
git checkout develop
git pull origin develop
git checkout -b release/v0.3.0

# O simplemente merge develop → main y haz tag
git checkout main
git merge develop
git tag v0.3.0
git push origin main --tags
```

## Conventional Commits

Este proyecto usa Conventional Commits para el changelog automático.

### Formato

```
<tipo>(<scope>): <descripcion>

[body opcional]
```

### Tipos

| Tipo | Descripción |
|------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Bug fix |
| `docs` | Solo documentación |
| `refactor` | Refactoring sin cambio de funcionalidad |
| `test` | Agregar o modificar tests |
| `chore` | Mantenimiento, dependencias |
| `perf` | Mejoras de performance |
| `deps` | Actualización de dependencias |

### Ejemplos

```bash
git commit -m "feat: add bulk grade function"
git commit -m "fix: pagination cursor issue"
git commit -m "docs: add API examples"
git commit -m "chore: update dependencies"
```

## Release Process

1. Asegúrate que `develop` tiene todos los cambios
2. `develop` → `main` via PR
3. Merge a main dispara el workflow de release automáticamente
4. El workflow:
   - Corre tests
   - Si el commit empieza con `v` (ej: `v0.3.0`):
     - Crea GitHub Release
     - Publica en npm

### Hacer un Release

```bash
# Asegúrate estar en develop actualizado
git checkout develop
git pull origin develop

# Merge a main
git checkout main
git merge develop

# Tag con version semver
git tag v0.3.0

# Push
git push origin main
git push origin develop
git push origin v0.3.0
```

## Scripts Útiles

```bash
# Ver commits desde último tag
git log --oneline v0.2.0..HEAD

# Ver todos los tags
git tag -l

# Eliminar tag local
git tag -d v0.3.0

# Actualizar develop desde main (hotfix)
git checkout develop
git merge main
```

## Configuración de Branch Protection

En GitHub → Settings → Branches:

- `main`: Require pull request reviews, no force push
- `develop`: Require pull request reviews, no force push

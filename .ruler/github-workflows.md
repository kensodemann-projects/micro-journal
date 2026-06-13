# GitHub Workflows

## Issue Templates

Templates for Feature, Task, and Bug issues are in `.github/ISSUE_TEMPLATE/`. Read the appropriate template before creating or suggesting issues to ensure correct structure and frontmatter.

**Subtasks**: Do not create files. Output complete markdown for each subtask in chat first for review. When asked, create issues using the `gh` CLI. Link subtasks to the parent (e.g., "Related to #123").

## Pull Request Reviews

### Comment Format

**Issue:** Describe what needs attention  
**Suggestion:** Specific improvement with code example  
**Why:** Reasoning and benefits  
**Documentation:** Link to best-practices if applicable

### Labels

- 🔒 Security concerns (immediate attention)
- ⚡ Performance issues/optimizations
- 🧹 Code cleanup and maintainability
- 📚 Documentation gaps
- ✅ Positive feedback
- 🚨 Critical blockers
- 💭 Questions for discussion

## CI

Pull requests to `main` run `.github/workflows/node_ci.yml`: `pnpm install`, `pnpm build`, `pnpm test`, `pnpm lint`.

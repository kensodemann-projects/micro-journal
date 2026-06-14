# GitHub Workflows

## Issue Templates

Templates for Feature, Task, and Bug issues are in `.github/ISSUE_TEMPLATE/`. Read the appropriate template before creating or suggesting issues to ensure correct structure and frontmatter.

**Subtasks**: Do not create files. Output complete markdown for each subtask in chat first for review. When asked, create issues using the `gh` CLI. Link subtasks to the parent (e.g., "Related to #123").

## Pull Request Reviews

You will be asked to review pull requests. For example: "Please review pull request #123." or "Please review the changes in pull request #123."

If you are not given a number, ask for it. For example: "What is the pull request number?" or "What is the pull request number for the changes I need to review?"

### Workflow

When asked to review a pull request, follow these steps:

1. Switch to the PR branch: `gh pr checkout <pr-number>`
2. Generate the entire diff of the PR and save it to a temporary file: `gh pr diff > pr_review.diff`
3. Review the diff in the temporary file
4. Provide a detailed review of the changes
5. Create comments on the PR: `gh pr comment <pr-number> --body "<comment>"`
6. Provide a summary of the review: `gh pr review <pr-number> --body "<summary>"`
7. Delete the temporary file: `rm pr_review.diff`

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

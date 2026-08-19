# Contributing to Daily Todo App

Thanks for your interest in improving Daily Todo! This guide covers how to get set up
and submit changes.

## Code of Conduct

Be respectful and constructive. We want a welcoming community for everyone.

## How to Contribute

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Install dependencies** and run the app locally (see the README for Firebase setup).
3. **Make your changes** following the existing code style (functional React components,
   Tailwind for styling, lucide-react for icons).
4. **Test** your changes in the browser across mobile and desktop viewports.
5. **Commit** with a clear message:
   ```bash
   git commit -m "Add: export tasks to CSV"
   ```
6. **Push** and open a **Pull Request** describing what and why.

## Reporting Issues

Open an issue with:
- A clear title and description.
- Steps to reproduce (if it's a bug).
- Expected vs actual behavior.
- Screenshots if relevant.

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix.
- Update the README if you change user-facing behavior.
- Ensure `npm start` and `npm run build` succeed before submitting.

## Development Notes

- State lives in `src/DailyTodoApp.jsx`; task mutations flow through `saveTasks` (Firebase).
- UI is fully responsive and mobile-first — verify both layouts.
- Avoid committing `node_modules/` or Firebase credentials.

## Getting Help

Feel free to open an issue with questions. We appreciate every contribution!

// Shared static data used as a FALLBACK across the CodeSage AI sections.
// The sections try the backend first (see src/services/dataApi.js) and fall
// back to this data if the server is not running.

export const features = [
  { icon: '</>', title: 'Code Review', text: 'AI analyzes your code for bugs, performance issues, and anti-patterns.' },
  { icon: '\uD83D\uDCC4', title: 'Documentation', text: 'Auto-generate clean, comprehensive docs from your codebase.' },
  { icon: '\uD83E\uDDEA', title: 'Unit Tests', text: 'Generate thorough unit tests with edge case coverage.' },
  { icon: '\uD83D\uDEE1\uFE0F', title: 'Best Practices', text: 'Validate code against industry standards and conventions.' },
];

export const stats = [
  { icon: '</>', value: '3', label: 'Analyses Today', delta: '+2' },
  { icon: '\u25A5', value: '47', label: 'Total Reviews', delta: '+12' },
  { icon: '\u2713', value: '94%', label: 'Success Rate', delta: '+3%' },
];

export const activity = [
  { file: 'auth-middleware.ts', lang: 'TypeScript', score: 87, time: '2 hours ago' },
  { file: 'api-handler.py', lang: 'Python', score: 72, time: '5 hours ago' },
  { file: 'UserService.java', lang: 'Java', score: 91, time: 'Yesterday' },
  { file: 'main.go', lang: 'Go', score: 68, time: '2 days ago' },
];

export const dashboard = {
  user: { name: 'Ahmed' },
  stats,
  activity,
};

export const history = [
  { file: 'auth-middleware.ts', lang: 'TypeScript', score: 87, time: 'Today, 2:30 PM', snippet: 'export async function authMiddleware(req, res, next) { ... }' },
  { file: 'api-handler.py', lang: 'Python', score: 72, time: 'Today, 9:15 AM', snippet: 'def handle_request(event, context): ...' },
  { file: 'UserService.java', lang: 'Java', score: 91, time: 'Yesterday', snippet: 'public class UserService implements IUserService { ... }' },
  { file: 'main.go', lang: 'Go', score: 68, time: '2 days ago', snippet: 'func main() { router := mux.NewRouter() ... }' },
  { file: 'config.rs', lang: 'Rust', score: 95, time: '3 days ago', snippet: 'pub struct Config { pub database_url: String, ... }' },
  { file: 'index.tsx', lang: 'TypeScript', score: 83, time: '4 days ago', snippet: 'export default function App() { return <Main /> }' },
];

export const languages = [
  { name: 'JavaScript', level: 'Full', text: 'Full ES2024 support with JSX/TSX analysis' },
  { name: 'TypeScript', level: 'Full', text: 'Complete type-aware analysis and inference' },
  { name: 'Python', level: 'Full', text: 'PEP 8 compliance, type hints, async patterns' },
  { name: 'Java', level: 'Full', text: 'Spring Boot, design patterns, OOP analysis' },
  { name: 'C++', level: 'Partial', text: 'Modern C++20 standards and memory safety' },
  { name: 'Go', level: 'Full', text: 'Idiomatic Go patterns and goroutine analysis' },
  { name: 'Rust', level: 'Partial', text: 'Ownership, lifetimes, and safety patterns' },
  { name: 'C#', level: 'Beta', text: '.NET patterns, LINQ, and async analysis' },
];

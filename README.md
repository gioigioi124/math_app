# Math Learning App - MERN Stack

## Backend Structure

- **models/** → mongoose schema + interface
- **services/** → logic nghiệp vụ
- **controllers/** → nhận req, trả res
- **types/** → mở rộng type Express (req.user…)

## Mobile Structure

- **assets/** → hình ảnh và icons
- **components/** → các component tái sử dụng
  - **common/** → AppText, AppButton, ProgressBar
  - **lesson/** → LessonCard
  - **shop/** → Shop components
- **screens/** → các màn hình chính
  - **auth/** → Login, Register
  - **home/** → HomeScreen
  - **lesson/** → LessonList, LessonDetail, LessonComplete
  - **leaderboard/** → LeaderboardScreen
  - **shop/** → ShopScreen
  - **profile/** → ProfileScreen
- **navigation/** → cấu hình điều hướng
  - **AuthNavigator** → điều hướng auth
  - **TabNavigator** → bottom tabs
  - **RootNavigator** → root navigation
- **services/** → API calls
  - **api.ts** → axios instance
  - **auth.api.ts** → authentication API
  - **lesson.api.ts** → lesson API
  - **progress.api.ts** → progress API
- **store/** → state management (Zustand)
  - **auth.store.ts** → authentication state
  - **user.store.ts** → user data
  - **progress.store.ts** → lesson progress
- **types/** → TypeScript types
  - **user.type.ts** → User, AuthResponse
  - **lesson.type.ts** → Lesson, Progress
  - **navigation.type.ts** → navigation types
- **constants/** → hằng số
  - **colors.ts** → màu sắc theme
  - **spacing.ts** → spacing và border radius
- **hooks/** → custom hooks
  - **useProgress.ts** → quản lý progress
- **utils/** → utility functions
  - **format.ts** → format số và ngày tháng

## Cài đặt

### Backend

```bash
cd backend
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npm start
```

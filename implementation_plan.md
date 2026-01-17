# 📱 Math App UI Implementation Plan

## Mô tả dự án

Xây dựng giao diện ứng dụng học toán cho học sinh tiểu học (Lớp 1-5) với các đặc điểm:

- **Font to, ít chữ, nhiều icon** - Phù hợp trẻ em
- **4 tab chính** - Giảm thiểu sự phức tạp
- **Không bắt buộc đăng nhập** - Lưu tiến độ local trước
- **Màu sắc tươi sáng** - Teal (#14B8A6) làm màu chủ đạo

---

## User Review Required

> [!IMPORTANT]
> **Thứ tự triển khai**: Plan đề xuất làm UI + Navigation trước, Login/Backend sau. Điều này cho phép test app ngay lập tức mà không cần server.

> [!WARNING]
> **Mock Data**: Dữ liệu bài học sẽ là mock data cứng trong code. Cần confirm trước khi làm: Số lượng bài học mỗi lớp? Chủ đề cụ thể?

---

## Proposed Changes

### Phase 1: Navigation & Tab Layout

#### [MODIFY] [\_layout.tsx](<file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/(tabs)/_layout.tsx>)

Cập nhật tab layout từ 1 tab thành 4 tabs:

- 🏠 Home (index)
- 📚 Lessons (lessons)
- ⭐ Shop (shop)
- 👤 Profile (profile)

```tsx
// 4 Tabs với icons từ Feather
<Tabs.Screen name="index" options={{ title: "Trang chủ", icon: "home" }} />
<Tabs.Screen name="lessons" options={{ title: "Bài học", icon: "book-open" }} />
<Tabs.Screen name="shop" options={{ title: "Shop", icon: "star" }} />
<Tabs.Screen name="profile" options={{ title: "Hồ sơ", icon: "user" }} />
```

---

#### [MODIFY] [(tabs)/index.tsx](<file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/(tabs)/index.tsx>)

Xây dựng Home screen với:

- Header: Avatar + "Chào [Tên]!" + Star count
- Today's Lessons: 2 bài học featured
- Weekly Progress: Progress bar
- Achievement Cards: Streak, Completed, Stars

---

#### [NEW] [(tabs)/lessons.tsx](<file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/(tabs)/lessons.tsx>)

Danh sách bài học theo category:

- Sections: Số và Phép tính, Hình học, etc.
- Lesson cards với trạng thái: ✅ Done | 🔓 Unlocked | 🔒 Locked
- Star rating (0-3 sao)

---

#### [NEW] [(tabs)/shop.tsx](<file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/(tabs)/shop.tsx>)

Shop mua items bằng sao:

- Avatars grid
- Themes section
- Badges section

---

#### [NEW] [(tabs)/profile.tsx](<file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/(tabs)/profile.tsx>)

Profile người dùng:

- Avatar + Grade display
- Stats: Stars, Lessons, Streak, Accuracy
- Menu: Leaderboard, Settings, Login prompt

---

### Phase 2: Lesson Screens

#### [NEW] [screens/lesson-detail.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/screens/lesson-detail.tsx)

Chi tiết bài học:

- Large icon + Title
- Activities: Learn (📖), Quiz (❓), Game (🎮)
- Start button

---

#### [NEW] [screens/celebration.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/screens/celebration.tsx)

Màn hình chúc mừng hoàn thành:

- Confetti animation
- Star reward display
- Continue / Home buttons

---

#### [NEW] [screens/leaderboard.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/screens/leaderboard.tsx)

Bảng xếp hạng:

- Top 3 podium
- Scrollable list
- User's rank highlighted

---

### Phase 3: Data & Storage

#### [NEW] [data/lessons.ts](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/data/lessons.ts)

Mock data bài học:

```typescript
export const lessons: Lesson[] = [
  {
    id: "g1-numbers-1-10",
    title: "Số từ 1 đến 10",
    icon: "🔢",
    category: "numbers",
    grade: 1,
    status: "unlocked",
    stars: 0,
    duration: 5,
    questions: 10,
  },
  // ... more lessons
];
```

---

#### [NEW] [context/ProgressContext.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/context/ProgressContext.tsx)

Context quản lý progress:

- `useProgress()` hook
- AsyncStorage integration
- Functions: updateLessonProgress, addStars, updateStreak

---

#### [NEW] [hooks/useLocalProgress.ts](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/hooks/useLocalProgress.ts)

Hook để load/save progress từ AsyncStorage:

```typescript
interface LocalProgress {
  currentGrade: number;
  totalStars: number;
  completedLessons: string[];
  streakDays: number;
  lastActiveDate: string;
  lessonProgress: Record<string, { stars: number; completedAt: string }>;
}
```

---

### Phase 4: Components

#### [NEW] [components/LessonCard.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/components/LessonCard.tsx)

Card component cho lesson với:

- Status icon (✅/🔓/🔒)
- Title
- Star rating

---

#### [NEW] [components/ProgressBar.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/components/ProgressBar.tsx)

Animated progress bar component

---

#### [NEW] [components/StarDisplay.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/components/StarDisplay.tsx)

Star count display với icon

---

#### [NEW] [components/AchievementCard.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/components/AchievementCard.tsx)

Achievement stat card (Streak, Completed, Stars)

---

### Phase 5: Authentication UI

#### [NEW] [screens/auth/login.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/screens/auth/login.tsx)

Login screen:

- Email/Password inputs
- Login button
- Google login option
- Register link

---

#### [NEW] [screens/auth/register.tsx](file:///c:/Users/Administrator/OneDrive/webapp/Math_app/mobile/app/screens/auth/register.tsx)

Register screen:

- Name, Email, Password inputs
- Register button
- Login link

---

## Design System

| Element            | Specification                  |
| ------------------ | ------------------------------ |
| **Primary Color**  | `#14B8A6` (Teal-500)           |
| **Background**     | `#FFFFFF` / `#F9FAFB`          |
| **Text Primary**   | `#111827` (Gray-900)           |
| **Text Secondary** | `#6B7280` (Gray-500)           |
| **Font Family**    | Lexend (Regular, Medium, Bold) |
| **Title Size**     | 28-36px                        |
| **Body Size**      | 16-20px                        |
| **Button Radius**  | 24px (rounded-full)            |
| **Card Radius**    | 16-24px                        |
| **Icon Size**      | 24-48px                        |
| **Touch Target**   | Min 44x44px                    |

---

## File Structure Preview

```
mobile/app/
├── (tabs)/
│   ├── _layout.tsx      [MODIFY]
│   ├── index.tsx        [MODIFY] - Home
│   ├── lessons.tsx      [NEW]
│   ├── shop.tsx         [NEW]
│   └── profile.tsx      [NEW]
├── screens/
│   ├── lesson-detail.tsx   [NEW]
│   ├── celebration.tsx     [NEW]
│   ├── leaderboard.tsx     [NEW]
│   └── auth/
│       ├── login.tsx       [NEW]
│       └── register.tsx    [NEW]
├── index.tsx
├── grade-selection.tsx
└── _layout.tsx

mobile/
├── components/
│   ├── LessonCard.tsx      [NEW]
│   ├── ProgressBar.tsx     [NEW]
│   ├── StarDisplay.tsx     [NEW]
│   └── AchievementCard.tsx [NEW]
├── context/
│   └── ProgressContext.tsx [NEW]
├── hooks/
│   └── useLocalProgress.ts [NEW]
└── data/
    └── lessons.ts          [NEW]
```

---

## Verification Plan

### Automated Tests

```bash
# Run Expo to check for build errors
cd mobile
npx expo start

# Test on Expo Go app on phone
# Scan QR code to preview
```

### Manual Verification

1. **Navigation**: Kiểm tra 4 tabs hoạt động đúng
2. **Lesson Flow**: Chọn bài → Chi tiết → Bắt đầu → Hoàn thành → Celebration
3. **Progress Storage**: Tắt app, mở lại → Progress vẫn còn
4. **Responsiveness**: Test trên nhiều kích thước màn hình
5. **Child-Friendly**: Font đủ lớn, icon rõ ràng, màu sắc tươi sáng

---

## Timeline Estimate

| Phase | Duration     | Description            |
| ----- | ------------ | ---------------------- |
| 1     | 1-2 sessions | Navigation + Home      |
| 2     | 1-2 sessions | Lessons List + Detail  |
| 3     | 1 session    | Local Progress Storage |
| 4     | 1 session    | Celebration + Shop     |
| 5     | 1 session    | Profile + Leaderboard  |
| 6     | 1 session    | Auth UI                |
| 7     | TBD          | Backend Integration    |

**Total Frontend UI**: ~6-8 work sessions

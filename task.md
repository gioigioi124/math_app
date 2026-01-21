# 📱 Math App - Task Tracking

## Overview

Building a mobile math learning app for elementary students with:

- Child-friendly UI (large fonts, icons, minimal text)
- Guest-first: không yêu cầu login
- Local progress before backend integration

---

## 🔧 Code Reorganization (kids_learning_app_core skill)

### Phase 1A: Folder Structure ✅

- [x] Tạo `mobile/src/screens/`
- [x] Tạo `mobile/src/components/`
- [x] Tạo `mobile/src/modules/` (shop, profile, leaderboard)
- [x] Tạo `mobile/src/providers/`
- [x] Tạo `mobile/src/services/`

### Phase 1B: Components ✅

- [x] PrimaryButton (variants: primary, secondary, outline)
- [x] ProgressBar (configurable color/height)
- [x] LessonCard (icon, progress, lock state)
- [x] LessonGroup (group header + cards)

### Phase 1C: Providers ✅

- [x] UserProvider (guest-first, upgrade to user)
- [x] ProgressProvider (local progress tracking)

### Phase 1D: Di chuyển Screens ✅

- [x] `grade-selection.tsx` → `screens/GradeSelectScreen`
- [x] `(tabs)/index.tsx` → `screens/HomeScreen`
- [x] `(tabs)/lessons.tsx` → `screens/LessonListScreen`
- [x] `lesson-detail.tsx` → `screens/LessonDetailScreen`
- [x] `celebration.tsx` → `screens/LessonCompleteScreen`

### Phase 2A: Backend User Model ✅

- [x] Thêm type: guest | user
- [x] Thêm grade, deviceId
- [x] Optional password cho guest

### Phase 2B: Guest API ✅

- [x] POST /api/guest - tạo guest user
- [x] POST /api/guest/upgrade - nâng cấp guest → user
- [x] GET /api/guest/:deviceId - lấy guest user

---

## 📱 UI Implementation

### Phase 1: Navigation & Home ✅

- [x] Tab layout với 4 tabs (Home, Lessons, Badges, Profile)
- [x] Home screen (avatar, today lessons, weekly progress, stats)

### Phase 2: Lesson System ✅

- [x] Mock data structure cho lessons (centralized in `src/data/lessons.data.ts`)
- [x] TypeScript types cho lessons & activities
- [x] Lessons List screen (categories, cards, stars)
- [x] Lesson Detail screen (info, activities, start button, animations)
- [x] Activity Content screen (interactive quiz với animations)

**Improvements Made:**

- ✨ Tách mock data ra file riêng với TypeScript types đầy đủ
- ✨ Đồng bộ dữ liệu giữa LessonList và LessonDetail
- ✨ Thêm animations (fade, slide, scale) cho better UX
- ✨ Hiển thị thông tin chi tiết: description, estimated time, scores
- ✨ Vietnamese translations cho tất cả UI text
- ✨ Activity Content screen với preview và previous scores

### Phase 3: Progress & Storage

- [ ] Local progress với AsyncStorage (partial - cần integrate với new data structure)
- [x] Progress context/hook (đã tạo ProgressProvider)

### Phase 4: Celebration & Rewards

- [ ] Celebration screen (confetti, stars, navigation)
- [x] Star Shop screen (avatars, badges)

### Phase 5: Profile & Social

- [x] Profile screen (stats, settings, login prompt)
- [ ] Leaderboard screen (podium, ranked list)

### Phase 6: Authentication UI

- [ ] Login screen
- [ ] Register screen

### Phase 7: Backend Integration

- [ ] Connect auth to backend
- [ ] Sync progress to server
- [ ] Load leaderboard from API

---

## 📊 Current Status

**Progress**: ~65%
**Last Updated**: 2026-01-21

| Component                 | Status  |
| ------------------------- | ------- |
| Frontend folder structure | ✅ Done |
| Reusable components       | ✅ Done |
| Providers                 | ✅ Done |
| Backend guest support     | ✅ Done |
| Screen migration          | ✅ Done |
| Lesson System (Phase 2)   | ✅ Done |
| TypeScript types          | ✅ Done |
| Centralized mock data     | ✅ Done |

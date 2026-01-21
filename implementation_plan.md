# 📱 Math App Implementation Plan

## Mô tả dự án

Xây dựng ứng dụng học toán cho học sinh tiểu học (Lớp 1-5):

- **Guest-first**: Không bắt buộc đăng nhập
- **Font to, ít chữ, nhiều icon**: Phù hợp trẻ em
- **Màu sắc tươi sáng**: Purple/Teal làm màu chủ đạo

---

## Cấu trúc code mới (kids_learning_app_core skill)

```
mobile/src/
├── screens/           # Màn hình chính
├── components/        # ✅ Components tái sử dụng
│   ├── PrimaryButton.tsx
│   ├── ProgressBar.tsx
│   ├── LessonCard.tsx
│   └── LessonGroup.tsx
├── modules/           # Modules mở rộng
│   ├── shop/
│   ├── profile/
│   └── leaderboard/
├── providers/         # ✅ State management
│   ├── UserProvider.tsx
│   └── ProgressProvider.tsx
└── services/          # API services

backend/src/
├── models/
│   └── user.model.ts  # ✅ Đã thêm guest support
├── controllers/
│   └── guest.controller.ts  # ✅ Guest API
└── routes/
    └── guest.route.ts       # ✅ Guest routes
```

---

## API Endpoints

### Guest API (✅ Hoàn thành)

| Method | Endpoint               | Mô tả                 |
| ------ | ---------------------- | --------------------- |
| POST   | `/api/guest`           | Tạo guest user        |
| POST   | `/api/guest/upgrade`   | Nâng cấp guest → user |
| GET    | `/api/guest/:deviceId` | Lấy guest theo device |

### Existing APIs

| Method   | Endpoint             | Mô tả             |
| -------- | -------------------- | ----------------- |
| POST     | `/api/auth/login`    | Đăng nhập         |
| POST     | `/api/auth/register` | Đăng ký           |
| GET      | `/api/lessons`       | Danh sách bài học |
| GET/POST | `/api/progress`      | Tiến độ học       |

---

## Design System

| Element       | Value                         |
| ------------- | ----------------------------- |
| Primary       | `#8B5CF6` (Purple-500)        |
| Secondary     | `#F97316` (Orange-400)        |
| Success       | `#22C55E` (Green-500)         |
| Background    | `#FFFFFF` / `#F9FAFB`         |
| Font Size     | Title: 28-36px, Body: 16-20px |
| Border Radius | Button: 24px, Card: 16-24px   |
| Touch Target  | Min 44x44px                   |

---

## Verification

```bash
# Frontend
cd mobile && npx expo start

# Backend
cd backend && npm run dev

# Test Guest API
curl -X POST http://localhost:5000/api/guest \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "test-device", "grade": 1}'
```

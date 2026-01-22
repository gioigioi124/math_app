# Phase 7A: Authentication Backend Integration - Testing Guide

## ✅ Đã hoàn thành

### Backend Changes:

1. ✅ Updated `user.model.ts` to support:
   - `phone` field (số điện thoại)
   - `childName` field (tên con)
2. ✅ Updated `auth.service.ts` to:
   - Use phone number instead of email
   - Return full user data including grade, avatar, coins, xp, level
   - Vietnamese error messages

3. ✅ Fixed TypeScript linting errors

### Mobile App Changes:

1. ✅ Created `api.service.ts` with:
   - Register endpoint
   - Login endpoint
   - Logout endpoint
   - Token management with AsyncStorage
2. ✅ Updated `LoginScreen.tsx` to:
   - Connect to backend API
   - Show loading state during login
   - Display error messages
   - Save user data locally after successful login

## 🧪 Cách Test Phase 7A

### Bước 1: Chuẩn bị Backend

1. **Cập nhật API_URL trong mobile app:**

   ```typescript
   // File: mobile/src/services/api.service.ts
   // Line 6: Thay đổi IP address thành IP của máy bạn
   const API_URL = "http://YOUR_IP_ADDRESS:5000/api";
   ```

   Để tìm IP của máy:
   - Windows: Mở CMD và chạy `ipconfig`, tìm IPv4 Address
   - Ví dụ: `http://192.168.1.100:5000/api`

2. **Start Backend Server:**

   ```bash
   cd backend
   npm run dev
   ```

   Backend sẽ chạy ở port 5000

3. **Kiểm tra MongoDB đang chạy:**
   - Nếu dùng local MongoDB: Đảm bảo MongoDB service đang chạy
   - Nếu dùng MongoDB Atlas: Kiểm tra connection string trong `.env`

### Bước 2: Test Registration (Sẽ làm tiếp)

Chưa update SignUpScreen, sẽ làm ở bước tiếp theo.

### Bước 3: Test Login

1. **Tạo user test trong database** (tạm thời dùng tool như MongoDB Compass hoặc tạo qua API):

   Hoặc dùng Postman/Thunder Client để test backend trước:

   ```
   POST http://YOUR_IP:5000/api/auth/register
   Body:
   {
     "childName": "Test User",
     "phone": "0123456789",
     "password": "123456",
     "grade": 1
   }
   ```

2. **Test Login trên Mobile App:**
   - Mở app trên Expo Go
   - Navigate đến `/login`
   - Nhập:
     - Số điện thoại: `0123456789`
     - Mật khẩu: `123456`
   - Nhấn "Đăng Nhập"
3. **Kiểm tra:**
   - ✅ Loading indicator hiện ra
   - ✅ Nếu thành công: Navigate đến home screen
   - ✅ Nếu lỗi: Hiện Alert với thông báo lỗi
   - ✅ Check AsyncStorage có lưu token và user data

### Bước 4: Debug

Nếu gặp lỗi:

1. **"Không thể kết nối đến server":**
   - Kiểm tra backend có đang chạy không
   - Kiểm tra API_URL có đúng IP không
   - Kiểm tra điện thoại và máy tính cùng mạng WiFi

2. **"Số điện thoại hoặc mật khẩu không đúng":**
   - Kiểm tra user đã được tạo trong database chưa
   - Kiểm tra số điện thoại và mật khẩu có đúng không

3. **Lỗi khác:**
   - Check console log trong Expo
   - Check backend terminal để xem lỗi server

## 📝 Next Steps

Sau khi test xong Phase 7A (Login), chúng ta sẽ làm:

- **Phase 7B**: Update SignUpScreen to connect to backend
- **Phase 7C**: Sync progress to server
- **Phase 7D**: Load leaderboard from API

## 🎯 Sẵn sàng test?

Hãy cho tôi biết kết quả test để tôi có thể:

1. Fix bugs nếu có
2. Tiếp tục với Phase 7B (SignUp integration)

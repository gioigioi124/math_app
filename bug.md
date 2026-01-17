## 🐛 Lưu ý

- Nếu gặp lỗi về package versions, chạy:

  ```bash
  npx expo install --fix
  ```

- Để clear cache:
  ```bash
  npx expo start -c
  ```

## � Troubleshooting - Các lỗi đã gặp và cách khắc phục

### 1. Missing `react-native-screens` dependency

**Lỗi:**

```
Unable to resolve "react-native-screens" from "node_modules\@react-navigation\native-stack\lib\module\views\NativeStackView.native.js"
```

**Nguyên nhân:** Package `react-native-screens` là peer dependency bắt buộc của `@react-navigation/native-stack` nhưng chưa được cài đặt.

**Cách khắc phục:**

```bash
npx expo install react-native-screens
```

---

### 2. SafeAreaView Deprecation Warning

**Lỗi:**

```
WARN  SafeAreaView has been deprecated and will be removed in a future release.
Please use 'react-native-safe-area-context' instead.
```

**Nguyên nhân:** `SafeAreaView` từ `react-native` đã bị deprecated.

**Cách khắc phục:**

Thay đổi import từ:

```javascript
import { SafeAreaView } from "react-native";
```

Thành:

```javascript
import { SafeAreaView } from "react-native-safe-area-context";
```

Và wrap app trong `SafeAreaProvider`:

```javascript
import { SafeAreaProvider } from "react-native-safe-area-context";

function App() {
  return <SafeAreaProvider>{/* App content */}</SafeAreaProvider>;
}
```

---

### 3. LinearGradient không hỗ trợ `className` prop

**Lỗi:**

```
LinearGradient không apply được style từ NativeWind className
```

**Nguyên nhân:** `expo-linear-gradient` không hỗ trợ trực tiếp NativeWind `className` prop.

**Cách khắc phục:**

Sử dụng `style` prop thay vì `className`:

```javascript
import { LinearGradient } from "expo-linear-gradient";

<LinearGradient
  colors={["#2C3E50", "#34495E"]}
  style={{
    flex: 1,
    borderRadius: 16,
    padding: 16,
  }}
>
  {/* Content */}
</LinearGradient>;
```

---

### 4. NativeWind TypeError với boolean

**Lỗi:**

```
TypeError: Cannot read properties of undefined (reading 'boolean')
```

**Nguyên nhân:** Cấu hình NativeWind không đúng hoặc thiếu preset.

**Cách khắc phục:**

Đảm bảo `babel.config.js` có cấu hình đúng:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

Và `metro.config.js`:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

---

### 5. Missing peer dependencies

**Lỗi:**

```
Unable to resolve "react-native-safe-area-context" / "react-native-reanimated" / "react-native-svg"
```

**Nguyên nhân:** Các packages này là peer dependencies của React Navigation và Lucide icons.

**Cách khắc phục:**

```bash
npx expo install react-native-safe-area-context react-native-reanimated react-native-svg
```

---

### 6. Package version conflicts

**Lỗi:**

```
Some dependencies are incompatible with the installed expo version
```

**Cách khắc phục:**

```bash
npx expo install --fix
```

---

### 7. iOS Bottom Navigation Bar - Khoảng trắng thừa và che mất nội dung

**Vấn đề:**

Trên iPhone (đặc biệt là các model có home indicator), bottom navigation bar gặp 2 vấn đề:

1. Home indicator (thanh ngang điều hướng) che mất một phần của 4 nút điều hướng
2. Có khoảng trắng lớn phía trên navigation bar, che mất nội dung (như nút "Explore" màu xanh)

**Nguyên nhân:**

- iOS tự động thêm safe area insets cho bottom navigation bar
- `SafeAreaView` mặc định áp dụng padding cho tất cả các cạnh, tạo khoảng trắng thừa ở phía dưới

**Cách khắc phục:**

**Bước 1:** Điều chỉnh chiều cao và padding của tab bar trong `App.js`:

```javascript
import { Platform } from "react-native";

// Trong TabNavigator screenOptions:
tabBarStyle: {
  paddingBottom: Platform.OS === "ios" ? 28 : 4,
  paddingTop: 4,
  height: Platform.OS === "ios" ? 78 : 54,
  borderTopWidth: 1,
  borderTopColor: "#E5E7EB",
},
tabBarSafeAreaInsets: {
  top: 0, // Loại bỏ khoảng trắng phía trên
},
```

**Bước 2:** Cấu hình `SafeAreaView` để không áp dụng safe area ở phía dưới trong các screen (ví dụ `HomePage.js`):

```javascript
<SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
  {/* Content */}
</SafeAreaView>
```

**Bước 3:** Thêm bottom spacing trong ScrollView để nội dung không bị che:

```javascript
<ScrollView>
  {/* Content */}

  {/* Bottom Spacing */}
  <View className="h-24" />
</ScrollView>
```

**Kết quả:**

- ✅ Navigation buttons không bị che bởi home indicator
- ✅ Không còn khoảng trắng thừa phía trên tab bar
- ✅ Nội dung có thể scroll đầy đủ mà không bị che

---

## �📸 Screenshots

App hiện đang chạy với:

- ✅ Bottom navigation hoạt động
- ✅ Category cards với gradient backgrounds
- ✅ Search bar
- ✅ Navigation giữa các màn hình

---

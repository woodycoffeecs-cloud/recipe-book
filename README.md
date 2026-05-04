# 📖 Recipe Book — Hướng dẫn setup

## Tổng quan
- **Frontend**: React + Vite → deploy GitHub Pages (miễn phí)
- **Database**: Supabase → lưu data + realtime sync giữa các thiết bị (miễn phí)
- **Auth**: Mật khẩu đơn giản trong code

---

## BƯỚC 1 — Tạo tài khoản Supabase

1. Vào **https://supabase.com** → Sign up (dùng GitHub hoặc email)
2. Click **"New Project"**
   - Organization: cá nhân
   - Project name: `recipe-book`
   - Password: đặt mật khẩu DB (lưu lại)
   - Region: chọn **Southeast Asia (Singapore)**
3. Đợi ~2 phút để project khởi động

---

## BƯỚC 2 — Tạo bảng trong Supabase

Vào **SQL Editor** trong Supabase Dashboard, dán và chạy đoạn SQL sau:

```sql
-- Tạo bảng recipes
create table recipes (
  id bigserial primary key,
  recipe_id text unique not null,
  sort_order integer default 0,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- Bật Realtime
alter publication supabase_realtime add table recipes;

-- Cho phép đọc/ghi public (không cần login)
alter table recipes enable row level security;

create policy "Allow read" on recipes for select using (true);
create policy "Allow insert" on recipes for insert with check (true);
create policy "Allow update" on recipes for update using (true);
```

---

## BƯỚC 3 — Lấy API keys

Vào **Project Settings → API** trong Supabase:
- Copy **Project URL** (dạng `https://xxxxx.supabase.co`)
https://pxfmbdkeloqfelyszale.supabase.co/rest/v1/
- Copy **anon public key** (dãy ký tự dài)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Zm1iZGtlbG9xZmVseXN6YWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjMwMDgsImV4cCI6MjA5MzQzOTAwOH0.tc68NtSU4HIo1PnVowLlEMsfvgp5r1bG0NMoQ_uf7v4
Mở file `src/supabase.js` và điền vào:

```js
const SUPABASE_URL = 'https://xxxxx.supabase.co'   // ← dán URL vào đây
const SUPABASE_ANON_KEY = 'eyJhb...'               // ← dán key vào đây
```

---

## BƯỚC 4 — Đặt mật khẩu edit

Mở file `src/data.js`, tìm dòng cuối:

```js
export const EDIT_PASSWORD = "recipe2024"  // ← đổi thành mật khẩu của bạn
```

---

## BƯỚC 5 — Chạy local để test

```bash
# Cài dependencies
npm install

# Chạy local
npm run dev
```

Mở http://localhost:5173 — app sẽ chạy và tự seed data vào Supabase lần đầu.

---

## BƯỚC 6 — Deploy lên GitHub Pages

### 6a. Tạo GitHub repo
1. Vào **https://github.com/new**
2. Tên repo: `recipe-book` (hoặc tên khác)
3. Public, không cần README

### 6b. Cập nhật vite.config.js
Mở `vite.config.js`, sửa base thành tên repo của bạn:
```js
base: '/recipe-book/',  // ← đổi nếu tên repo khác
```

### 6c. Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial recipe book"
git branch -M main
git remote add origin https://github.com/USERNAME/recipe-book.git
git push -u origin main
```

### 6d. Deploy
```bash
npm run deploy
```

Sau ~1 phút, truy cập: **https://USERNAME.github.io/recipe-book/**

---

## Sử dụng

| Tính năng | Cách làm |
|-----------|----------|
| Xem công thức | Click tên món bên sidebar |
| Chỉnh sửa | Click "Chỉnh sửa" → nhập mật khẩu |
| Sửa text | Click trực tiếp vào nội dung |
| Thêm nguyên liệu | Button "+ Thêm nguyên liệu" |
| Thêm bước | Button "+ Thêm bước" |
| Thêm món mới | Button "+ Thêm món mới" (sidebar) |
| Lưu | Tự động sau 0.8s, đồng bộ realtime |
| Khoá lại | Click "Khoá lại" |

---

## Lưu ý

- Mọi thay đổi sync **realtime** qua tất cả thiết bị đang mở link
- Không cần refresh trang
- Data lưu trên Supabase, không mất khi đóng tab
- Free tier Supabase: 500MB, 2GB bandwidth/tháng — đủ dùng lâu dài

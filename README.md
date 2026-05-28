# CineHub

> Trang xem phim online miễn phí — Vietsub, thuyết minh, full HD

**🌐 [moviephim.vercel.app](https://moviephim.vercel.app)**

---

## Giới thiệu

**CineHub** là web xem phim online được xây dựng bằng React + Vite. Kho phim đa dạng từ nhiều quốc gia, phân loại theo thể loại, hỗ trợ xem trực tiếp ngay trên trình duyệt mà không cần đăng ký tài khoản.

## Tính năng

**Xem phim**
- Trang chủ với banner phim sắp chiếu (xem trailer)
- Chi tiết phim — mô tả, diễn viên, danh sách tập
- Xem phim trực tiếp — không cần đăng nhập
- Tìm kiếm realtime + tìm kiếm bằng giọng nói
- Duyệt theo thể loại & quốc gia, bộ lọc nâng cao
- Mini player khi cuộn xuống
- Phím tắt: `n`/`p` chuyển tập, `F` toàn màn hình, `Esc` quay lại

**Tài khoản**
- Đăng ký / Đăng nhập
- Hồ sơ cá nhân — chỉnh sửa thông tin, upload ảnh đại diện
- Danh sách yêu thích
- Lịch sử xem & tiếp tục xem từ tập đang dở

**Cộng đồng**
- Bình luận và đánh giá (1–10 sao) cho từng phim
- Chỉnh sửa / xóa bình luận của chính mình
- Bình luận khách (không cần đăng nhập)

**Khác**
- Responsive — máy tính, tablet, điện thoại

## Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white&style=flat-square)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?logo=redux&logoColor=white&style=flat-square)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-Edge_Cache-F38020?logo=cloudflare&logoColor=white&style=flat-square)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?logo=cloudinary&logoColor=white&style=flat-square)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white&style=flat-square)

## Kiến trúc

```
User → Cloudflare Workers (edge cache) → OPhim API
                                       → TMDB API (diễn viên, rating)
     → Backend API (Render)            → MongoDB (auth, comments)
     → Cloudinary                      → Avatar upload (unsigned preset)
```

- OPhim data được cache tại Cloudflare edge, giảm latency so với gọi thẳng origin
- Backend tự build trên Render xử lý auth (JWT) và comment system
- Ảnh đại diện upload thẳng từ client lên Cloudinary, không qua server

---

<p align="center">Made with ❤️ by <a href="https://github.com/trandinhphong0310">trandinhphong0310</a></p>

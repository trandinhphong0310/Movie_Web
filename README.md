# CineHub

> Trang xem phim online miễn phí — Vietsub, thuyết minh, full HD

**🌐 [moviephim.vercel.app](https://moviephim.vercel.app)**

---

## Giới thiệu

**CineHub** là web xem phim online được xây dựng bằng React + Vite. Kho phim đa dạng từ nhiều quốc gia, phân loại theo thể loại, hỗ trợ xem trực tiếp ngay trên trình duyệt mà không cần đăng ký tài khoản.

## Tính năng

- Trang chủ với banner phim sắp chiếu (xem trailer)
- Chi tiết phim — mô tả, diễn viên, danh sách tập
- Xem phim trực tiếp — không cần đăng nhập
- Tìm kiếm realtime
- Duyệt theo thể loại & quốc gia
- Lịch sử xem phim
- Tiếp tục xem từ tập đang dở
- Mini player khi cuộn xuống
- Phím tắt: `n`/`p` chuyển tập, `F` toàn màn hình, `Esc` quay lại
- Responsive — máy tính, tablet, điện thoại

## Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white&style=flat-square)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?logo=redux&logoColor=white&style=flat-square)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-Edge_Cache-F38020?logo=cloudflare&logoColor=white&style=flat-square)

## Kiến trúc

```
User → Cloudflare Workers (edge cache) → OPhim API
                                       → TMDB API (diễn viên, rating)
```

API data từ OPhim được cache tại Cloudflare edge gần user nhất, giảm latency so với gọi thẳng origin server.

---

<p align="center">Made with ❤️ by <a href="https://github.com/trandinhphong0310">trandinhphong0310</a></p>

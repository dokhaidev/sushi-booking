/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "example.com",
      "i.pinimg.com",
      "file.hstatic.net",
      "sushiworld.com.vn",
      "cdn.tgdd.vn",
      "www.shogun.nl",
      "www.justonecookbook.com",
      "www.sushitei.com",
      "www.thespruceeats.com",
      "www.example.com",
      "example.org",
      "example.net",
      "example.edu",
      "example.co.uk",
      "example.io",
      "example.us",
      "example.ca",
      "ussinavietnam.vn",
      "satovietnhat.com.vn",
      "www.sushiworld.com.vn",
      "www.sushihouse.com.vn",
      "www.sushikatsu.com.vn",
      "www.sushikoi.com.vn",
      "www.sushimura.com.vn",
      "saigonreview.vn",
      "plus.unsplash.com",
      "wallpapers.com",
      "media.istockphoto.com",
      "t3.ftcdn.net",
      "phongcachmoc.vn",
      "cdn.pastaxi-manager.onepas.vn",
      "xuongmocso1.com",
      "fnb.qdc.vn",
      "pastaxi-manager.onepas.vn",
      "image.phunuonline.com.vn",
      "media.suckhoecong.vn",
      "xkld.thanhgiang.com.vn",
      "i0.wp.com",
      "kokugyu.com.vn",
      "product.hstatic.net",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", // Laravel backend
      },
    ];
  },
};

module.exports = nextConfig;

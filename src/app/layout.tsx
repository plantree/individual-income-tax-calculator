import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "个人所得税计算器 - 快速计算您的个人所得税",
  description: "输入累计工资收入、累计缴纳个税和当月收入，快速计算当月应缴纳税款和税率区间。支持多种扣除项，准确计算个税，助您合理规划财务。",
  keywords: "个人所得税,个税计算器,税务计算,工资税收,个税申报,财务规划",
  authors: [{ name: "个人所得税计算器" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "个人所得税计算器 - 快速计算您的个人所得税",
    description: "输入累计工资收入、累计缴纳个税和当月收入，快速计算当月应缴纳税款和税率区间。支持多种扣除项，准确计算个税，助您合理规划财务。",
    type: "website",
    locale: "zh_CN",
    siteName: "个人所得税计算器",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "个人所得税计算器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "个人所得税计算器 - 快速计算您的个人所得税",
    description: "输入累计工资收入、累计缴纳个税和当月收入，快速计算当月应缴纳税款和税率区间",
    images: ["/og-image.jpg"],
  },
  other: {
    // 微信分享相关的meta标签
    "wechat:card": "summary_large_image",
    "wechat:site": "@个人所得税计算器",
    "wechat:title": "个人所得税计算器 - 快速计算您的个人所得税",
    "wechat:description": "输入累计工资收入、累计缴纳个税和当月收入，快速计算当月应缴纳税款和税率区间",
    "wechat:image": "/og-image.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 微信分享优化 */}
        <meta property="og:title" content="个人所得税计算器 - 快速计算您的个人所得税" />
        <meta property="og:description" content="输入累计工资收入、累计缴纳个税和当月收入，快速计算当月应缴纳税款和税率区间。支持多种扣除项，准确计算个税，助您合理规划财务。" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="zh_CN" />
        
        {/* 微信专用meta标签 */}
        <meta name="wechat-enable-auto-play" content="true" />
        <meta name="wechat-card-type" content="summary_large_image" />
        
        {/* 移动端优化 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="个税计算器" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

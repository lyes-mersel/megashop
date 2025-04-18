import localFont from "next/font/local";

const integralCF = localFont({
  src: [
    {
      path: "./IntegralCF/integralcf-bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  fallback: ["sans-serif"],
  variable: "--font-integralCF",
});

const satoshi = localFont({
  src: [
    {
      path: "./Satoshi/Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Satoshi/Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Satoshi/Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  fallback: ["sans-serif"],
  variable: "--font-satoshi",
});

const montserrat = localFont({
  src: [
    {
      path: "./Montserrat/Montserrat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Montserrat/Montserrat-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Montserrat/Montserrat-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Montserrat/Montserrat-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Montserrat/Montserrat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Montserrat/Montserrat-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  fallback: ["sans-serif"],
  variable: "--font-montserrat",
});

export { integralCF, satoshi, montserrat };

import { defineConfig } from "vitepress";

const painItems = [
  { text: "1. Code can't be split across files", link: "/pains/pain-01" },
  {
    text: "2. No way to reuse other people's code reproducibly",
    link: "/pains/pain-02",
  },
  { text: "3. Server-side JS needs real modules", link: "/pains/pain-03" },
  {
    text: "4. Browser can't do synchronous `require`",
    link: "/pains/pain-04",
  },
  {
    text: "5. Browsers don't implement new JS fast enough",
    link: "/pains/pain-05",
  },
  { text: "6. JS's dynamic typing hurts at scale", link: "/pains/pain-06" },
  {
    text: "7. Sending 400 files to the browser is slow",
    link: "/pains/pain-07",
  },
  { text: "8. Bundle sizes are huge", link: "/pains/pain-08" },
  {
    text: "9. Every save triggers a full rebuild",
    link: "/pains/pain-09",
  },
  { text: "10. Cold-start dev servers are slow", link: "/pains/pain-10" },
  { text: "11. JS-in-JS tooling is slow", link: "/pains/pain-11" },
  {
    text: "12. Errors in transpiled/bundled code are unreadable",
    link: "/pains/pain-12",
  },
  {
    text: "13. Imperative DOM updates don't scale",
    link: "/pains/pain-13",
  },
  {
    text: "14. Node-isms don't run on the edge or in the browser",
    link: "/pains/pain-14",
  },
  { text: "15. node_modules is a disaster", link: "/pains/pain-15" },
  {
    text: "16. CJS and ESM don't interop cleanly",
    link: "/pains/pain-16",
  },
  { text: "17. Configuration explosion", link: "/pains/pain-17" },
];

export default defineConfig({
  // GitHub Pages project URL: https://cadentj.github.io/history-of-js/
  base: "/history-of-js/",
  title: "JS Ecosystem Plan",
  description:
    "Progressive toy chat app curriculum — pain points through the JS stack",
  themeConfig: {
    nav: [
      { text: "Overview", link: "/" },
      { text: "Background", link: "/background" },
      { text: "Pain points", link: "/pains/pain-01" },
      { text: "Sessions", link: "/sessions" },
    ],
    sidebar: [
      { text: "Overview", link: "/" },
      { text: "Background (JS / async)", link: "/background" },
      {
        text: "Pain points",
        items: painItems,
      },
      { text: "How these map to sessions", link: "/sessions" },
    ],
    socialLinks: [],
    search: {
      provider: "local",
    },
  },
});

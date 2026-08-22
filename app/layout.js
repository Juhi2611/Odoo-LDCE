import './globals.css';

export const metadata = {
  title: 'GlobeTrotter – Personalized Travel Planning',
  description: 'Dream, design, and organize your perfect multi-city trips with GlobeTrotter. Create itineraries, explore destinations, manage budgets, and share your travel plans.',
  keywords: 'travel planning, itinerary builder, trip planner, travel budget, multi-city travel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

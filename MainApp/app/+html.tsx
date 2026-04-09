import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every
 * web page during static rendering.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 
          Add the Google Fonts link directly to the HTML head.
          This ensures the 'Prompt' font is loaded as early as possible on the web.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />

        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'Prompt_300Light';
            font-style: normal;
            font-weight: normal;
            src: url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-thai-300-normal.woff2') format('woff2'),
                 url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-latin-300-normal.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Prompt_400Regular';
            font-style: normal;
            font-weight: normal;
            src: url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-thai-400-normal.woff2') format('woff2'),
                 url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-latin-400-normal.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Prompt_500Medium';
            font-style: normal;
            font-weight: normal;
            src: url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-thai-500-normal.woff2') format('woff2'),
                 url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-latin-500-normal.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Prompt_600SemiBold';
            font-style: normal;
            font-weight: normal;
            src: url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-thai-600-normal.woff2') format('woff2'),
                 url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-latin-600-normal.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Prompt_700Bold';
            font-style: normal;
            font-weight: normal;
            src: url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-thai-700-normal.woff2') format('woff2'),
                 url('https://cdn.jsdelivr.net/npm/@fontsource/prompt@5.0.8/files/prompt-latin-700-normal.woff2') format('woff2');
          }

          html, body { 
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: 'Prompt_400Regular', sans-serif !important;
          }
          #root {
            height: 100%;
          }
        `}} />

        <ScrollViewStyleReset />

        {/* Add any additional <head> elements here */}
      </head>
      <body>{children}</body>
    </html>
  );
}

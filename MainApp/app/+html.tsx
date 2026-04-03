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
          /* Robust Font Aliasing: Ensures 'Prompt_XXX' maps correctly to the standard Google Font names on Web */
          
          @font-face { font-family: 'Prompt_300Light'; src: local('Prompt'), local('Prompt Light'); font-weight: 300; }
          @font-face { font-family: 'Prompt_400Regular'; src: local('Prompt'), local('Prompt Regular'); font-weight: 400; }
          @font-face { font-family: 'Prompt_500Medium'; src: local('Prompt'), local('Prompt Medium'); font-weight: 500; }
          @font-face { font-family: 'Prompt_600SemiBold'; src: local('Prompt'), local('Prompt SemiBold'); font-weight: 600; }
          @font-face { font-family: 'Prompt_700Bold'; src: local('Prompt'), local('Prompt Bold'); font-weight: 700; }

          /* Global Fallback: Prevent Serif leakage and ensure Prompt is the primary choice */
          html, body { 
            font-family: 'Prompt', -apple-system, system-ui, sans-serif !important; 
            margin: 0;
            padding: 0;
          }
        `}} />

        <ScrollViewStyleReset />

        {/* Add any additional <head> elements here */}
      </head>
      <body>{children}</body>
    </html>
  );
}

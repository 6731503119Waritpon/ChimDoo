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
          /* Universal Font Aliasing: Ensures 'Prompt' works across Native & Web naming conventions */
          
          /* 300 Light */
          @font-face { font-family: 'Prompt-Light'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A801-66tNo.woff2') format('woff2'); font-weight: 300; }
          @font-face { font-family: 'Prompt_300Light'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A801-66tNo.woff2') format('woff2'); font-weight: 300; }
          
          /* 400 Regular */
          @font-face { font-family: 'Prompt-Regular'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z0dm_Iuzvj9A846-I.woff2') format('woff2'); font-weight: 400; }
          @font-face { font-family: 'Prompt_400Regular'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z0dm_Iuzvj9A846-I.woff2') format('woff2'); font-weight: 400; }
          
          /* 500 Medium */
          @font-face { font-family: 'Prompt-Medium'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A80n--6tNo.woff2') format('woff2'); font-weight: 500; }
          @font-face { font-family: 'Prompt_500Medium'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A80n--6tNo.woff2') format('woff2'); font-weight: 500; }
          
          /* 600 SemiBold */
          @font-face { font-family: 'Prompt-SemiBold'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A80V-e6tNo.woff2') format('woff2'); font-weight: 600; }
          @font-face { font-family: 'Prompt_600SemiBold'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A80V-e6tNo.woff2') format('woff2'); font-weight: 600; }
          
          /* 700 Bold */
          @font-face { font-family: 'Prompt-Bold'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A80F-W6tNo.woff2') format('woff2'); font-weight: 700; }
          @font-face { font-family: 'Prompt_700Bold'; src: url('https://fonts.gstatic.com/s/prompt/v10/P_z9dm_Iuzvj9A80F-W6tNo.woff2') format('woff2'); font-weight: 700; }

          /* Global Fallback: Ensure everything prefers Prompt */
          html, body { 
            font-family: 'Prompt-Regular', 'Prompt_400Regular', 'Prompt', system-ui, sans-serif !important; 
          }
        `}} />

        <ScrollViewStyleReset />

        {/* Add any additional <head> elements here */}
      </head>
      <body>{children}</body>
    </html>
  );
}

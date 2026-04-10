import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'Prompt_300Light';
            font-style: normal;
            font-display: swap;
            src: url('/fonts/Prompt_300Light.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Prompt_400Regular';
            font-style: normal;
            font-display: swap;
            src: url('/fonts/Prompt_400Regular.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Prompt_500Medium';
            font-style: normal;
            font-display: swap;
            src: url('/fonts/Prompt_500Medium.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Prompt_600SemiBold';
            font-style: normal;
            font-display: swap;
            src: url('/fonts/Prompt_600SemiBold.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Prompt_700Bold';
            font-style: normal;
            font-display: swap;
            src: url('/fonts/Prompt_700Bold.ttf') format('truetype');
          }

          html, body, #root {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
          }

          /* Nuclear Splash Screen - pure HTML, no React needed */
          #splash-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647;
            transition: opacity 0.4s ease-out;
          }
          #splash-overlay img {
            width: 45%;
            max-width: 280px;
            object-fit: contain;
          }
        `}} />

        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            setTimeout(function() {
              var s = document.getElementById('splash-overlay');
              if (s) {
                s.style.opacity = '0';
                setTimeout(function() { s.remove(); }, 400);
              }
            }, 2000);
          });
        `}} />

        <ScrollViewStyleReset />
      </head>
      <body>
        <div id="splash-overlay">
          <img src="/fonts/ChimDooLogo2.png" alt="ChimDoo" />
        </div>
        {children}
      </body>
    </html>
  );
}

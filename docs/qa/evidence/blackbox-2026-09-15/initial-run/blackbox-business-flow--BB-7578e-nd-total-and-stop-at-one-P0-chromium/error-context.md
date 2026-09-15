# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\business-flow.spec.ts >> [BB-003] Cart should preserve quantity and total and stop at one @P0
- Location: qa\automation\blackbox\business-flow.spec.ts:34:5

# Error details

```
Error: browserContext.newPage: Executable doesn't exist at C:\Users\HYPE R Series\AppData\Local\ms-playwright\ffmpeg-1011\ffmpeg-win64.exe
╔═════════════════════════════════════════════════════════════════╗
║ Video rendering requires ffmpeg binary.                         ║
║ Downloading it will not affect any of the system-wide settings. ║
║ Please run the following command:                               ║
║                                                                 ║
║     npx playwright install ffmpeg                               ║
║                                                                 ║
║ <3 Playwright Team                                              ║
╚═════════════════════════════════════════════════════════════════╝
```
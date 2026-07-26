# AppealMate social creative source

This isolated Remotion project renders the July 2026 Meta campaign assets without changing the AppealMate application or deployment.

## Commands

```powershell
npm run check
npx remotion studio src/index.ts
npx remotion still src/index.ts ParkingSquare exports/appealmate-parking-square-1080.png
npx remotion render src/index.ts ParkingReel exports/appealmate-parking-reel-12s.mp4 --codec=h264 --crf=25
```

See `CAMPAIGN.md` for copy, placement and test guidance.

# TipShot Design Reference

## Colors

### Background
- **Main Background**: `#191919` (dark gray, almost black)

### Purple Theme
- **Main Purple** (buttons default): `#311249`
- **Light Purple** (hover/accent): `#8e34d5`
- **Purple Text**: `#8e34d5`
- **Popup/Badge**: `#8e34d5`

### Text Colors
- **Title Text**: `#8e34d5` (light purple)
- **Subtitle Text**: `#8e34d5` (light purple)
- **Button Text**: `#ffffff` (white)
- **Popup Text**: `#ffffff` (white)

### Button States
- **Default**: `#311249`
- **Hover**: `#8e34d5`
- **Disabled**: `#22122e` (darker purple, opacity 0.7)
- **Outline/Border**: `#822ac6`

## Typography

### Fonts
- **Title/Logo**: `ConcertOne` (or ConcertOne-Regular)
- **All Other Text**: `ConcertOne`

### Font Sizes
- **"TIPSHOT" Title**: 160px (scaled to 80px with 0.5 scale)
- **"SELECT A GAME TO START"**: 70px (scaled to 35px with 0.5 scale)
- **Button Text**: 35px
- **Popup Badge**: 20px

### Text Styles
- **Letter Spacing**: 10px (for main titles)
- **Text Shadow**: 3px 4px, color `#00000099` (black with opacity)

## Layout (Game is 760x1280 base resolution)

### Title Section
- **Position**: Upper quarter of screen
  - Center X: 380px (half of 760px width)
  - Center Y: 320px (1/4 of 1280px height)
- **Logo Image**: 
  - X: 200px (centerX - 180)
  - Y: 320px
  - Scale: 0.5
- **"TIPSHOT" Text**:
  - X: 430px (centerX + 50)
  - Y: 320px
  - Aligned left

### Play Section
- **"SELECT A GAME TO START" Text**:
  - X: 380px (center)
  - Y: 400px (centerY + 80)
  - Aligned center

### Button Dimensions
- **Width**: 400px
- **Height**: 80px
- **X Position**: 380px (center)
- **Y Positions**:
  - Degen Button: 600px
  - Aptos Button: 700px
  - Moxie Button: 800px
  - How to Play: 1050px
  - Leaderboard: 1150px

### Popup Badge
- **"COMING SOON" Badge**:
  - Width: 130px
  - Height: 40px
  - Color: `#8e34d5`
  - Position: Offset to right of Moxie button (600px, 770px)

## Button Icon Scale
- **Degen Icon** (enemy1): Scale 0.7
- **Aptos/Moxie Icons**: Scale 0.2
- **Icon Position**: -w/2 + 40px from button center (left side)

## Animations
- **Title/Logo Animation**: Gentle float up and down (±10px, 2 second duration, infinite loop)


# D&D Flavor Text Generator

A client-side web application for D&D players to generate AI-powered flavor text for their characters, including combat quips (like Vicious Mockery) and character catchphrases. All data is stored locally with a BYOK (Bring Your Own Key) model for AI generation.

## Features

### 🎭 Character Profile Management
- Create, edit, and delete detailed character profiles
- Store character information including name, class, race, level
- Add backstory, appearance descriptions, and world/campaign settings
- Upload character sheet PDFs for reference
- Quick character switching with dropdown selector

### ✨ AI Generation System
- **Vicious Mockery**: Generate insulting combat quips for spell usage
- **Catchphrases**: Create signature character phrases
- Contextual generation based on character profile
- Support for multiple AI providers (OpenAI, Anthropic, Google, Groq, Cohere)
- Adjustable temperature settings for creativity control
- Generate 5 results per request with regeneration option

### ❤️ Favorites System
- Save your favorite generated lines with one click
- Organized favorites list per character
- Search and filter favorites
- Copy to clipboard functionality
- Track creation dates and context

### 🔐 Privacy & Security
- **100% client-side**: No backend or database
- API keys never leave your browser
- All data stored in localStorage
- No telemetry or tracking
- Clear privacy messaging throughout the UI

### 💾 Data Management
- Export all profiles and favorites as JSON
- Import previously exported data
- Clear all data with confirmation
- Automatic saving on every change

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **AI**: Vercel AI SDK v3 (multi-provider support)
- **UI**: shadcn/ui components + Tailwind CSS
- **State Management**: Zustand with persistence
- **Storage**: localStorage with JSON export/import

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API key from at least one supported provider:
  - OpenAI
  - Anthropic (Claude)
  - Google (Gemini)
  - Groq
  - Cohere

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dnd-flavor-text-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### First-Time Setup

1. **Configure API Key**: Click the settings icon and add your AI provider API key
2. **Create Character**: Click "Create Character" and fill in your character details
3. **Generate Text**: Select your character and start generating flavor text!

## Usage Guide

### Creating a Character Profile

1. Click the "+" button next to the character selector
2. Fill in the required fields:
   - Character name
   - Race (e.g., "Dwarf", "Elf")
   - Class (e.g., "Fighter", "Wizard")
   - Level (1-20)
3. Add optional details for better generation:
   - Backstory
   - Appearance description
   - World/campaign setting
   - Character sheet PDF

### Generating Flavor Text

1. Select a character from the dropdown
2. Choose generation type:
   - **Vicious Mockery**: Combat insults and quips
   - **Catchphrases**: Signature character phrases
3. (Optional) Add spell name or additional context
4. Click "Generate" or press Ctrl+Enter
5. Review the 5 generated results
6. Click the heart icon to save favorites

### Managing Favorites

- Access favorites through the "Favorites" tab
- Search favorites using the search bar
- Copy text to clipboard with one click
- Remove unwanted favorites with the trash icon

### Keyboard Shortcuts

- `Ctrl+Enter`: Generate text
- `Ctrl+S`: Save to favorites (when hovering over text)

## API Providers

### Supported Models

**OpenAI**
- GPT-4 Turbo
- GPT-4
- GPT-3.5 Turbo

**Anthropic**
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku

**Google**
- Gemini Pro
- Gemini 1.5 Pro

**Groq**
- Mixtral 8x7B
- Llama 2 70B

**Cohere**
- Command
- Command Light

### Getting API Keys

- **OpenAI**: [platform.openai.com](https://platform.openai.com)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
- **Google**: [makersuite.google.com](https://makersuite.google.com)
- **Groq**: [console.groq.com](https://console.groq.com)
- **Cohere**: [dashboard.cohere.ai](https://dashboard.cohere.ai)

## Data Export/Import

### Exporting Data
1. Open Settings
2. Click "Export All Data"
3. Save the JSON file to your computer

### Importing Data
1. Open Settings
2. Click "Import Data"
3. Select your previously exported JSON file
4. All profiles and settings will be restored (except API keys)

## Development

### Project Structure

```
/app
  /page.tsx                    # Main application page
  /layout.tsx                  # Root layout with theme provider
  /globals.css                 # Global styles

/components
  /character-profile-form.tsx  # Character creation/editing form
  /generation-panel.tsx        # AI text generation interface
  /favorites-list.tsx          # Favorites management
  /settings-dialog.tsx         # Settings and API configuration
  /profile-selector.tsx        # Character dropdown selector
  /theme-provider.tsx          # Dark/light mode provider
  /theme-toggle.tsx           # Theme toggle button
  /ui/                        # shadcn/ui components

/stores
  /character-store.ts         # Character profiles state
  /settings-store.ts          # Settings and API keys state

/lib
  /ai-generator.ts            # AI SDK integration
  /types.ts                   # TypeScript interfaces
  /utils.ts                   # Utility functions
```

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly formatted
- Check that you have credits/balance with your provider
- Try the "Test Connection" button in settings

### Generation Errors
- Verify your character profile has required fields
- Check your internet connection
- Try reducing the temperature setting
- Switch to a different AI model

### Storage Issues
- Clear browser cache if data seems corrupted
- Export your data regularly as backup
- Check browser localStorage limits (usually 5-10MB)

## Privacy & Security

This application prioritizes user privacy:

- **No Backend**: All processing happens in your browser
- **Local Storage**: Data never leaves your device
- **No Analytics**: Zero tracking or telemetry
- **Open Source**: Full transparency of code
- **Encrypted Keys**: API keys stored securely in localStorage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI integration via [Vercel AI SDK](https://sdk.vercel.ai/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ for the D&D community
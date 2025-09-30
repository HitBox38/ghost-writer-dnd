# D&D Flavor Text Generator

A client-side web application for D&D players to generate AI-powered flavor text for their characters, specifically combat quips (like Vicious Mockery) and character catchphrases. All data is stored locally with a BYOK (Bring Your Own Key) model for AI providers.

## Features

### ✨ Character Profile Management
- Create, edit, and delete character profiles
- Store character details: name, class, race, level, backstory, appearance, world setting
- Upload character sheets (PDF, max 5MB, stored as base64)
- Quick profile switching with dropdown selector

### 🤖 AI Generation System
- **Two generation modes:**
  - **Combat Quips**: Generate insulting combat quips for spell usage (like Vicious Mockery)
  - **Catchphrases**: Generate signature character phrases
- Optional context input for each generation
- Generates 3-5 results per request
- Regenerate button for new variations

### ❤️ Favorites System
- Save generated text as favorites per character
- Filter favorites by type (combat quips or catchphrases)
- Copy to clipboard functionality
- Remove from favorites option

### ⚙️ Settings & API Key Management
- Support for multiple AI providers:
  - OpenAI (GPT-4o, GPT-4o Mini, GPT-4 Turbo)
  - Anthropic (Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus)
  - Google AI (Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.5 Flash Lite)
- Secure local API key storage (never leaves browser)
- Model selection per provider
- Temperature slider (0-1) for creativity control
- Test connection functionality

### 🎨 Appearance
- Light, dark, and system theme support
- Responsive design (mobile-friendly)
- Modern UI with shadcn/ui components

### 📦 Data Management
- Export all data as JSON (characters + favorites + settings, API key excluded)
- Import JSON to restore data
- Clear all data option with confirmation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **AI**: Vercel AI SDK v5 (OpenAI, Anthropic, Google providers)
- **UI**: shadcn/ui components + Tailwind CSS v4
- **State Management**: Zustand
- **Storage**: localStorage with JSON export/import
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+ or compatible runtime
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ghost-writer-dnd
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### First-Time Setup

1. **Configure API Key**:
   - Click the Settings icon in the top-right corner
   - Select your preferred AI provider (OpenAI, Anthropic, or Google)
   - Enter your API key
   - Optionally test the connection
   - Your API key is stored locally and never leaves your browser

2. **Create a Character**:
   - Click "Create First Character" or use the profile selector
   - Fill in character details (name, race, class, level)
   - Add backstory, appearance, and world setting for better AI context
   - Optionally upload a character sheet PDF
   - Save the character

### Generating Flavor Text

1. **Navigate to Generate**: Click "Generate" in the navigation bar or visit `/generate`
2. **Select Character**: Choose your character from the profile dropdown
3. **Configure Generation** (left panel):
   - Choose generation type (Combat Quips or Catchphrases)
   - Select AI provider and model
   - Adjust temperature (0-1) for creativity
   - Set number of results (1-25)
   - Add optional context
4. **Generate**: Click the Generate button or press Ctrl+Enter
5. **Review Results** (right panel): See all generated results in a scrollable list
6. **Save Favorites**: Click the heart icon on any result to save it

### Managing Favorites

1. **Navigate to Favorites**: Click "Favorites" in the navigation bar or visit `/favorites`
2. Filter by type (All, Quips, or Catchphrases)
3. Copy any favorite to clipboard
4. Remove favorites you no longer need

### Data Backup

- **Export**: Settings → Data tab → Download Backup JSON
- **Import**: Settings → Data tab → Import file
- **Clear All**: Settings → Data tab → Clear All Data (with confirmation)

## Keyboard Shortcuts

- `Ctrl+Enter`: Generate flavor text (when in context input)

## Privacy & Security

- ✅ All data stored in browser's localStorage
- ✅ API keys never leave your browser
- ✅ No backend or database
- ✅ No telemetry or tracking
- ✅ Export excludes API keys for security

## Project Structure

```
/workspace
├── app/
│   ├── layout.tsx          # Root layout with Toaster
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles with theme variables
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── character-profile-form.tsx
│   ├── generation-panel.tsx
│   ├── favorites-list.tsx
│   ├── settings-dialog.tsx
│   ├── profile-selector.tsx
│   └── providers.tsx       # Client-side initialization
├── stores/
│   ├── character-store.ts  # Character state management
│   └── settings-store.ts   # Settings state management
├── lib/
│   ├── ai-generator.ts     # AI SDK integration
│   ├── storage.ts          # localStorage utilities
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
└── package.json
```

## Development

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### Type Check

```bash
pnpm tsc --noEmit
```

## Acceptance Criteria

- ✅ Can create and manage multiple character profiles
- ✅ Can generate Vicious Mockery and catchphrases with AI
- ✅ Generated text reflects character context accurately
- ✅ Can favorite and unfavorite generated text
- ✅ Can export data as JSON and import it back
- ✅ API key works with OpenAI, Anthropic, and Google AI
- ✅ All data persists on page reload
- ✅ Mobile responsive with good UX
- ✅ Proper error handling for API failures
- ✅ Dark/light mode support
- ✅ PDF character sheet upload (max 5MB)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
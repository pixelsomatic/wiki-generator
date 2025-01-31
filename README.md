# Wiki Generator

A VS Code extension that automatically generates detailed wiki documentation for your code using AI.

## Requirements

- Visual Studio Code ^1.96.0
- Internet connection (for AI service access)
- API Key for the selected AI provider

## Installation

Install this extension from the VS Code marketplace.

## Configuration

This extension requires the following configuration:

1. Open VS Code Settings
2. Search for "Wiki Generator"
3. Configure the following settings:
   - `wikiGenerator.provider`: AI provider to use (default: 'gemini')
   - `wikiGenerator.apiKey`: Your API key for the selected provider
   - `wikiGenerator.model`: Model configuration for different providers

## How to Use

1. Open VS Code
2. Click the "File Explorer" icon in the Activity Bar
3. Select one or multiple files you want to document
4. Right-click and select "Generate Wiki Page" from the context menu
5. The extension will automatically:
   - Read the selected files
   - Generate detailed documentation using AI
   - Create a new `.wiki.md` file next to your source file
   - Open the generated wiki in both editor and preview mode

## Features

- Multi-file documentation support
- AI-powered documentation generation
- Markdown wiki file creation
- Automatic preview
- Progress indicators
- Context menu integration

## Dependencies

This extension uses:
- Google's Generative AI (Gemini)
- OpenAI's API (for future implementations)

## Release Notes

### 0.0.1

Initial release of Wiki Generator with features:
- AI-powered documentation generation
- Markdown wiki file creation
- Automatic preview
- Context menu integration

---

**Enjoy writing self-documenting code!**
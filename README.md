# Wiki Generator

A VS Code extension that automatically generates beautiful and descriptive wiki pages for your code features using AI technology.

## Features

- Generate comprehensive wiki documentation from your code with a single click
- Right-click context menu integration in the VS Code explorer
- Supports both selected code snippets and entire files
- Automatically creates formatted Markdown wiki pages with sections like:
  - Introduction
  - Setup
  - Code Explanation
  - Best Practices
- Instant preview of generated wiki pages

## Requirements

- Visual Studio Code ^1.96.0
- Internet connection (for AI service access)

## How to Use

1. Open any code file in VS Code
2. Either:
   - Select a specific code snippet you want to document
   - Or leave the file without selection to document the entire file
3. Right-click and select "Generate Wiki Page" from the context menu
4. The extension will automatically:
   - Generate detailed documentation
   - Create a new `.wiki.md` file
   - Open the generated wiki in both editor and preview mode

## Extension Settings

Currently, this extension doesn't require any additional configuration.

## Known Issues

- API key is currently hardcoded (will be moved to secure configuration in future updates)

## Release Notes

### 0.0.1

Initial release of Wiki Generator with features:
- AI-powered documentation generation
- Markdown wiki file creation
- Automatic preview
- Context menu integration

## Dependencies

This extension uses:
- Google's Generative AI (Gemini 1.5)
- OpenAI's API (for future implementations)

## Contributing

Feel free to submit issues and enhancement requests on our repository.

---

**Enjoy writing self-documenting code!**
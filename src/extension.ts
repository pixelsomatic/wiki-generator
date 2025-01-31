import * as vscode from 'vscode';
import { createAIService } from './services/ai-service';

export function activate(context: vscode.ExtensionContext) {
  console.log('Wiki Generator Extension is now active!');

  let disposable = vscode.commands.registerCommand('wiki-generator.generateWiki', async () => {
    console.log('Command executed: wiki-generator.generateWiki');
    
    // Get configuration
    const config = vscode.workspace.getConfiguration('wikiGenerator');
    const provider = config.get<string>('provider') || 'gemini';
    const apiKey = config.get<string>('apiKey');
    const modelConfig = config.get<any>('model');
    const modelName = modelConfig[provider];

    console.log('Provider:', provider);
    console.log('API Key configured:', apiKey ? 'Yes' : 'No');
    console.log('Selected model:', modelName);

    if (!apiKey) {
      vscode.window.showErrorMessage('Please set your API Key in settings');
      return;
    }

    // Allow multiple file selection
    const files = await vscode.window.showOpenDialog({
      canSelectMany: true,
      filters: {
        'All Files': ['*']
      }
    });

    if (!files || files.length === 0) {
      vscode.window.showErrorMessage('No files selected!');
      return;
    }

    // Create progress window
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Generating Wiki",
      cancellable: false
    }, async (progress) => {
      try {
        const aiService = createAIService(provider, apiKey, modelName);

        // Read all selected files
        progress.report({ message: 'Reading files...' });
        let allCode = '';
        for (const file of files) {
          const document = await vscode.workspace.openTextDocument(file);
          allCode += `\n\nFile: ${file.fsPath}\n`;
          allCode += document.getText();
        }

        // Prepare the AI prompt
        const prompt = `Explain the following code in a way that describes how to implement the feature and what this code does. Format it as a detailed wiki page with sections like "Introduction", "Setup", "Code Explanation", and "Best Practices".\n\nCode:\n${allCode}`;

        // Get AI response
        progress.report({ message: 'Generating content...' });
        const wikiContent = await aiService.generateContent(prompt);

        // Generate Markdown file
        progress.report({ message: 'Creating wiki file...' });
        const wikiFilePath = files[0].fsPath.replace(/\.\w+$/, ".wiki.md");
        const wikiUri = vscode.Uri.file(wikiFilePath);

        // Write to the Markdown file
        await vscode.workspace.fs.writeFile(
          wikiUri,
          Buffer.from(`# Wiki Page\n\n${wikiContent}`, 'utf8')
        );

        // Show success message
        vscode.window.showInformationMessage(`Wiki page generated: ${wikiFilePath}`);

        // Open the generated wiki file in the editor
        const document = await vscode.workspace.openTextDocument(wikiUri);
        await vscode.window.showTextDocument(document);

        // Open Markdown preview
        await vscode.commands.executeCommand('markdown.showPreview', wikiUri);

      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to generate wiki: ${error.message}`);
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

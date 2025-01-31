"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const { GoogleGenerativeAI } = require("@google/generative-ai");
function activate(context) {
    let disposable = vscode.commands.registerCommand('wiki-generator.generateWiki', async () => {
        // Get configuration
        const config = vscode.workspace.getConfiguration('wikiGenerator');
        const apiKey = config.get('apiKey');
        const modelName = config.get('model') || 'gemini-1.5-flash';
        console.log('API Key configured:', apiKey ? 'Yes' : 'No');
        console.log('Selected model:', modelName);
        if (!apiKey) {
            vscode.window.showErrorMessage('Please set your Google AI API Key in settings');
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
                // Google Generative AI setup
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });
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
                const result = await model.generateContent(prompt);
                const wikiContent = result.response.text();
                // Generate Markdown file
                progress.report({ message: 'Creating wiki file...' });
                const wikiFilePath = files[0].fsPath.replace(/\.\w+$/, ".wiki.md");
                const wikiUri = vscode.Uri.file(wikiFilePath);
                // Write to the Markdown file
                await vscode.workspace.fs.writeFile(wikiUri, Buffer.from(`# Wiki Page\n\n${wikiContent}`, 'utf8'));
                // Show success message
                vscode.window.showInformationMessage(`Wiki page generated: ${wikiFilePath}`);
                // Open the generated wiki file in the editor
                const document = await vscode.workspace.openTextDocument(wikiUri);
                await vscode.window.showTextDocument(document);
                // Open Markdown preview
                await vscode.commands.executeCommand('markdown.showPreview', wikiUri);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to generate wiki: ${error.message}`);
            }
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
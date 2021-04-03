// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Api from './api';
import SidebarWebview from './views/SidebarWebview';
import InitialAppdata from './utils/InitAppdata';

const EventBus = new Api();

const openSidebarView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@simias/sidebar/dist/${file}`);
	const view = new SidebarWebview(context, assets);
	view.onReady(webview => EventBus.register(webview));

	return view;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	InitialAppdata();

	const sidebarView = vscode.window.registerWebviewViewProvider("simias.openSidebarView", openSidebarView(context));
	context.subscriptions.push(sidebarView);
}

// this method is called when your extension is deactivated
export function deactivate() { }

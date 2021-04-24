// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Api from './api';
import SidebarWebview from './views/SidebarWebview';
import InitialAppdata from './utils/InitAppdata';
import { Treeview } from './utils/TreeviewLoader';

const EventBus = new Api();

const openEnvironmentView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@simias/environment/dist/${file}`);
	const view = new SidebarWebview(context, assets);
	view.onReady(webview => EventBus.register(webview));

	return view;
};

const openHistoryView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@simias/history/dist/${file}`);
	const view = new SidebarWebview(context, assets);
	view.onReady(webview => EventBus.register(webview));

	return view;
};

const openResponseTreeview = (context: vscode.ExtensionContext) => {
	const view = new Treeview(context);
	view.onReady(view => EventBus.register(view));
	return {
		treeDataProvider: view
	};
};

const openResponseView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@simias/response/dist/${file}`);
	const view = new SidebarWebview(context, assets);
	view.onReady(webview => EventBus.register(webview));

	return view;
};

const openEndpointsView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@simias/endpoints/dist/${file}`);
	const view = new SidebarWebview(context, assets);
	view.onReady(webview => EventBus.register(webview));

	return view;
};

const openVariablesView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@simias/variables/dist/${file}`);
	const view = new SidebarWebview(context, assets);
	view.onReady(webview => EventBus.register(webview));

	return view;
};

const openRequestView = (context: vscode.ExtensionContext) => {
	const assets = (file: string) => import(`@simias/request/dist/${file}`);
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

	const environmentView = vscode.window.registerWebviewViewProvider("simias.openEnvironmentView", openEnvironmentView(context));
	context.subscriptions.push(environmentView);
	const historyView = vscode.window.registerWebviewViewProvider("simias.openHistoryView", openHistoryView(context));
	context.subscriptions.push(historyView);
	const responseView = vscode.window.registerWebviewViewProvider("simias.openResponseView", openResponseView(context));
	context.subscriptions.push(responseView);
	const endpointsView = vscode.window.registerWebviewViewProvider("simias.openEndpointsView", openEndpointsView(context));
	context.subscriptions.push(endpointsView);
	const variablesView = vscode.window.registerWebviewViewProvider("simias.openVariablesView", openVariablesView(context));
	context.subscriptions.push(variablesView);
	const requestView = vscode.window.registerWebviewViewProvider("simias.openRequestView", openRequestView(context));
	context.subscriptions.push(requestView);

	const responseTreeview = vscode.window.createTreeView('simias.openResponseTreeView', openResponseTreeview(context));
}

// this method is called when your extension is deactivated
export function deactivate() { }

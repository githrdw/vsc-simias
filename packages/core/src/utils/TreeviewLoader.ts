import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as path from 'path';
import { BusNode } from '../api/d';

export class Treeview implements vscode.TreeDataProvider<number> {
  private _onDidChangeTreeData: vscode.EventEmitter<number | null> = new vscode.EventEmitter<number | null>();
  readonly onDidChangeTreeData: vscode.Event<number | null> = this._onDidChangeTreeData.event;

  private tree: json.Node | undefined;
  private text: string;

  constructor(private context: vscode.ExtensionContext) {
    this.text = "";
    this.parseTree();
  }

  public onReady(callback: (view: BusNode) => any) {
    callback({
      onDidReceiveMessage: (msg) => { },
      postMessage: ({ payload }: any) => {
        if (payload && payload.__action) {
          if (payload.__action === "response.JSON") {
            const message = { ...payload };
            delete message.__action;
            this.text = JSON.stringify(message);
            this.parseTree();
            this._onDidChangeTreeData.fire(null);
          }
        }
      }
    });
  }

  private parseTree(): void {
    this.tree = json.parseTree(this.text);
  }

  getChildren(offset?: number): Thenable<number[]> {
    if (!this.tree) { return Promise.resolve([]); };
    if (offset) {
      const path = json.getLocation(this.text, offset).path;
      const node = json.findNodeAtLocation(this.tree, path);
      return Promise.resolve(node ? this.getChildrenOffsets(node) : []);
    } else {
      return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
    }
  }

  private getChildrenOffsets(node: json.Node): number[] {
    if (!node.children || !this.tree) { return []; };
    const offsets: number[] = [];
    for (const child of node.children) {
      const childPath = json.getLocation(this.text, child.offset).path;
      const childNode = json.findNodeAtLocation(this.tree, childPath);
      if (childNode) {
        offsets.push(childNode.offset);
      }
    }
    return offsets;
  }

  getTreeItem(offset: number): vscode.TreeItem {
    if (!this.tree) { return new vscode.TreeItem('Empty'); };
    const path = json.getLocation(this.text, offset).path;
    const valueNode = json.findNodeAtLocation(this.tree, path);
    if (valueNode) {
      const hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
      const treeItem: vscode.TreeItem = new vscode.TreeItem(this.getLabel(valueNode), hasChildren ? valueNode.type === 'object' ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
      treeItem.iconPath = this.getIcon(valueNode);
      treeItem.contextValue = valueNode.type;
      return treeItem;
    }
    return new vscode.TreeItem('Empty');
  }

  private getIcon(node: json.Node): any {
    const nodeType = node.type;
    if (nodeType === 'boolean') {
      return {
        light: this.context.asAbsolutePath(path.join('assets', 'treeview', 'light', 'boolean.svg')),
        dark: this.context.asAbsolutePath(path.join('assets', 'treeview', 'dark', 'boolean.svg'))
      };
    }
    if (nodeType === 'string') {
      return {
        light: this.context.asAbsolutePath(path.join('assets', 'treeview', 'light', 'string.svg')),
        dark: this.context.asAbsolutePath(path.join('assets', 'treeview', 'dark', 'string.svg'))
      };
    }
    if (nodeType === 'number') {
      return {
        light: this.context.asAbsolutePath(path.join('assets', 'treeview', 'light', 'number.svg')),
        dark: this.context.asAbsolutePath(path.join('assets', 'treeview', 'dark', 'number.svg'))
      };
    }
    return null;
  }

  private getLabel(node: json.Node): string {
    if (!node || !node.parent || !node.parent.children) { return ''; };
    if (node.parent.type === 'array') {
      const prefix = node.parent.children.indexOf(node).toString();
      if (node.type === 'object') {
        return prefix + ':{ }';
      }
      if (node.type === 'array') {
        return prefix + ':[ ]';
      }
      return prefix + ':' + node.value.toString();
    }
    else {
      const property = node.parent.children[0].value.toString();
      if (node.type === 'array' || node.type === 'object') {
        if (node.type === 'object') {
          return '{ } ' + property;
        }
        if (node.type === 'array') {
          return '[ ] ' + property;
        }
      }
      const value = 'Vladimir';
      return `${property}: ${this.text.substr(node.offset, node.length)}`;
    }
  }
}
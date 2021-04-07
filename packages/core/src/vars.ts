import * as vscode from 'vscode';
import { join } from 'path';

const userConfig = vscode.workspace.getConfiguration('simias');
const configDirectory: string = userConfig.get('configDirectory') || "";

const APP_DIR = './dist';
const USR_ROOT = configDirectory || process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const USR_APP_DIR = join(USR_ROOT, 'vsc-simias');
const WIDGETS_ROOT = 'widgets';
const LAYOUTS_ROOT = 'layouts';
const DATA_ROOT = 'data';

export default {
  APP_DIR,
  USR_ROOT,
  USR_APP_DIR,
  WIDGETS_ROOT,
  LAYOUTS_ROOT,
  DATA_ROOT
};
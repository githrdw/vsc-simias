import { Webview } from "vscode";

export interface BusNode {
  onDidReceiveMessage: (payload: any) => void,
  postMessage: (message: any) => void
}

export interface ExecuteParams {
  id: string,
  action: string,
  payload: object
}

export interface Payload {
  error?: string
}

export interface RespondPayload {
  (payload?: any): void
}

export interface ExecuteCore {
  respond: RespondPayload,
  vars: any,
  webview: Webview | BusNode
}

export interface SimiasStore {
  request: {
    abortController: null | AbortController
  }
}

export interface Run {
  [key: string]: (core: ExecuteCore, payload: any) => void
}
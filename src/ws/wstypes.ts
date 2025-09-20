import WebSocket from "ws";

export interface WSClient {
    userId: string;
    socket: WebSocket;
}

export interface WSIncomingMessage {
    type: string;
    payload?: any;
}

export interface WSOutgoingMessage {
    type: string;
    data: any;
}

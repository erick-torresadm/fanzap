const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';

interface CreateInstanceResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    status: string;
  };
  hash?: {
    apikey: string;
  };
  settings?: Record<string, unknown>;
}

interface InstanceInfo {
  instance: {
    instanceName: string;
    state: string;
  };
}

interface FetchInstancesResponse {
  name?: string;
  id?: string;
  connectionStatus?: string;
  ownerJid?: string;
  owner?: string;
}

interface ConnectResponse {
  qrCode?: {
    code: string;
    base64: string;
  };
  pairingCode?: string;
  code?: string;
  count?: number;
}

export class EvolutionAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiUrl?: string, apiKey?: string) {
    this.baseUrl = apiUrl || EVOLUTION_API_URL;
    this.apiKey = apiKey || EVOLUTION_API_KEY;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
    };
  }

  async createInstance(instanceName: string): Promise<CreateInstanceResponse> {
    const response = await fetch(`${this.baseUrl}/instance/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create instance' }));
      throw new Error(error.message || error.response?.message || 'Failed to create instance');
    }

    return response.json();
  }

  async connectInstance(instanceName: string): Promise<ConnectResponse> {
    const response = await fetch(`${this.baseUrl}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get QR code' }));
      throw new Error(error.message || 'Failed to get QR code');
    }

    return response.json();
  }

  async getInstanceInfo(instanceName: string): Promise<InstanceInfo> {
    const response = await fetch(`${this.baseUrl}/instance/connectionState/${instanceName}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get instance info' }));
      throw new Error(error.message || 'Failed to get instance info');
    }

    return response.json();
  }

async getInstances(): Promise<FetchInstancesResponse[]> {
    const response = await fetch(`${this.baseUrl}/instance/fetchInstances`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get instances' }));
      throw new Error(error.message || error.response?.message || 'Failed to get instances');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  async fetchNewMessages(instanceName: string, lastId?: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/findMessages/${instanceName}?page=1`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ limit: 20 })
      });

      if (!response.ok) return [];
      
      const data = await response.json();
      const messages = data.records || [];
      
      const newMsgs = messages.filter((m: any) => 
        !m.key?.fromMe && m.id !== lastId
      );
      
      return newMsgs;
    } catch {
      return [];
    }
  }

  async deleteInstance(instanceName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete instance' }));
      throw new Error(error.message || 'Failed to delete instance');
    }
  }

  async logoutInstance(instanceName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/instance/logout/${instanceName}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to logout instance' }));
      throw new Error(error.message || 'Failed to logout instance');
    }
  }

  async sendMessage(instanceName: string, number: string, text: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        number: number.replace('@s.whatsapp.net', '').replace(/\D/g, ''),
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send message' }));
      throw new Error(error.message || 'Failed to send message');
    }
  }

  async sendMedia(instanceName: string, number: string, media: {
    mediaUrl?: string;
    mediaBase64?: string;
    caption?: string;
    fileName?: string;
    fileExtension?: string;
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/message/sendMedia/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        number: number.replace('@s.whatsapp.net', '').replace(/\D/g, ''),
        mediaUrl: media.mediaUrl,
        mediaBase64: media.mediaBase64,
        caption: media.caption,
        fileName: media.fileName,
        fileExtension: media.fileExtension,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send media' }));
      throw new Error(error.message || 'Failed to send media');
    }
  }

  async sendLocation(instanceName: string, number: string, location: {
    latitude: number;
    longitude: number;
    title?: string;
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/message/sendLocation/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        number: number.replace('@s.whatsapp.net', '').replace(/\D/g, ''),
        latitude: location.latitude,
        longitude: location.longitude,
        title: location.title,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send location' }));
      throw new Error(error.message || 'Failed to send location');
    }
  }

  async sendButton(instanceName: string, number: string, button: {
    title: string;
    footer?: string;
    items: { id: string; title: string }[];
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/message/sendList/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        number: number.replace('@s.whatsapp.net', '').replace(/\D/g, ''),
        title: button.title,
        footer: button.footer,
        buttonText: 'Selecionar',
        sections: [
          {
            title: 'Opções',
            rows: button.items,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send buttons' }));
      throw new Error(error.message || 'Failed to send buttons');
    }
  }

  async sendButtons(instanceName: string, number: string, buttons: {
    title: string;
    body: string;
    footer?: string;
    buttons: { id: string; title: string }[];
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/message/sendButtons/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        number: number.replace('@s.whatsapp.net', '').replace(/\D/g, ''),
        title: buttons.title,
        bodyText: buttons.body,
        footer: buttons.footer,
        buttons: buttons.buttons.map((b) => ({ ...b, type: 'reply' })),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send buttons' }));
      throw new Error(error.message || 'Failed to send buttons');
    }
  }

  mapStatus(evolutionStatus: string): 'connected' | 'disconnected' | 'connecting' {
    const statusMap: Record<string, 'connected' | 'disconnected' | 'connecting'> = {
      'open': 'connected',
      'close': 'disconnected',
      'connecting': 'connecting',
    };
    return statusMap[evolutionStatus] || 'disconnected';
  }

  async setWebhook(instanceName: string, webhookUrl: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/webhook/set/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        webhook: {
          url: webhookUrl,
          enabled: true,
          webhookByEvents: false,
          webhookBase64: false,
          events: [
            'APPLICATION_STARTUP',
            'INSTANCE_START',
            'INSTANCE_STATUS',
            'CONNECTED',
            'DISCONNECTED',
            'MESSAGES_UPSERT',
            'MESSAGES_UPDATE',
            'MESSAGES_DELETE',
            'SEND_MESSAGE',
            'CONTACTS_SET',
            'CONTACTS_UPDATE',
            'PRESENCE_UPDATE',
          ],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to set webhook' }));
      throw new Error(error.message || 'Failed to set webhook');
    }
  }

  async getWebhook(instanceName: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/webhook/find/${instanceName}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get webhook' }));
      throw new Error(error.message || 'Failed to get webhook');
    }

    return response.json();
  }
}

export const evolutionApi = new EvolutionAPI();
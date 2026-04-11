const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://api.membropro.com.br';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'd6996979cd25b0ebe76ab2fbe509538e';

interface CreateInstanceResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    status: string;
  };
}

interface InstanceQRCode {
  qrcode: {
    code: string;
    base64: string;
  };
}

interface InstanceInfo {
  instance: {
    instanceName: string;
    instanceId: string;
    owner: string;
    status: string;
  };
}

interface SendMessageResponse {
  key: {
    id: string;
    remote: string;
    fromMe: boolean;
    timestamp: number;
  };
}

export class EvolutionAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = EVOLUTION_API_URL;
    this.apiKey = EVOLUTION_API_KEY;
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
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create instance');
    }

    return response.json();
  }

  async connectInstance(instanceName: string): Promise<InstanceQRCode> {
    const response = await fetch(`${this.baseUrl}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const text = await response.text();
    
    if (!response.ok) {
      let error;
      try {
        error = JSON.parse(text);
      } catch {
        error = { message: text };
      }
      throw new Error(error.message || `Failed to get QR code (${response.status})`);
    }

    try {
      const data = JSON.parse(text);
      return {
        qrcode: {
          code: data.code || data.qrCode?.code || '',
          base64: data.qrCode || data.base64 || data.qrcode?.base64 || '',
        },
      };
    } catch {
      throw new Error('Invalid QR code response');
    }
  }

  async getInstanceInfo(instanceName: string): Promise<InstanceInfo> {
    const response = await fetch(`${this.baseUrl}/instance/connectionState/${instanceName}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get instance info');
    }

    return response.json();
  }

  async getInstances(): Promise<{ instances: Array<{ instanceName: string; status: string }> }> {
    const response = await fetch(`${this.baseUrl}/instance/findAll`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get instances');
    }

    return response.json();
  }

  async deleteInstance(instanceName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/instance/delete/${instanceName}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete instance');
    }
  }

  async sendMessage(instanceName: string, number: string, text: string): Promise<SendMessageResponse> {
    const response = await fetch(`${this.baseUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        number: number.replace('@s.whatsapp.net', ''),
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return response.json();
  }

  async sendMedia(instanceName: string, number: string, mediaUrl: string, caption?: string): Promise<SendMessageResponse> {
    const response = await fetch(`${this.baseUrl}/message/sendMedia/${instanceName}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        number: number.replace('@s.whatsapp.net', ''),
        mediaUrl,
        caption,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send media');
    }

    return response.json();
  }

  mapStatus(evolutionStatus: string): 'connected' | 'disconnected' | 'connecting' {
    const statusMap: Record<string, 'connected' | 'disconnected' | 'connecting'> = {
      'open': 'connected',
      'close': 'disconnected',
      'connecting': 'connecting',
      'connected': 'connected',
      'disconnected': 'disconnected',
    };
    return statusMap[evolutionStatus] || 'disconnected';
  }
}

export const evolutionApi = new EvolutionAPI();
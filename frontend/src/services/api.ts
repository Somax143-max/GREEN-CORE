// API Client for GreenCore Backend REST Service

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/+$/, '');

export interface BackendHealth {
  status: string;
  version: string;
  timestamp: string;
  service: string;
}

export const api = {
  // Healthcheck with 5s timeout for cloud cold starts
  async checkHealth(): Promise<{ online: boolean; data?: BackendHealth }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        return { online: true, data };
      }
      return { online: false };
    } catch {
      return { online: false };
    }
  },

  // Overview
  async getOverview() {
    const res = await fetch(`${API_BASE_URL}/api/campus/overview`);
    return res.json();
  },

  // Nodes
  async getNodes() {
    const res = await fetch(`${API_BASE_URL}/api/campus/nodes`);
    return res.json();
  },

  // Scores
  async getScores() {
    const res = await fetch(`${API_BASE_URL}/api/campus/scores`);
    return res.json();
  },

  // Manual entry submission
  async submitManualEntry(payload: {
    nodeId: string;
    category: 'energy' | 'water' | 'waste' | 'transport';
    value: number;
    unit: string;
    actor: string;
    reason: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/campus/manual-entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Killer demo: Inject anomaly
  async injectAnomaly() {
    const res = await fetch(`${API_BASE_URL}/api/campus/anomaly/inject`, {
      method: 'POST',
    });
    return res.json();
  },

  // Killer demo: Resolve anomaly
  async resolveAnomaly() {
    const res = await fetch(`${API_BASE_URL}/api/campus/anomaly/resolve`, {
      method: 'POST',
    });
    return res.json();
  },

  // Killer demo: Reset demo
  async resetDemo() {
    const res = await fetch(`${API_BASE_URL}/api/campus/anomaly/reset`, {
      method: 'POST',
    });
    return res.json();
  },

  // Simulation
  async runSimulation(selectedIds: string[]) {
    const res = await fetch(`${API_BASE_URL}/api/campus/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedIds }),
    });
    return res.json();
  },

  // AI Query
  async queryAI(query: string) {
    const res = await fetch(`${API_BASE_URL}/api/campus/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return res.json();
  },

  // Missions join
  async joinMission(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/campus/missions/${id}/join`, {
      method: 'POST',
    });
    return res.json();
  }
};

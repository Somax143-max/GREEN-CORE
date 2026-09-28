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

  // History (12 Months MoM & YoY)
  async getHistory() {
    const res = await fetch(`${API_BASE_URL}/api/campus/history`);
    return res.json();
  },

  // Benchmarking
  async getBenchmarking() {
    const res = await fetch(`${API_BASE_URL}/api/campus/benchmark`);
    return res.json();
  },

  // Campus Memory
  async getCampusMemory() {
    const res = await fetch(`${API_BASE_URL}/api/campus/memory`);
    return res.json();
  },

  // Cryptographic Ledger Verification
  async verifyAuditLedger() {
    const res = await fetch(`${API_BASE_URL}/api/campus/audit/verify-ledger`);
    return res.json();
  },

  // Metric Provenance & Data Lineage
  async getMetricProvenance(metricId: string) {
    const res = await fetch(`${API_BASE_URL}/api/campus/provenance/${metricId}`);
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

  // Anomaly toggle
  async toggleAnomaly(active?: boolean) {
    const res = await fetch(`${API_BASE_URL}/api/campus/anomaly/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    return res.json();
  },

  // Verify Action Outcome (Closed-Loop)
  async verifyActionOutcome(actionId: string) {
    const res = await fetch(`${API_BASE_URL}/api/campus/actions/${actionId}/verify-outcome`, {
      method: 'POST',
    });
    return res.json();
  },

  // Create Operational Action / Work Order
  async createAction(payload: any) {
    const res = await fetch(`${API_BASE_URL}/api/campus/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

  // Mode Switch
  async setMode(mode: 'manual' | 'hybrid' | 'iot') {
    const res = await fetch(`${API_BASE_URL}/api/campus/mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    });
    return res.json();
  },

  // Join Green Mission
  async joinMission(missionId: string) {
    const res = await fetch(`${API_BASE_URL}/api/campus/missions/${missionId}/join`, {
      method: 'POST',
    });
    return res.json();
  },

  // Aliases for simulation / demo toggles
  injectAnomaly: async () => api.toggleAnomaly(true),
  resolveAnomaly: async () => api.toggleAnomaly(false),
  resetDemo: async () => api.toggleAnomaly(false),
};

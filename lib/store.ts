import fs from 'fs';
import path from 'path';
import os from 'os';

// On Vercel serverless, process.cwd() is read-only. We use os.tmpdir() when on Vercel.
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'remoterate-data')
  : path.join(process.cwd(), '.data');

// In-memory fallback cache for serverless environments
const memoryCache: Record<string, any> = {
  'events.json': [],
  'feedback.json': [],
  'leads.json': [],
};

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Ignore error in restricted environments
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryCache[filename] = parsed;
      return parsed;
    }
  } catch (err) {
    // Fallback to memory
  }
  return (memoryCache[filename] as T) || defaultValue;
}

function writeJsonFile(filename: string, data: any) {
  memoryCache[filename] = data;
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Graceful fallback to memoryCache if file system is read-only
  }
}

export interface StoredEvent {
  id: string;
  event: string;
  properties?: Record<string, any>;
  timestamp: string;
}

export interface StoredFeedback {
  id: string;
  priceFeeling: 'kemurahan' | 'pas' | 'kemahalan';
  willUse: 'pasti_pakai' | 'mungkin' | 'tidak_yakin';
  feedbackNotes?: string;
  service?: string;
  recommendedRate?: number;
  timestamp: string;
}

export interface StoredLead {
  id: string;
  email: string;
  name?: string;
  role?: string;
  notes?: string;
  timestamp: string;
}

export const dataStore = {
  getEvents(): StoredEvent[] {
    return readJsonFile<StoredEvent[]>('events.json', []);
  },
  addEvent(event: Omit<StoredEvent, 'id' | 'timestamp'> & { timestamp?: string }) {
    const events = this.getEvents();
    const newEntry: StoredEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: event.timestamp || new Date().toISOString(),
      event: event.event,
      properties: event.properties || {},
    };
    events.unshift(newEntry);
    writeJsonFile('events.json', events.slice(0, 1000));
    return newEntry;
  },

  getFeedback(): StoredFeedback[] {
    return readJsonFile<StoredFeedback[]>('feedback.json', []);
  },
  addFeedback(item: Omit<StoredFeedback, 'id' | 'timestamp'>) {
    const feedbacks = this.getFeedback();
    const newEntry: StoredFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...item,
    };
    feedbacks.unshift(newEntry);
    writeJsonFile('feedback.json', feedbacks);
    return newEntry;
  },

  getLeads(): StoredLead[] {
    return readJsonFile<StoredLead[]>('leads.json', []);
  },
  addLead(item: Omit<StoredLead, 'id' | 'timestamp'>) {
    const leads = this.getLeads();
    const existingIndex = leads.findIndex((l) => l.email.toLowerCase() === item.email.toLowerCase());
    const newEntry: StoredLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...item,
    };
    if (existingIndex >= 0) {
      leads[existingIndex] = { ...leads[existingIndex], ...item, timestamp: new Date().toISOString() };
    } else {
      leads.unshift(newEntry);
    }
    writeJsonFile('leads.json', leads);
    return newEntry;
  },

  getAnalyticsSummary() {
    const events = this.getEvents();
    const feedbacks = this.getFeedback();
    const leads = this.getLeads();

    const counts: Record<string, number> = {};
    for (const e of events) {
      counts[e.event] = (counts[e.event] || 0) + 1;
    }

    const priceFeelCounts = {
      kemurahan: feedbacks.filter((f) => f.priceFeeling === 'kemurahan').length,
      pas: feedbacks.filter((f) => f.priceFeeling === 'pas').length,
      kemahalan: feedbacks.filter((f) => f.priceFeeling === 'kemahalan').length,
    };

    const willUseCounts = {
      pasti_pakai: feedbacks.filter((f) => f.willUse === 'pasti_pakai').length,
      mungkin: feedbacks.filter((f) => f.willUse === 'mungkin').length,
      tidak_yakin: feedbacks.filter((f) => f.willUse === 'tidak_yakin').length,
    };

    return {
      totalEvents: events.length,
      eventCounts: counts,
      funnel: {
        landing_view: counts['landing_view'] || 0,
        tool_start: counts['tool_start'] || 0,
        rate_result_view: counts['rate_result_view'] || 0,
        action_copy: counts['action_copy'] || 0,
        feedback_submitted: feedbacks.length,
        lead_submit: leads.length,
        pay_intent_click: counts['pay_intent_click'] || 0,
      },
      priceFeelCounts,
      willUseCounts,
      totalLeads: leads.length,
      recentEvents: events.slice(0, 50),
      feedbacks: feedbacks.slice(0, 50),
      leads: leads.slice(0, 50),
    };
  },
};

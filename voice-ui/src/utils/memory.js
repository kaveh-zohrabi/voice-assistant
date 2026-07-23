export class Memory {
  constructor() {
    this.conversations = [];
    this.userPreferences = {};
    this.facts = [];
    this.load();
  }

  load() {
    try {
      const data = localStorage.getItem('jarvis_memory');
      if (data) {
        const parsed = JSON.parse(data);
        this.conversations = parsed.conversations || [];
        this.userPreferences = parsed.userPreferences || {};
        this.facts = parsed.facts || [];
      }
    } catch {}
  }

  save() {
    localStorage.setItem('jarvis_memory', JSON.stringify({
      conversations: this.conversations.slice(-50),
      userPreferences: this.userPreferences,
      facts: this.facts.slice(-100),
    }));
  }

  addMessage(role, content) {
    this.conversations.push({ role, content, time: Date.now() });
    this.save();
  }

  getRecentMessages(count = 10) {
    return this.conversations.slice(-count);
  }

  setPreference(key, value) {
    this.userPreferences[key] = value;
    this.save();
  }

  getPreference(key) {
    return this.userPreferences[key];
  }

  addFact(fact) {
    if (!this.facts.includes(fact)) {
      this.facts.push(fact);
      this.save();
    }
  }

  getFacts() {
    return this.facts;
  }

  clear() {
    this.conversations = [];
    this.userPreferences = {};
    this.facts = [];
    localStorage.removeItem('jarvis_memory');
  }

  getSummary() {
    const recentTopics = this.conversations.slice(-20).map(m => m.content.slice(0, 50));
    return {
      messageCount: this.conversations.length,
      preferences: this.userPreferences,
      facts: this.facts.slice(-10),
      recentTopics,
    };
  }
}

export const memory = new Memory();

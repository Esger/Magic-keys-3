export class SettingsService {
    constructor() {
        this._settingsKey = 'smart-keys-settings';
        this._settings = this.loadSettings();
    }

    loadSettings() {
        const settings = localStorage.getItem(this._settingsKey);
        return settings ? JSON.parse(settings) : {};
    }

    saveSettings() {
        localStorage.setItem(this._settingsKey, JSON.stringify(this._settings));
    }

    getSetting(key, defaultValue) {
        return this._settings[key] !== undefined ? this._settings[key] : defaultValue;
    }

    setSetting(key, value) {
        this._settings[key] = value;
        this.saveSettings();
    }

    loadKnowledge() {
        const knowledge = localStorage.getItem('smart-keys');
        return knowledge ? JSON.parse(knowledge) : null;
    }

    saveKnowledge(knowledge) {
        localStorage.setItem('smart-keys', JSON.stringify(knowledge));
    }
}

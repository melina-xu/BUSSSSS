import React from 'react';
import { UserAppSettings } from '../types';
import { 
  X, 
  Settings, 
  Sparkles, 
  HelpCircle, 
  Key, 
  ShieldCheck, 
  Check, 
  Map, 
  Zap, 
  Compass, 
  Info,
  Layers
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserAppSettings;
  onSaveSettings: (settings: UserAppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = React.useState<UserAppSettings>(settings);

  if (!isOpen) return null;

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-[#e5e2e1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#6cdf5c]" />
            <h3 className="text-lg font-bold">Transit Preferences & API Keys</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#9ca3af] hover:text-[#e5e2e1]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Concession Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-2">
              Fare Concession Card Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Adult', 'Student', 'Senior', 'Workfare'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, concessionType: type })}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    localSettings.concessionType === type
                      ? 'bg-[#242424] border-[#6cdf5c] text-[#6cdf5c]'
                      : 'bg-[#201f1f] border-[#2e2e2e] text-[#becab6]'
                  }`}
                >
                  <span>{type} Concession</span>
                  {localSettings.concessionType === type && <Check className="w-4 h-4 text-[#6cdf5c]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sheltered Walkway Priority */}
          <div className="bg-[#201f1f] border border-[#2e2e2e] p-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#e5e2e1]">Prioritize Sheltered Walkways</p>
              <p className="text-xs text-[#9ca3af]">Ideal for Singapore tropical monsoon showers</p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.shelteredWalkwaysPriority}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, shelteredWalkwaysPriority: e.target.checked })
              }
              className="w-5 h-5 rounded border-[#2e2e2e] text-[#37ab2e] focus:ring-[#6cdf5c] bg-[#242424]"
            />
          </div>

          {/* Singapore Transit & OneMap API Keys */}
          <div className="space-y-3 pt-2 border-t border-[#2e2e2e]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a2c9ff]">
              <Key className="w-4 h-4" />
              <span>Singapore Government & Live Transit APIs</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#e5e2e1] mb-1">
                LTA_ACCOUNT_KEY (For Live Transport Timings & Bus Arrivals)
              </label>
              <input
                type="password"
                placeholder="Enter LTA DataMall AccountKey..."
                value={localSettings.ltaApiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, ltaApiKey: e.target.value })}
                className="w-full bg-[#242424] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-[#e5e2e1] font-mono placeholder:text-[#9ca3af] focus:border-[#6cdf5c] focus:outline-none"
              />
              <p className="text-[10px] text-[#9ca3af] mt-1">
                Provides real-time LTA DataMall v3 bus arrival predictions, train alerts, and road traffic incidents.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#e5e2e1] mb-1">
                ONEMAP_TOKEN (Real OneMap Token/Key for Route Planning)
              </label>
              <input
                type="password"
                placeholder="Enter Singapore OneMap API Token..."
                value={localSettings.oneMapApiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, oneMapApiKey: e.target.value })}
                className="w-full bg-[#242424] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-[#e5e2e1] font-mono placeholder:text-[#9ca3af] focus:border-[#6cdf5c] focus:outline-none"
              />
              <p className="text-[10px] text-[#9ca3af] mt-1">
                Enables official Singapore OneMap SLA routing (sheltered walking paths, public transit, and cycling vectors).
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#2e2e2e]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#9ca3af] hover:text-[#e5e2e1]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSaveSettings(localSettings);
              onClose();
            }}
            className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#37ab2e] text-[#003701] hover:bg-[#6cdf5c] glow-effect transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="upgrade-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#6cdf5c]/40 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 text-[#e5e2e1] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#6cdf5c]" />
            <h3 className="text-xl font-extrabold text-[#e5e2e1]">Urban Kinetic Pro</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#9ca3af] hover:text-[#e5e2e1]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#becab6] leading-relaxed">
          Unlock high-precision Singapore commuter intelligence, live train car crowd density, and priority departure notifications.
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 bg-[#201f1f] p-3 rounded-xl border border-[#2e2e2e]">
            <Zap className="w-5 h-5 text-[#6cdf5c] flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#e5e2e1]">Live MRT Train Car Heatmaps</p>
              <p className="text-[11px] text-[#9ca3af]">Identify exact empty cars before the train arrives</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#201f1f] p-3 rounded-xl border border-[#2e2e2e]">
            <Layers className="w-5 h-5 text-[#3394f1] flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#e5e2e1]">High-Precision Rain Radar Overlay</p>
              <p className="text-[11px] text-[#9ca3af]">Live 15-minute precipitation vector predictions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#201f1f] p-3 rounded-xl border border-[#2e2e2e]">
            <Compass className="w-5 h-5 text-[#f85d9d] flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#e5e2e1]">Offline Singapore Rail Graph</p>
              <p className="text-[11px] text-[#9ca3af]">Instant sub-second routing even in underground tunnels</p>
            </div>
          </div>
        </div>

        <div className="bg-[#242424] p-4 rounded-xl text-center border border-[#2e2e2e]">
          <span className="text-2xl font-black text-[#6cdf5c]">S$ 2.99</span>
          <span className="text-xs text-[#9ca3af]"> / month (Cancel anytime)</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-[#37ab2e] hover:bg-[#6cdf5c] text-[#003701] font-bold text-xs uppercase tracking-wider glow-effect transition-all"
        >
          Activate Pro Membership
        </button>
      </div>
    </div>
  );
};

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="help-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-[#e5e2e1]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#6cdf5c]" />
            <h3 className="text-lg font-bold">Singapore Commuter Guide</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#9ca3af] hover:text-[#e5e2e1]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto text-xs text-[#becab6] leading-relaxed pr-1">
          <div>
            <h4 className="font-bold text-[#e5e2e1] uppercase tracking-wider mb-1">Bus Occupancy Legend</h4>
            <ul className="space-y-1">
              <li>🟢 <strong className="text-[#6cdf5c]">SEA (Seats Available):</strong> Plenty of vacant seats on board.</li>
              <li>🟡 <strong className="text-[#ff9800]">SDA (Standing Available):</strong> No seats left, standing room available.</li>
              <li>🔴 <strong className="text-[#ffb4ab]">LSD (Limited Standing):</strong> Bus near capacity, consider next arrival.</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-[#2e2e2e]">
            <h4 className="font-bold text-[#e5e2e1] uppercase tracking-wider mb-1">Transit Lines</h4>
            <p>EWL (Green), NSL (Red), NEL (Purple), CCL (Orange), DTL (Blue), TEL (Brown).</p>
          </div>

          <div className="pt-2 border-t border-[#2e2e2e]">
            <h4 className="font-bold text-[#e5e2e1] uppercase tracking-wider mb-1">OneMap & LTA Integration</h4>
            <p>
              Urban Kinetic utilizes real-time Singapore data endpoints to calculate optimal multi-modal travel times, fare calculations, and bus arrival updates.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#2e2e2e]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#242424] text-[#e5e2e1] hover:bg-[#2e2e2e]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

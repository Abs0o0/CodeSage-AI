import { SETTINGS_SECTIONS } from "./constants";

export default function SettingsNav({ active, onChange }) {
  return (
    <nav className="settings-nav" aria-label="Settings navigation">
      {SETTINGS_SECTIONS.map((section) => {
        const Icon = section.icon;
        const isActive = active === section.id;

        return (
          <button
            key={section.id}
            type="button"
            className={isActive ? "settings-nav-item active" : "settings-nav-item"}
            onClick={() => onChange(section.id)}
          >
            <span className="set-ico">
              <Icon size={18} />
            </span>

            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
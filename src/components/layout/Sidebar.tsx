import { Calculator, CreditCard, LayoutDashboard, Save } from "lucide-react";

type Section = "dashboard" | "transactions" | "calculator" | "backup";

interface SidebarProps {
  isOpen: boolean;
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onClose: () => void;
}

const menuSections = [
  {
    title: "Main",
    items: [
      { id: "dashboard" as Section, label: "Dashboard", icon: LayoutDashboard },
      { id: "transactions" as Section, label: "Transactions", icon: CreditCard },
    ],
  },
  {
    title: "Tools",
    items: [
      { id: "calculator" as Section, label: "EMI Calculator", icon: Calculator },
      { id: "backup" as Section, label: "Backup & Restore", icon: Save },
    ],
  },
];

export default function Sidebar({ isOpen, currentSection, onSectionChange, onClose }: SidebarProps) {
  const handleItemClick = (sectionId: Section) => {
    onSectionChange(sectionId);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-background/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <nav
        className={`fixed top-20 w-72 h-[calc(100vh-5rem)] bg-card/95 backdrop-blur-xl border-r border-border/50 z-50 transition-all duration-300 overflow-y-auto ${
          isOpen ? "left-0" : "-left-72"
        }`}
      >
        <div className="p-6">
          {menuSections.map((section, index) => (
            <div key={section.title} className={index > 0 ? "mt-6" : ""}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      currentSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted/50 menu-item-hover"
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}

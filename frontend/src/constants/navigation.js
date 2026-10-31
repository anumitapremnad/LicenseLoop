import {
  LayoutDashboard,
  Users,
  Layers,
  CreditCard,
  FileText,
  Wallet,
  KeyRound,
  BarChart3,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'plans', label: 'Plans', icon: Layers },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'licenses', label: 'License Management', icon: KeyRound },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

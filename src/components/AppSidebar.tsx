import { Home, Dumbbell, History, Settings, Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Exercises', href: '/exercises', icon: Dumbbell },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-primary">Office Drills</h1>
        )}
        <SidebarTrigger className="ml-auto">
          <Menu className="h-4 w-4" />
        </SidebarTrigger>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <div className={isActive ? 'bg-accent text-accent-foreground' : ''}>
                      <NavLink to={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
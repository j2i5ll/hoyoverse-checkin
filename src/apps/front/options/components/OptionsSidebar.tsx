import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar,
  SidebarHeader,
  SidebarGroup,
} from '@front/external/components/ui/sidebar';
import { AppIcon } from '@front/shared/AppIcon';
import { APP_NAME } from '@src/shared/constants/text';
import { ChartLine, CheckCheck, Rocket } from 'lucide-react';
import { NavLink } from 'react-router-dom';
const OptionsSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center">
        <AppIcon />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {APP_NAME}
        </h4>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/">
                  <CheckCheck /> Check in
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/laqoos">
                  <ChartLine /> LaQoos
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/onboarding">
                  <Rocket /> Onboarding
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/notification">
                <Bell />
                Notification
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          */}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default OptionsSidebar;

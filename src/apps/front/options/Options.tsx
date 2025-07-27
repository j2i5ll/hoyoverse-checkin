import { SidebarProvider } from '@front/external/components/ui/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import OptionsSidebar from '@front/options/components/OptionsSidebar';
import Header from '@front/options/components/Header';
import { Footer } from '@front/options/components/Footer';

const Options: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-row flex-1">
        <OptionsSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex-1 p-4">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Options;
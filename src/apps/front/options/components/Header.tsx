import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@front/external/components/ui/breadcrumb';
import { Separator } from '@front/external/components/ui/separator';
import { SidebarTrigger } from '@front/external/components/ui/sidebar';
import { ModeToggle } from '@front/options/components/ModeToggle';
import OptionsTitle from '@front/options/components/OptionsTitle';

const Header = () => {
  return (
    <header className="flex items-center justify-between h-16 gap-2 px-4 border-b shrink-0">
      <div className="flex flex-row items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 ml-2 mr-2" />
      </div>
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <OptionsTitle />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ModeToggle />
    </header>
  );
};
export default Header;

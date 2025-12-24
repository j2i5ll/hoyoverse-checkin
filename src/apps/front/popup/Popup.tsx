import withErrorBoundary from '@front/shared/hoc/withErrorBoundary';
import PopupHeader from './components/PopupHeader';
import Nav from './components/Nav';
import { Outlet } from 'react-router-dom';
// import { ScrollArea } from '@front/external/components/ui/scroll-area';

const Popup = () => {
  return (
    <div className="flex h-[450px] flex-col justify-between">
      <PopupHeader />

      <div className="flex min-h-[380px] flex-1 flex-col overflow-y-auto">
        {/*
      <ScrollArea className="flex min-h-[380px] flex-1 flex-col overflow-y-auto">
      </ScrollArea >
      */}
        <Outlet />
      </div>
      <Nav />
    </div >
  );
};

export default withErrorBoundary(Popup, <div> Error Occur </div>);

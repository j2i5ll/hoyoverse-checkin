import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@front/external/components/ui/tabs';
import { LAQOOS_URL } from '@src/shared/constants/url';
import { BatteryCharging, ChartNoAxesColumn, CheckCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getTabValue = () => {
    const pathList = location.pathname.split('/');
    if (pathList[1] === '') {
      return 'checkIn';
    }
    if (pathList[1] === 'resource') {
      return 'resource';
    }
    return '';
  };
  const tabValue = getTabValue();
  const openLaqoos = () => {
    window.open(`${LAQOOS_URL}?utm_source=hoyoversecheckin&utm_medium=nav&utm_campaign=link`, '_blank');
  }
  return (
    <Tabs value={tabValue}>
      <TabsList className="grid w-full h-12 grid-cols-3 rounded-none">
        <TabsTrigger value="checkIn" onClick={() => navigate('/')}>
          <CheckCheck className="mr-1" />
          Check In
        </TabsTrigger>
        <TabsTrigger value="resource" onClick={() => navigate('/resource')}>
          <BatteryCharging className="mr-1" /> Resource
        </TabsTrigger>
        <TabsTrigger value="laqoos" onClick={() => openLaqoos()} className="relative">
          <ChartNoAxesColumn className="mr-1" size={20} /> LaQoos
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
export default Nav;

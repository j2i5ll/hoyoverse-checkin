import { ga } from '@src/shared/ga';
import { useEffect, useState } from 'react';
import { useLocation, useMatches } from 'react-router-dom';

type RouterData = { title: string; logTitle: string };
const OptionsTitle = () => {
  const [title, setTitle] = useState('');
  const location = useLocation();
  const match = useMatches();
  useEffect(() => {
    const last = match.pop();
    const { title, logTitle } = (last.data as RouterData) ?? {};
    if (title) {
      setTitle(title);
      ga.firePageViewEvent(logTitle, location.pathname);
    }
  }, [match]);
  return <>{title}</>;
};
export default OptionsTitle;

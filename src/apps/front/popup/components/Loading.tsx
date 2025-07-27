import { LoaderCircle } from 'lucide-react';

type LoadingProps = {
  style?: React.CSSProperties;
};
function Loading({ style }: LoadingProps) {
  return (
    <div className="flex flex-1 items-center justify-center" style={style}>
      <LoaderCircle className="animate-spin" size={45} />
    </div>
  );
}
export default Loading;

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ResourceInfo } from '@src/types';
import { Gamepad2 } from 'lucide-react';

type ResourceProgressProps = {
  resource: ResourceInfo;
  img: string;
};
const ResourceProgress = ({ resource, img }: ResourceProgressProps) => {
  const MAX_PERCENT = 75;
  const percent =
    (resource.currentResource / resource.maxResource) * MAX_PERCENT;
  return (
    <>
      <div className="relative size-44">
        <svg
          className="size-full rotate-[135deg]"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-muted-foreground/30"
            strokeWidth="1.5"
            strokeDasharray={`${MAX_PERCENT} 100`}
            strokeLinecap="round"
          ></circle>

          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-foreground"
            strokeWidth="1.5"
            strokeDasharray={`${percent} 100`}
            strokeLinecap="round"
          ></circle>
        </svg>

        <div className="absolute start-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-y-2 text-center">
          <Avatar className="h-[60px] w-[60px] drop-shadow-lg">
            <AvatarImage src={img} />
            <AvatarFallback>
              <Gamepad2 size={58} color="#999999" />
            </AvatarFallback>
          </Avatar>
          <span className="block text-xs">
            {resource.currentResource} / {resource.maxResource}
          </span>
        </div>
      </div>
    </>
  );
};

export default ResourceProgress;

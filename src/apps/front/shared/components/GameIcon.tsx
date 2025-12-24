import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@front/external/components/ui/avatar';
import { cn } from '@front/external/lib/utils';
import { Gamepad2 } from 'lucide-react';

type GameIconProps = {
  active?: boolean;
  src: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
};
export default function GameIcon({
  active = true,
  src,
  alt,
  onClick,
  className,
}: GameIconProps) {
  return (
    <Avatar
      onClick={onClick}
      className={cn(
        `cursor-pointer drop-shadow-xl`,
        {
          'cursor-pointer': onClick,
          'opacity-40': !active,
          'opacity-100': active,
        },
        className,
      )}
    >
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        <Gamepad2 className="text-neutral-300 h-2/3 w-2/3" />
      </AvatarFallback>
    </Avatar>
  );
}

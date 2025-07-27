import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@front/external/components/ui/card';
import { APP_NAME } from '@src/shared/constants/text';
import { ReactNode } from 'react';

type TooltipLayerProps = {
  content: ReactNode;
  footer?: ReactNode;
  description?: ReactNode;
};
const TooltipLayout = ({ content, footer }: TooltipLayerProps) => {
  return (
    <Card className="fixed bottom-[50px] left-[50px] z-[9999] flex min-h-[100px] w-[400px] flex-col justify-between overflow-hidden rounded-[12px] bg-background">
      <CardHeader className="space-y-[6px] p-[24px]">
        <CardTitle className="text-[20px] font-semibold">{APP_NAME}</CardTitle>
      </CardHeader>

      <CardContent className="p-[24px] pt-0">{content}</CardContent>
      {footer && (
        <CardFooter className="flex flex-row justify-end gap-x-[8px] p-[24px] pt-0">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default TooltipLayout;

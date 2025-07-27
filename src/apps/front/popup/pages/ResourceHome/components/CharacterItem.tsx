import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@front/external/components/ui/card';
import { CharacterItemType } from '@src/types';
type CharacterItemProps = {
  character: CharacterItemType;
  select: () => void;
};
function CharacterItem({ character, select }: CharacterItemProps) {
  return (
    <Card
      onClick={() => select()}
      className="my-2 cursor-pointer duration-100 hover:-translate-y-1 hover:scale-[1.02]"
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm">
          {character.nickname} (Lv.{character.level})
        </CardTitle>
        <CardDescription>
          {character.regionName}
          <br />
          UUID: {character.gameRoleId}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
export default CharacterItem;

import { APP_NAME } from '@src/shared/constants/text';
import { LAQOOS_URL } from '@src/shared/constants/url';

export const Footer = () => {
  return (
    <footer className="w-full mx-auto border-t min-h-20">
      <div className="container flex items-center justify-between h-full px-4 mx-auto text-xs text-muted-foreground ">
        <div className="min-w-80 max-w-80">
          <ul className="flex flex-col py-4 gap-y-2 break-keep" >
            <li >
              {APP_NAME}은 miHoYo 또는 HoYoverse에서 공식적으로 운영하는 앱이 아닌 비공식 앱입니다.
            </li>
            <li >
              게임 내 리소스(이미지, 데이터 등)의 저작권 및 상표권은 miHoYo 또는 HoYoverse에 있으며, {APP_NAME}는 해당 회사와 아무런 제휴/관련이 없습니다.
            </li>
          </ul>
        </div>
        <nav>
          <ul className="flex space-x-4 ">
            <li><a href={`${LAQOOS_URL}/policy/hoyoverse-checkin/privacy`} target="_blank" rel="noreferrer" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </nav>
        <div className="flex justify-end space-x-2 min-w-80 max-w-80">
        </div>
      </div>
    </footer >

  )
};

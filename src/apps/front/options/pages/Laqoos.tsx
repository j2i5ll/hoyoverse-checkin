import { Button } from '@front/external/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@front/external/components/ui/card';
import { APP_NAME } from '@src/shared/constants/text';
import { LAQOOS_URL } from '@src/shared/constants/url';
import { ChartColumn, ChartLine, ChartPie } from 'lucide-react';


const Laqoos = () => {

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen mx-auto gap-y-16">
      <h1 className="flex flex-row items-end justify-center text-6xl font-bold leading-tight text-center gap-x-4">
        <span>LaQoos는<br />HoYoverse게임들의<br />캐릭터 및 게임전적 통계를 제공합니다</span>
      </h1>
      <p className="text-lg text-center text-muted-foreground">
        LaQoos는 HoYoverse 게임들의 전적을 기반으로 다양한 통계를 제공합니다.<br />
        통계정보를 확인하고 인사이트를 얻어보세요.
      </p>
      <div className="grid w-3/4 grid-cols-3 gap-4">
        <Card >
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              캐릭터 통계조회
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-lg gap-y-4">
            <div className="flex flex-row items-center justify-center">
              <ChartPie size={70} />
            </div>
            캐릭터의 보유/돌파/사용률 그리고 캐릭터의 능력치 분포 등 캐릭터 통계로부터 다양한 인사이트를 얻어보세요.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Challenge 통계조회
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-lg gap-y-4">
            <div className="flex flex-row items-center justify-center">
              <ChartColumn size={70} />
            </div>
            보다 더 상세한 challenge 통계를 경험하세요.<br />
            라운드 단위의 통계를 통해 더 상세하고 정확한 통계를 확인해보세요.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              무기 통계조회
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-lg gap-y-4">
            <div className="flex flex-row items-center justify-center">
              <ChartLine size={70} />
            </div>
            무기의 사용률과 돌파 비율 등 다양한 무기 정보를 확인하세요.
          </CardContent>
        </Card>
      </div>
      <Button size="lg" className="h-16 text-lg" asChild>
        <a href={`${LAQOOS_URL}`} target="_blank" rel="noreferrer">
          LaQoos에서 확인하기
        </a>
      </Button>
      <div className="flex flex-col items-center justify-center gap-y-4">
        <h4 className="text-xl tracking-tight scroll-m-20">
          어떻게 게임 데이터를 수집하나요?
        </h4>
        <p className="text-sm text-center text-muted-foreground">
          LaQoos는 {APP_NAME}로 부터 출석체크에 등록된 계정의 게임정보를 수집합니다.<br />
          {APP_NAME}는 브라우저에 저장된 쿠키를 이용해 캐릭터/전적 정보를 조회합니다.<br />
          조회된 데이터는 로그인을 위한 쿠키 정보를 제외하고 LaQoos서버에 전송합니다.<br /><br />
          캐릭터/전적 조회 수집을 원하지 않는다면 <a href="#/" className="underline text-muted-foreground">출석체크 메뉴</a>에서 옵션을 설정해주세요.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-4">
        <h4 className="text-xl tracking-tight scroll-m-20">
          어떤 게임 전적을 수집하나요?
        </h4>
        <p className="text-sm text-center text-muted-foreground">
          원신, 붕괴:스타레일, 젠레스 존 제로의 캐릭터/전적 데이터를 수집합니다.
        </p>
      </div>
    </div >
  )
};

export default Laqoos;

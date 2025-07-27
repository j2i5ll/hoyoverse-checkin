type Nullish = undefined | null;
export const isLogin = (ltoken: string | Nullish, ltuid: string | Nullish) => {
  return (
    ltoken?.trim() !== '' &&
    ltuid?.trim() !== '' &&
    ltoken !== undefined &&
    ltuid !== undefined &&
    ltoken !== null &&
    ltuid !== null &&
    ltuid !== '0'
  );
};

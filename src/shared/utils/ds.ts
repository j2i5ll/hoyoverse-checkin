import crypto from 'crypto-js';

const randomString = (e: number) => {
  const s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const res = [];
  for (let i = 0; i < e; ++i) {
    res.push(s[Math.floor(Math.random() * s.length)]);
  }
  return Array(e)
    .fill(0)
    .map(() => s[Math.floor(Math.random() * s.length)])
    .join('');
};

export const getOsDS = () => {
  const time = Math.floor(Date.now() / 1000);
  const random = randomString(6);
  const salt = '6s25p5ox5y14umn1p61aqyyvbvvl3lrt';

  const c = crypto.MD5(`salt=${salt}&t=${time}&r=${random}`);
  return `${time},${random},${c}`;
};

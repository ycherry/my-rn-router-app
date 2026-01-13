import { createServerFn } from '@tanstack/react-start';
import { parse } from 'cookie';

export const getServerLanguage = createServerFn({ method: 'GET' }).handler(async (ctx) => {
  try {
    // @ts-ignore
    const request = ctx.request;
    if (!request) {
        return 'zh';
    }
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return 'zh';
    const cookies = parse(cookieHeader);
    return cookies['i18next'] || 'zh';
  } catch (error) {
    console.error('Error getting server language:', error);
    return 'zh';
  }
});

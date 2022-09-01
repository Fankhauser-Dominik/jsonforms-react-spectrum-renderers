export const openItemWhenInQueryParam = (
  path: string,
  index: number,
  handleExpand: (refresh: boolean) => void
) => {
  try {
    const url: any = new URL(window.location.toString());

    const formLocation: any = url.searchParams.get('formLocation');
    if (!formLocation) {
      return;
    }
    const regex = new RegExp(`((^|_)${path}-${index}($|_))`);

    if (regex.test(formLocation)) {
      handleExpand(false);
    }
  } catch {}
};

export const findValue: any = (obj: any, key: string) => {
  if (!obj || !key) {
    return undefined;
  }
  if (obj[key]) {
    return obj[key];
  }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        const result: any = findValue(obj[prop], key);
        if (result) {
          return result;
        }
      }
    }
  }
};

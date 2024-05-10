export const encodeData = <Data>(data: Data) => {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

export const decodeDate = <Data>(encodedData: string) => {
  try {
    return JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8')) as Data;
  } catch (error) {
    return null;
  }
};

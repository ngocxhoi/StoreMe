type OTPType = {
  [key: number]: number | null;
};

export default (obj: OTPType): string => {
  let keys = "";
  for (const key in obj) {
    keys += obj[key]?.toString();
  }
  return keys;
};

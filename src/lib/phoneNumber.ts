import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

export const isValidMalaysianPhoneNumberMobile = (phoneNumber: string): boolean => {
  try {
    // parse `phoneNumber`
    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(phoneNumber, 'MY');

    // check if `phoneNumber` is a valid Malaysian phone number
    return phoneUtil.isValidNumberForRegion(number, 'MY');
  } catch (error) {
    return false;
  }
};

export const isValidMalaysianPhoneNumberLandline = (phoneNumber: string): boolean => {
  // clean `phoneNumber`
  const number = phoneNumber.replaceAll(' ', '').replaceAll('-', '');

  return !!number.match(/^(03)[0-9]{8}$/g);
};

export const formatMalaysianPhoneNumberMobile = (phoneNumber: string): string => {
  // parse `phoneNumber`
  const phoneUtil = PhoneNumberUtil.getInstance();
  const number = phoneUtil.parse(phoneNumber, 'MY');

  // format `phoneNumber`
  return phoneUtil.format(number, PhoneNumberFormat.E164);
};

export interface CheckoutDTO {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  isNewsletterActivated: boolean;
  phone?: string;
  address: CheckoutAddressDTO;
  discountCode?: string;
}

export interface CheckoutAddressDTO {
  street: string;
  number: string;
  addition?: string;
  city: string;
  country: string;
  zip: string;
}

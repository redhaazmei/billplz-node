import { BaseAPI } from './base';

interface SplitPaymentFixed {
  /**
   * The email address of the split rule's recipient.
   * (The account must be a verified Billplz account).
   */
  email: string;

  /**
   * A positive integer in the smallest currency unit that is going in your account (e.g `100` cents to charge RM 1.00)
   * This field is required if `variable_cut` is not present.
   */
  fixed_cut: number | null;

  /**
   * Percentage in positive integer format that is going in your account.
   * This field is required if `fixed_cut` is not present.
   */
  variable_cut?: number | null;

  /**
   * Either `true` or `false`.
   * All bill and receipt templates will show split rule recipient's infographic if this was set to true.
   */
  split_header: boolean;
}

interface SplitPaymentVariable {
  /**
   * The email address of the split rule's recipient.
   * (The account must be a verified Billplz account).
   */
  email: string;

  /**
   * A positive integer in the smallest currency unit that is going in your account (e.g `100` cents to charge RM 1.00)
   * This field is required if `variable_cut` is not present.
   */
  fixed_cut?: number | null;

  /**
   * Percentage in positive integer format that is going in your account.
   * This field is required if `fixed_cut` is not present.
   */
  variable_cut: number | null;

  /**
   * Either `true` or `false`.
   * All bill and receipt templates will show split rule recipient's infographic if this was set to true.
   */
  split_header: boolean;
}

type SplitPayment =
  | SplitPaymentFixed
  | SplitPaymentVariable
  | (SplitPaymentFixed & SplitPaymentVariable);

interface CreateCollectionParams {
  /**
   * Collection title. Will be displayed on bill template.
   */
  title: string;

  /**
   * Collection logo. This image will be resized to avatar (40x40) and thumb (180x180) dimensions.
   * Whitelisted formats are `jpg`, `jpeg`, `gif` and `png`.
   * (Absolute path to image file)
   *
   * @example
   * ```ts
   * const params: CreateCollectionParams = {
   *  logo: '/Users/images/logo.jpg',
   * }
   * ```
   */
  logo?: string;

  /**
   * Collection's split payment details and rules.
   */
  split_payment?: SplitPayment;
}

interface CreateCollectionResponse {
  /**
   * Collection's `id`
   */
  id: string;

  /**
   * Collection's title
   */
  title: string;

  /**
   * Collection's logo object.
   * Includes `thumb_url` and `avatar_url` properties.
   */
  logo: {
    thumb_url: string | null;
    avatar_url: string | null;
  };

  /**
   * Collection's split payment details and rules.
   */
  split_payment: Required<SplitPayment>;
}

interface CreatePaymentFormParams {
  /**
   * The collection title. It's showing up on the payment form.
   * (Max of 50 characters)
   */
  title: string;

  /**
   * The collection description. Will be displayed on payment form.
   * (Max of 200 characters)
   */
  description: string;

  /**
   * A positive integer in the smallest currency unit (e.g 100 cents to charge RM 1.00)
   * Required if `fixed_amount` is true; Ignored if `fixed_amount` is false
   */
  amount: number;

  /**
   * Boolean value. Set this to false for Open Amount.
   *
   * @defaultValue `true`
   */
  fixed_amount?: boolean;

  /**
   * Boolean value. Set this to false for Open Quantity.
   *
   * @defaultValue `true`
   */
  fixed_quantity?: boolean;

  /**
   * Payment button's text. Available options are buy and pay. Default value is pay
   *
   * @defaultValue `"pay"`
   */
  payment_button?: string | null;

  /**
   * Label #1 to reconcile payments (Max of 20 characters).
   *
   * @defaultValue `"Reference 1"`
   */
  reference_1_label?: string | null;

  /**
   * Label #2 to reconcile payments (Max of 20 characters).
   *
   * @defaultValue `"Reference 2"`
   */
  reference_2_label?: string | null;

  /**
   * A URL string that email to customer after payment is successful.
   */
  email_link?: string | null;

  /**
   * Tax rate in positive integer format.
   */
  tax?: number | null;

  /**
   * Collection image. Will be displayed on payment form.
   * This image will be resized to retina (Yx960) and avatar (180x180) dimensions.
   * Whitelisted formats are `jpg`, `jpeg`, `gif` and `png`.
   * (Absolute path to image file)
   *
   * @example
   * ```ts
   * const params: CreateCollectionParams = {
   *  photo: '/Users/images/product-image.jpg',
   * }
   * ```
   */
  photo?: string;

  /**
   * Collection's split payment details and rules.
   */
  split_payment?: SplitPayment;
}

interface CreatePaymentFormResponse
  extends Required<Pick<CreatePaymentFormParams, Exclude<keyof CreatePaymentFormParams, 'photo'>>> {
  /**
   * Payment Form's `id`
   */
  id: string;

  /**
   * Payment Form's avatar url and retina url object.
   * Includes `retina_url` and `avatar_url` properties.
   * (Retina dimension =  `960x960` and avatar dimension = `180x180`)
   */
  photo: {
    retina_url: string | null;
    avatar_url: string | null;
  };

  /**
   * Payment Form's split payment details and rules.
   */
  split_payment: Required<SplitPayment>;
}

export class BillplzCollections extends BaseAPI {
  /**
   * Creates a Billplz `Collection`. Supports creation of collection with a split rule feature.
   *
   * @returns Collection's `id` needed in `Bill API`, split rule info and fields.
   */
  public async create(params: CreateCollectionParams): Promise<CreateCollectionResponse> {
    const response = await this.requestMultipart('POST', 'collections', params);
    return (await response.json()) as CreateCollectionResponse;
  }

  /**
   * Creates a Billplz `Payment Form` or `Open Collection`. Supports creation of collection with a split rule feature.
   *
   * @returns Collection's `id`, collection's attributes, including the payment form URL.
   */
  public async createPaymentForm(
    params: CreatePaymentFormParams,
  ): Promise<CreatePaymentFormResponse> {
    const response = await this.requestMultipart('POST', 'open_collections', params);
    return (await response.json()) as CreatePaymentFormResponse;
  }
}

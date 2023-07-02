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
  fixed_cut: null | number;

  /**
   * Percentage in positive integer format that is going in your account.
   * This field is required if `fixed_cut` is not present.
   */
  variable_cut?: null | number;

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
  fixed_cut?: null | number;

  /**
   * Percentage in positive integer format that is going in your account.
   * This field is required if `fixed_cut` is not present.
   */
  variable_cut: null | number;

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

  /** Collection logo. The image will be resized to avatar (40x40) and thumb (180x180) dimensions.
   * Whitelisted formats are `jpg`, `jpeg`, `gif `and `png`.
   */
  logo?: string;

  /**
   * Collection's split payment details and rules.
   */
  split_payment?: SplitPayment;
}

interface CreateCollectionResponse {
  /**
   * Returns the Collection's `id`
   */
  id: string;

  /**
   * Returns the Collection's title
   */
  title: string;

  /**
   * Returns the Collection's logo object.
   * Includes `thumb_url` and `avatar_url` properties.
   */
  logo: {
    thumb_url: null | string;
    avatar_url: null | string;
  };

  /**
   * Returns the Collection's split payment details and rules.
   */
  split_payment: SplitPayment;
}

export class BillplzCollections extends BaseAPI {
  /**
   * Creates a Billplz `Collection`. Supports creation of collection with a split rule feature.
   *
   * @returns Collection's `id` needed in `Bill API`, split rule info and fields.
   */
  public async create(params: CreateCollectionParams): Promise<CreateCollectionResponse> {
    const response = await this.request('POST', 'collections', params);
    return (await response.json()) as CreateCollectionResponse;
  }
}

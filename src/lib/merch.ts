/**
 * VSEUS merch: the shop link, what's for sale, and the photos. Shared by the
 * homepage merch block and the /merch page.
 *
 * Photos go in public/photos/Merch/, except the ones the homepage block uses,
 * which live in public/photos/Home/merch/.
 */

export const SHOP_URL = 'https://www.showpass.com/vseus-merchandise-sale-202627';

export interface MerchPhoto {
  src: string;
  alt: string;
}

export interface MerchProduct {
  name: string;
  /** Price in Canadian dollars. */
  price: number;
  photo: MerchPhoto;
}

export const PRODUCTS: MerchProduct[] = [
  {
    name: 'T-Shirt',
    price: 20,
    photo: {
      src: '/photos/Merch/tee-bench.jpg',
      alt: 'Two students on a bench outdoors in white VSEUS tees with the "ahead of the curve" print',
    },
  },
  {
    name: 'Hoodie',
    price: 40,
    photo: {
      src: '/photos/Merch/hoodie-trio.jpg',
      alt: 'Three students smiling in navy VSEUS sweaters with the starred VSEUS print',
    },
  },
];

/** The three photos in the homepage merch block. The first is shown full width. */
export const HOME_PHOTOS: MerchPhoto[] = [
  {
    src: '/photos/Home/merch/merch-group.jpg',
    alt: 'VSEUS members posing together in navy VSEUS crewnecks and white tees',
  },
  {
    src: '/photos/Home/merch/merch-crewneck-back.jpg',
    alt: 'Back of a navy VSEUS sweater printed with "Ahead of the Curve"',
  },
  {
    src: '/photos/Home/merch/merch-tee-detail.jpg',
    alt: 'Close-up of the purple "ahead of the curve" print on a cream VSEUS tee',
  },
];

/** The gallery on /merch. */
export const GALLERY_PHOTOS: MerchPhoto[] = [
  HOME_PHOTOS[0],
  {
    src: '/photos/Merch/tee-stamps-back.jpg',
    alt: 'Back of a white VSEUS tee printed with a row of four stamp illustrations',
  },
  {
    src: '/photos/Merch/hoodie-bench.jpg',
    alt: 'Two students on a bench in the sun wearing navy VSEUS sweaters',
  },
  {
    src: '/photos/Merch/tee-front-laughing.jpg',
    alt: 'A student laughing in a white VSEUS tee with the "ahead of the curve" print',
  },
  {
    src: '/photos/Merch/hoodie-outdoors.jpg',
    alt: 'Three students arm in arm outside a stone campus building in navy VSEUS sweaters',
  },
  {
    src: '/photos/Merch/tee-front-print.jpg',
    alt: 'Close-up of the "ahead of the curve" chest print on a white VSEUS tee',
  },
  {
    src: '/photos/Merch/hoodie-back.jpg',
    alt: 'Back of a navy VSEUS sweater with the large "Ahead of the Curve" print',
  },
  {
    src: '/photos/Merch/tee-stamps-back-close.jpg',
    alt: 'Close-up of the stamp illustrations on the back of a white VSEUS tee',
  },
  HOME_PHOTOS[2],
];

export function formatPrice(price: number): string {
  return `$${price}`;
}

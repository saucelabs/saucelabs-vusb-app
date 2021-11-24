import { ProductTourAction } from '../../productTour/ProductTourTypes';

/**
 * Open the requirements container
 */
function openProductTour() {
  return {
    type: ProductTourAction.PRODUCT_TOUR_OPEN,
  };
}

// eslint-disable-next-line import/prefer-default-export
export { openProductTour };

import { ProductTourAction } from '../../types/ProductTourTypes';

/**
 * Open the requirements container
 */
function openProductTour() {
  return {
    type: ProductTourAction.PRODUCT_TOUR_OPEN,
  };
}

export { openProductTour };

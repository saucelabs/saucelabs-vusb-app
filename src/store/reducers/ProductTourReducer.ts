import { ProductTourStateInterface } from '../../productTour/ProductTourInterfaces';
import {
  ProductTourAction as ACTIONS,
  ProductTourActionType,
} from '../../productTour/ProductTourTypes';

const initialProductTourState: ProductTourStateInterface = {
  isOpen: false,
};
const productTourReducer = (
  state: ProductTourStateInterface = initialProductTourState,
  action: ProductTourActionType
) => {
  switch (action.type) {
    case ACTIONS.PRODUCT_TOUR_OPEN:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    default:
      return state;
  }
};

export { initialProductTourState, productTourReducer };

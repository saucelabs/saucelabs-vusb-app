import {
  ProductTourAction as ACTIONS,
  ProductTourActionType,
  ProductTourStateType,
} from '../../types/ProductTourTypes';

const initialProductTourState: ProductTourStateType = {
  isOpen: false,
};
const productTourReducer = (
  state: ProductTourStateType = initialProductTourState,
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

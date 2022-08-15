enum ProductTourAction {
  PRODUCT_TOUR_OPEN = 'PRODUCT_TOUR_OPEN',
}

type ProductTourActionType = { type: ProductTourAction.PRODUCT_TOUR_OPEN };

type ProductTourStateType = {
  isOpen: boolean;
};

export { ProductTourAction, ProductTourActionType, ProductTourStateType };

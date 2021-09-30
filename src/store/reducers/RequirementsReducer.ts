import { RequirementStateInterface } from '../../requirements/RequirementInterfaces';
import {
  RequirementsAction as ACTIONS,
  RequirementsActionType,
} from '../../requirements/RequirementsTypes';

const initialRequirementsState: RequirementStateInterface = {
  isError: false,
  isOpen: false,
};
const requirementsReducer = (
  state: RequirementStateInterface = initialRequirementsState,
  action: RequirementsActionType
) => {
  switch (action.type) {
    case ACTIONS.REQUIREMENTS_OPEN:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case ACTIONS.REQUIREMENTS_ERROR:
      return {
        ...state,
        isError: action.isError,
      };
    default:
      return state;
  }
};

export { initialRequirementsState, requirementsReducer };

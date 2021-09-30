import { RequirementsAction } from '../../requirements/RequirementsTypes';

/**
 * Open the requirements container
 */
function openRequirementsContainer() {
  return {
    type: RequirementsAction.REQUIREMENTS_OPEN,
  };
}

/**
 * Open the requirements container
 */
function updateRequirementsError(isError: boolean) {
  return {
    type: RequirementsAction.REQUIREMENTS_ERROR,
    isError,
  };
}

export { openRequirementsContainer, updateRequirementsError };

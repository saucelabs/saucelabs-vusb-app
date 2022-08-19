import {
  SystemChecksAction,
  SystemChecksStateType,
} from 'types/SystemChecksTypes';

/**
 * Get the system check data
 */
function getSystemCheckData(data: SystemChecksStateType) {
  return {
    data,
    type: SystemChecksAction.GET_SYSTEM_CHECKS_DATA,
  };
}

export { getSystemCheckData };

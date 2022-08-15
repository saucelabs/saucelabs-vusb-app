import {
  TunnelsActionEnum as ACTIONS,
  TunnelsActionType,
  TunnelsStateType,
} from '../../types/TunnelTypes';

const initialTunnelsState: TunnelsStateType = {
  tunnels: [],
  error: null,
};
const tunnelsReducer = (
  state: TunnelsStateType = initialTunnelsState,
  action: TunnelsActionType
) => {
  switch (action.type) {
    case ACTIONS.FETCH_TUNNELS_LOADING:
      return { ...state, error: null };
    case ACTIONS.FETCH_TUNNELS_SUCCESS:
      return {
        ...state,
        tunnels: action.tunnels,
      };
    case ACTIONS.FETCH_TUNNELS_ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export { initialTunnelsState, tunnelsReducer };

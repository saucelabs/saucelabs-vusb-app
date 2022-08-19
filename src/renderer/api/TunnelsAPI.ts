/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import { LOCATION } from 'renderer/utils/Constants';
import { OptionType } from 'renderer/components/Dropdown';
import {
  GetTunnelsType,
  TunnelResponseType,
  TunnelsActionEnum as ACTIONS,
} from '../../types/TunnelTypes';

/**
 * Get all existing Sauce Connect tunnels
 */
async function getTunnels({ dispatch, storageData }: GetTunnelsType) {
  const {
    connection: { location, username, accessKey },
  } = storageData;
  // @ts-ignore
  const dcEndpoint = LOCATION[location.toUpperCase()].endpoint;

  dispatch({ type: ACTIONS.FETCH_TUNNELS_LOADING });

  try {
    const response: TunnelResponseType[] = (
      await axios.get(
        `https://api.${dcEndpoint}.saucelabs.com/rest/v1/${username}/tunnels?full=true`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${btoa(`${username}:${accessKey}`)}`,
            'Cache-Control': 'no-store',
          },
        }
      )
    ).data;
    const tunnels: OptionType[] =
      response.length > 0
        ? response
            .map((tunnel) => ({
              key: tunnel.tunnel_identifier,
              value: tunnel.tunnel_identifier,
            }))
            .sort((a, b) => {
              const tunnelA = a.key.toUpperCase();
              const tunnelB = b.key.toUpperCase();

              // eslint-disable-next-line no-nested-ternary
              return tunnelA === tunnelB ? 0 : tunnelA > tunnelB ? 1 : -1;
            })
        : [];

    dispatch({ type: ACTIONS.FETCH_TUNNELS_SUCCESS, tunnels });
  } catch (error) {
    dispatch({ type: ACTIONS.FETCH_TUNNELS_ERROR, error });
  }
}

export { getTunnels };

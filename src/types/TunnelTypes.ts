import { OptionType } from 'renderer/components/Dropdown';

enum TunnelsActionEnum {
  FETCH_TUNNELS_LOADING = 'FETCH_TUNNELS_LOADING',
  FETCH_TUNNELS_SUCCESS = 'FETCH_TUNNELS_SUCCESS',
  FETCH_TUNNELS_ERROR = 'FETCH_TUNNELS_ERROR',
}

type TunnelResponseType = {
  creation_time: number;
  direct_domains: null | string;
  domain_names: null | string;
  extra_info: string;
  host: string;
  id: string;
  ip_address: null | string;
  is_ready: boolean;
  last_connected: number;
  launch_time: number;
  metadata: {
    hostname: string;
    command_args: string;
    git_version: string;
    platform: string;
    command: string;
    build: string;
    release: string;
    nofile_limit: number;
  };
  no_proxy_caching: boolean;
  no_ssl_bump_domains: null | string;
  owner: string;
  shared_tunnel: boolean;
  shutdown_reason: null | string;
  shutdown_time: number;
  ssh_port: number;
  status: string;
  team_ids: string[];
  tunnel_identifier: string;
  use_caching_proxy: null | string;
  use_kgp: boolean;
  user_shutdown: null | string;
  vm_version: string;
};

type TunnelsStateType = {
  tunnels: OptionType[];
  error: null | Error;
};

type TunnelsActionType =
  | {
      type: TunnelsActionEnum.FETCH_TUNNELS_LOADING;
    }
  | {
      type: TunnelsActionEnum.FETCH_TUNNELS_SUCCESS;
      tunnels: OptionType[];
    }
  | {
      type: TunnelsActionEnum.FETCH_TUNNELS_ERROR;
      error: Error;
    };

export {
  TunnelResponseType,
  TunnelsActionEnum,
  TunnelsActionType,
  TunnelsStateType,
};

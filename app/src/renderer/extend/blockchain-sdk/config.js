import cfg from '../../../config'
export default {
    'connections': {
        'http_host': '127.0.0.1',
        'http_port': '16002',
        'ws_host': '127.0.0.1',
        'ws_port': '16003',
        'retry_times': -1,
        'retry_wait_time': 5000,
    },
    'account': {
        'sync_node_start': false,
        'sync_node_path': cfg.sdk.syncNodeExePath(),
        'account_method': 'lib', // exec: start executable, lib: call library
        'account_method': 'console', // exec: query with argv, lib: query with library, console: query with console
    },
    'store': {
        'account_store': cfg.sdk.accountStorePath(),
        'account_store_suffix': '.wallet',
        'db_file': cfg.sdk.walletDBPath(),
        'db_save_buff_time': 2000,
        'db_save_to_file': true,
        'tx_ceil_ledger_seq': 50,
        'tx_status_detect_interval': 10000,
        'tx_status_detect_limit': 10,
        'query_tx_return_max_size': 100,
    },
};

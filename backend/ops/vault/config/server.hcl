ui = true
storage "raft" {
  path    = "/vault/data"
  node_id = "vault-1"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1        # для локального/тестового prod без TLS
}

api_addr     = "http://vault:8200"
cluster_addr = "http://vault:8201"
disable_mlock = true     # чтобы не ловить варнинги в контейнере

resource "helm_release" "timescaledb" {
  chart      = "timescaledb-single"
  name       = "timescaledb"
  repository = "https://charts.timescale.com"
  namespace  = kubernetes_namespace.shms_dependencies.metadata[0].name

  version = "0.33.1"

  values = [
    file("${path.module}/custom-values/timescaledb.yaml")
  ]

  set {
    name  = "replicaCount"
    value = 3
  }

  set {
    name  = "service.primary.type"
    value = "NodePort"
  }

  set {
    name  = "service.primary.nodePort"
    value = 30432
  }

  depends_on = [
    kubernetes_secret.init_timescaledb_cred,
  ]
}


resource "kubernetes_secret" "init_timescaledb_cred" {
  metadata {
    name      = "timescale-post-init-pw"
    namespace = kubernetes_namespace.shms_dependencies.metadata[0].name
  }
  data = {
    "change_password.sh" = <<EOT
#!/bin/bash
psql -d "$1" --file=- --set ON_ERROR_STOP=1 << __SQL__
SET log_statement TO none;
ALTER USER postgres WITH PASSWORD '${var.timescaledb_password}';
__SQL__
EOT
  }
}
resource "helm_release" "ema_service" {
  chart     = "${path.module}/../../helm/ema-service"
  name      = "ema-service"
  namespace = kubernetes_namespace.shms_microservices.metadata[0].name

  set {
    name  = "env.POSTGRES_HOST"
    value = var.timescaledb_host
  }

  set {
    name  = "env.POSTGRES_PORT"
    value = var.timescaledb_port
  }

  set {
    name  = "env.POSTGRES_USER"
    value = var.timescaledb_username
  }

  set {
    name  = "env.POSTGRES_PASSWORD"
    value = var.timescaledb_password
  }

  set {
    name  = "env.POSTGRES_DB"
    value = var.database_name_for_shms
  }

  set {
    name  = "env.PORT"
    value = "8000"
  }

  set {
    name  = "env.RELOAD"
    value = "false"
  }

  set {
    name  = "env.JWT_SECRET"
    value = var.jwt_secret
  }

  set {
    name  = "env.JWT_EXPIRE_IN_MINUTES"
    value = var.jwt_expire_in_minutes
  }

  set {
    name  = "env.MASTER_ADMIN_USERNAME"
    value = var.master_admin_username
  }

  set {
    name  = "env.MASTER_ADMIN_PASSWORD"
    value = var.master_admin_password
  }
}
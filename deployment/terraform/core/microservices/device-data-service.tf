resource "helm_release" "device_data_service" {
  chart     = "${path.module}/../../../helm/device-data-service"
  name      = "device-data-service"
  namespace = kubernetes_namespace.shms_microservices.metadata[0].name

  set {
    name  = "env.TIMESCALEDB_HOST"
    value = var.timescaledb_host
  }

  set {
    name  = "env.TIMESCALEDB_PORT"
    value = var.timescaledb_port
  }

  set {
    name  = "env.TIMESCALEDB_USER"
    value = var.timescaledb_username
  }

  set {
    name  = "env.TIMESCALEDB_PASSWORD"
    value = var.timescaledb_password
  }

  set {
    name  = "env.TIMESCALEDB_DBNAME"
    value = var.database_name_for_shms
  }

  set {
    name  = "env.PORT"
    value = 8000
  }

  set {
    name  = "env.RELOAD"
    value = false
  }

  set {
    name  = "env.PATH_PREFIX"
    value = "/data"
  }

  set {
    name  = "env.KAFKA_HOST"
    value = var.kafka_host
  }

  set {
    name  = "env.KAFKA_PORT"
    value = var.kafka_port
  }

  set {
    name  = "env.KAFKA_USERNAME"
    value = var.kafka_username
  }

  set {
    name  = "env.KAFKA_PASSWORD"
    value = var.kafka_password
  }

  set {
    name  = "env.KAFKA_TOPIC"
    value = var.kafka_topic
  }

  set {
    name  = "env.KAFKA_CLIENT_ID"
    value = var.device_data_svc_consumer_group
  }

  set {
    name  = "env.EMA_SERVICE_URL"
    value = var.ema_service_url
  }

  set {
    name  = "env.JWT_SECRET"
    value = var.jwt_secret
  }

  depends_on = [
    helm_release.ema_service
  ]
}
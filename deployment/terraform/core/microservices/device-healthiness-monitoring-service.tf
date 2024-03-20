resource "helm_release" "device_healthiness_monitoring_service" {
  chart     = "${path.module}/../../../helm/device-healthiness-monitoring-service"
  name      = "device-healthiness-monitoring-service"
  namespace = kubernetes_namespace.shms_microservices.metadata[0].name

  set {
    name  = "webServer.image.pullPolicy"
    value = var.image_pull_policy
  }

  set {
    name  = "pipeline.image.pullPolicy"
    value = var.image_pull_policy
  }

  set {
    name  = "webServer.env.path_prefix"
    value = "/dhms"
  }

  set {
    name  = "webServer.env.port"
    value = "8000"
  }

  set {
    name  = "webServer.env.TIMESCALEDB_HOST"
    value = var.timescaledb_host
  }

  set {
    name  = "webServer.env.TIMESCALEDB_PORT"
    value = var.timescaledb_port
  }

  set {
    name  = "webServer.env.TIMESCALEDB_USER"
    value = var.timescaledb_username
  }

  set {
    name  = "webServer.env.TIMESCALEDB_PASSWORD"
    value = var.timescaledb_password
  }

  set {
    name  = "webServer.env.TIMESCALEDB_DBNAME"
    value = var.database_name_for_shms
  }

  set {
    name  = "webServer.env.JWT_SECRET"
    value = var.jwt_secret
  }

  set {
    name  = "webServer.env.X_API_KEY"
    value = var.api_key
  }

  set {
    name  = "webServer.env.EMA_SERVICE_URL"
    value = var.ema_service_url
  }

  set {
    name  = "pipeline.env.KAFKA_HOST"
    value = var.kafka_host
  }

  set {
    name  = "pipeline.env.KAFKA_PORT"
    value = var.kafka_port
  }

  set {
    name  = "pipeline.env.KAFKA_USERNAME"
    value = var.kafka_username
  }

  set {
    name  = "pipeline.env.KAFKA_PASSWORD"
    value = var.kafka_password
  }

  set {
    name  = "pipeline.env.KAFKA_TOPIC"
    value = var.kafka_topic
  }

  set {
    name  = "pipeline.env.CONSUMER_GROUP"
    value = "anomaly-detection-pipeline"
  }

  set {
    name  = "pipeline.env.KAFKA_AUTH_ENABLED"
    value = "true"
  }

  set {
    name  = "pipeline.env.TIMESCALEDB_HOST"
    value = var.timescaledb_host
  }

  set {
    name  = "pipeline.env.TIMESCALEDB_PORT"
    value = var.timescaledb_port
  }

  set {
    name  = "pipeline.env.TIMESCALEDB_USER"
    value = var.timescaledb_username
  }

  set {
    name  = "pipeline.env.TIMESCALEDB_PASSWORD"
    value = var.timescaledb_password
  }

  set {
    name  = "pipeline.env.TIMESCALEDB_DBNAME"
    value = var.database_name_for_shms
  }

  set {
    name  = "pipeline.env.service_url"
    value = var.dhm_service_url
  }

  set {
    name  = "pipeline.env.x_api_key"
    value = var.api_key
  }

  depends_on = [
    helm_release.ema_service
  ]
}
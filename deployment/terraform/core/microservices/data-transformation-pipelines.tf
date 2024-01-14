resource "helm_release" "data_transformation_pipelines" {
  chart     = "${path.module}/../../../helm/data-transformation-pipelines"
  name      = "data-transformation-pipelines"
  namespace = kubernetes_namespace.shms_microservices.metadata[0].name

  set {
    name  = "env.MQTT_HOST"
    value = var.mqtt_host
  }

  set {
    name  = "env.MQTT_PORT"
    value = var.mqtt_port
  }

  set {
    name  = "env.MQTT_USERNAME"
    value = var.mqtt_username
  }

  set {
    name  = "env.MQTT_PASSWORD"
    value = var.mqtt_password
  }

  set {
    name  = "env.MQTT_TOPIC_FILTER"
    value = var.mqtt_topic
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
    value = var.dt_pipeline_kafka_producer_id
  }

  set {
    name  = "env.CONSUMER_GROUP"
    value = var.dt_pipeline_kafka_consumer_group
  }

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

  depends_on = [
    helm_release.ema_service
  ]
}
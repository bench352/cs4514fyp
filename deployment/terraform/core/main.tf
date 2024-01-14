terraform {
  required_version = "~> 1.6.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.24.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "2.12.1"
    }
  }
}

module "dependencies" {
  source = "./dependencies"

  providers = {
    kubernetes = kubernetes
    helm       = helm
  }

  config_context       = var.config_context
  mqtt_username        = var.mqtt_username
  mqtt_password        = var.mqtt_password
  timescaledb_password = var.timescaledb_password

  kafka_username = var.kafka_username
  kafka_password = var.kafka_password
  kafka_topic    = var.kafka_topic
}

module "microservices" {
  source = "./microservices"

  providers = {
    kubernetes = kubernetes
    helm       = helm
  }

  config_context       = var.config_context
  mqtt_username        = var.mqtt_username
  mqtt_password        = var.mqtt_password
  timescaledb_password = var.timescaledb_password

  jwt_secret            = var.jwt_secret
  master_admin_username = var.master_admin_username
  master_admin_password = var.master_admin_password

  dt_pipeline_kafka_consumer_group = "kafka-to-tsdb"
  dt_pipeline_kafka_producer_id    = "mqtt-to-kafka"
  device_data_svc_consumer_group   = "device-data-service"

  kafka_username = var.kafka_username
  kafka_password = var.kafka_password

  kafka_topic = var.kafka_topic
  mqtt_topic  = "realtime-telemetry-data"

  depends_on = [
    module.dependencies
  ]
}

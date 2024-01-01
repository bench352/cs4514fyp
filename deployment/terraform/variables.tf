variable "config_context" {
  description = "The name of the context to use in the kubeconfig file"
}

variable "mqtt_username" {
  description = "The username of the MQTT broker"
  sensitive   = true
}

variable "mqtt_password" {
  description = "The password of the MQTT broker"
  sensitive   = true
}

variable "timescaledb_password" {
  description = "The password of the TimescaleDB database"
  sensitive   = true
}

variable "jwt_secret" {
  description = "The secret to use for JWT token Generation"
  sensitive   = true
}

variable "master_admin_username" {
  description = "The username of the master admin"
  sensitive   = true
}

variable "master_admin_password" {
  description = "The password of the master admin"
  sensitive   = true
}

variable "kafka_username" {
  description = "The username of the Kafka cluster"
}

variable "kafka_password" {
  description = "The password of the Kafka cluster"
}

variable "kafka_topic" {
  description = "The topic to buffer telemetry data"
  default     = "realtime-telemetry-data"
}
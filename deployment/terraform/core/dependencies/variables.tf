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

variable "kafka_username" {
  description = "The username of the Kafka cluster"
}

variable "kafka_password" {
  description = "The password of the Kafka cluster"
}

variable "kafka_topic" {
  description = "The Kafka topic to be initialized"
}

variable "external_ip" {
  description = "The external IP of the Kafka cluster"
}
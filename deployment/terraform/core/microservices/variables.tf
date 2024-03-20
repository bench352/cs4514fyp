variable "config_context" {
  description = "The name of the context to use in the kubeconfig file"
}

variable "mqtt_host" {
  description = "The host of the MQTT broker"
  default     = "mosquitto.shms-dependencies"
}

variable "mqtt_port" {
  description = "The port of the MQTT broker"
  default     = 1883
}

variable "mqtt_username" {
  description = "The username of the MQTT broker"
  sensitive   = true
}

variable "mqtt_password" {
  description = "The password of the MQTT broker"
  sensitive   = true
}

variable "mqtt_topic" {
  description = "The topic to subscribe to"
}

variable "kafka_host" {
  description = "The host of the Kafka broker"
  default     = "kafka.shms-dependencies"
}

variable "kafka_port" {
  description = "The port of the Kafka broker"
  default     = 9092
}

variable "kafka_username" {
  description = "The username of the Kafka cluster"
}

variable "kafka_password" {
  description = "The password of the Kafka cluster"
}

variable "kafka_topic" {
  description = "The topic to buffer telemetry data"
}

variable "dt_pipeline_kafka_producer_id" {
  description = "The id to use for the Kafka producer"
}

variable "dt_pipeline_kafka_consumer_group" {
  description = "The consumer group to use for the Kafka consumer"
}

variable "device_data_svc_consumer_group" {
  description = "The consumer group to use for the Kafka consumer"
}

variable "timescaledb_host" {
  description = "The host of the TimescaleDB database"
  default     = "timescaledb.shms-dependencies"
}

variable "timescaledb_port" {
  description = "The port of the TimescaleDB database"
  default     = 5432

}

variable "timescaledb_username" {
  description = "The username of the TimescaleDB database"
  default     = "postgres"
}

variable "timescaledb_password" {
  description = "The password of the TimescaleDB database"
  sensitive   = true
}

variable "database_name_for_shms" {
  description = "The name of the database to use for the SHMS"
  default     = "smart_home_management_system"
}

variable "jwt_secret" {
  description = "The secret to use for JWT token Generation"
  sensitive   = true
}

variable "jwt_expire_in_minutes" {
  description = "The time in minutes for which the JWT token is valid"
  default     = 1440
}

variable "master_admin_username" {
  description = "The username of the master admin"
  sensitive   = true
}

variable "master_admin_password" {
  description = "The password of the master admin"
  sensitive   = true
}

variable "ema_service_url" {
  description = "The URL of the EMA service"
  default     = "http://ema-service.shms-microservices:8000"
}

variable "api_key" {
  description = "The API key for service to service authentication"
  sensitive   = true
}

variable "dhm_service_url" {
  description = "The URL of the Device Healthiness Monitoring Service Web Server"
  default     = "http://device-healthiness-monitoring-service.shms-microservices:8000"
}

variable "image_pull_policy" {
  description = "The image pull policy to use for the containers"
  default     = "IfNotPresent"
}

variable "external_ip" {
  description = "The external IP of the Kubernetes cluster"
}


variable "enable_demo" {
  description = "Enable additional resources for demonstration purposes"
  type        = bool
  default     = false
}
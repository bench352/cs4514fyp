resource "kubernetes_deployment" "random_data_generator" {
  count = var.enable_demo ? 1 : 0
  metadata {
    name      = "random-data-generator"
    namespace = kubernetes_namespace.shms_microservices.metadata[0].name
    labels    = {
      app = "random-data-generator"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "random-data-generator"
      }
    }
    template {
      metadata {
        labels = {
          app = "random-data-generator"
        }
      }
      spec {
        container {
          name              = "random-data-generator"
          image             = "bench352/cs4514-random-data-generator:latest"
          image_pull_policy = var.image_pull_policy
          env {
            name  = "EMA_SERVICE_URL"
            value = var.ema_service_url
          }
          env {
            name  = "EMA_USERNAME"
            value = var.master_admin_username
          }
          env {
            name  = "EMA_PASSWORD"
            value = var.master_admin_password
          }
          env {
            name  = "MQTT_HOST"
            value = var.mqtt_host
          }
          env {
            name  = "MQTT_PORT"
            value = var.mqtt_port
          }
          env {
            name  = "MQTT_USERNAME"
            value = var.mqtt_username
          }
          env {
            name  = "MQTT_PASSWORD"
            value = var.mqtt_password
          }
          env {
            name  = "MQTT_TOPIC"
            value = var.mqtt_topic
          }
        }
      }
    }
  }
  depends_on = [helm_release.ema_service, helm_release.data_transformation_pipelines, kubernetes_job.demo_data]
}
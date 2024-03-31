resource "kubernetes_deployment" "iot_device_simulator" {
  count = var.enable_demo ? 1 : 0
  metadata {
    name      = "iot-device-simulator"
    namespace = kubernetes_namespace.shms_microservices.metadata[0].name
    labels    = {
      app = "iot-device-simulator"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "iot-device-simulator"
      }
    }
    template {
      metadata {
        labels = {
          app = "iot-device-simulator"
        }
      }
      spec {
        container {
          name              = "iot-device-simulator"
          image             = "bench352/cs4514-iot-device-simulator"
          image_pull_policy = var.image_pull_policy
          command           = [
            "poetry",
            "run",
            "python3",
            "main.py",
            "--device-name",
            "a-simulated-sensor",
            "--mqtt-host",
            var.mqtt_host,
            "--mqtt-port",
            var.mqtt_port,
            "--mqtt-topic",
            var.mqtt_topic,
            "--mqtt-username",
            var.mqtt_username,
            "--mqtt-password",
            var.mqtt_password,
            "--ema-service-url",
            var.ema_service_url,
            "--ema-username",
            var.master_admin_username,
            "--ema-password",
            var.master_admin_password,
            "rt"
          ]
        }
      }
    }
  }
  depends_on = [helm_release.ema_service, helm_release.data_transformation_pipelines, kubernetes_job.demo_data]
}
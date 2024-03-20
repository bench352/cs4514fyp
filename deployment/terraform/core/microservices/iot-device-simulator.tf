resource "kubernetes_job" "iot_device_simulator" {
  count = var.enable_demo ? 1 : 0
  metadata {
    name      = "iot-device-simulator"
    namespace = kubernetes_namespace.shms_microservices.metadata[0].name
  }
  spec {
    template {
      metadata {}
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
  wait_for_completion = false
  depends_on          = [helm_release.ema_service, helm_release.data_transformation_pipelines]
}
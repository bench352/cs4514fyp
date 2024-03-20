resource "kubernetes_manifest" "device_healthiness_monitoring_service_ingressroute" {
  manifest   = yamldecode(file("${path.module}/traefik/device-healthiness-monitoring-service-ingressroute.yaml"))
  depends_on = [
    kubernetes_manifest.device_healthiness_monitoring_service_middleware
  ]
}

resource "kubernetes_manifest" "device_healthiness_monitoring_service_middleware" {
  manifest = yamldecode(file("${path.module}/traefik/device-healthiness-monitoring-service-middleware.yaml"))
}

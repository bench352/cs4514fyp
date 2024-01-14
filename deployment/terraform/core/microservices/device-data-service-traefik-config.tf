resource "kubernetes_manifest" "device_data_service_ingressroute" {
  manifest   = yamldecode(file("${path.module}/traefik/device-data-service-ingressroute.yaml"))
  depends_on = [
    kubernetes_manifest.ema_service_middleware
  ]
}

resource "kubernetes_manifest" "device_data_service_middleware" {
  manifest = yamldecode(file("${path.module}/traefik/device-data-service-middleware.yaml"))
}

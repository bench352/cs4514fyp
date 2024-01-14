resource "kubernetes_manifest" "ema_service_ingressroute" {
  manifest   = yamldecode(file("${path.module}/traefik/ema-service-ingressroute.yaml"))
  depends_on = [
    kubernetes_manifest.ema_service_middleware
  ]
}

resource "kubernetes_manifest" "ema_service_middleware" {
  manifest = yamldecode(file("${path.module}/traefik/ema-service-middleware.yaml"))
}

resource "helm_release" "web_ui" {
  chart     = "${path.module}/../../../helm/web-ui"
  name      = "web-ui"
  namespace = kubernetes_namespace.shms_microservices.metadata[0].name

  set {
    name  = "image.pullPolicy"
    value = var.image_pull_policy
  }

  set {
    name  = "env.REACT_APP_DEVICE_DATA_SERVICE_URL"
    value = "http://${var.external_ip}/data"
  }

  set {
    name  = "env.REACT_APP_DEVICE_DATA_SERVICE_WS_URL"
    value = "ws://${var.external_ip}/data"
  }

  set {
    name  = "env.REACT_APP_DEVICE_HEALTH_SERVICE_URL"
    value = "http://${var.external_ip}/dhms"
  }

  set {
    name  = "env.REACT_APP_DEVICE_HEALTH_SERVICE_WS_URL"
    value = "ws://${var.external_ip}/dhms"
  }

  set {
    name  = "env.REACT_APP_EMA_SERVICE_URL"
    value = "http://${var.external_ip}/ema"
  }

  depends_on = [
    helm_release.ema_service,
    helm_release.device_data_service,
    helm_release.device_healthiness_monitoring_service
  ]
}
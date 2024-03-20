resource "kubernetes_job" "demo_data" {
  count = var.enable_demo ? 1 : 0
  metadata {
    name      = "demo-data"
    namespace = kubernetes_namespace.shms_microservices.metadata[0].name
  }
  spec {
    template {
      metadata {}
      spec {
        container {
          name              = "demo-data"
          image             = "bench352/cs4514-demo-data"
          image_pull_policy = var.image_pull_policy
          env {
            name  = "EMA_SERVICE_URL"
            value = var.ema_service_url
          }
          env {
            name  = "MASTER_ADMIN_USERNAME"
            value = var.master_admin_username
          }
          env {
            name  = "MASTER_ADMIN_PASSWORD"
            value = var.master_admin_password
          }
        }
        restart_policy = "OnFailure"
      }
    }
  }
  wait_for_completion = true
  depends_on          = [helm_release.ema_service]
}
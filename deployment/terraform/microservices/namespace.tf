resource "kubernetes_namespace" "shms_microservices" {
  metadata {
    name = "shms-microservices"
  }
}


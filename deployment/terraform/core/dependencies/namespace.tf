resource "kubernetes_namespace" "shms_dependencies" {
  metadata {
    name = "shms-dependencies"
  }
}
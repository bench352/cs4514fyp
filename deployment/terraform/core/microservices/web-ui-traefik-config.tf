resource "kubernetes_manifest" "web_ui_ingressroute" {
  manifest = yamldecode(file("${path.module}/traefik/web-ui-ingressroute.yaml"))
}

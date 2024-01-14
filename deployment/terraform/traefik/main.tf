terraform {
  required_version = "~> 1.6.0"
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = "2.12.1"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.24.0"
    }
  }
}

resource "kubernetes_namespace" "networking" {
  metadata {
    name = "networking"
  }
}


resource "helm_release" "traefik" {
  chart      = "traefik"
  name       = "traefik"
  repository = "https://traefik.github.io/charts"
  namespace  = kubernetes_namespace.networking.metadata[0].name

  version = "26.0.0"


  set {
    name  = "providers.kubernetesCRD.allowCrossNamespace"
    value = "true"
  }
}
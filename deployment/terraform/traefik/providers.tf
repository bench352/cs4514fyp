provider "helm" {
  kubernetes {
    config_path    = "~/.kube/config"
    config_context = var.config_context
  }
}

provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = var.config_context
}

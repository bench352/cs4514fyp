resource "helm_release" "mqtt" {
  chart      = "mosquitto"
  name       = "mosquitto"
  repository = "https://k8s-at-home.com/charts/"
  namespace  = kubernetes_namespace.shms_dependencies.metadata[0].name

  version = "4.8.2"

  set {
    name  = "auth.enabled"
    value = "true"
  }

  set {
    name  = "persistence.data.enabled"
    value = "true"
  }

  set {
    name  = "persistence.data.size"
    value = "1Gi"
  }

  set {
    name  = "persistence.data.accessMode"
    value = "ReadWriteOnce"
  }

  set {
    name  = "persistence.configinc.enabled"
    value = "true"
  }

  set {
    name  = "persistence.configinc.size"
    value = "1Gi"
  }

  set {
    name  = "persistence.configinc.accessMode"
    value = "ReadWriteOnce"
  }

  set {
    name  = "service.main.type"
    value = "NodePort"
  }

  set {
    name  = "service.main.ports.mqtt.nodePort"
    value = "31883"
  }

  provisioner "local-exec" {
    interpreter = ["bash", "-c"]
    command     = "sh ${path.module}/init-scripts/init-mqtt-cred.sh"
    environment = {
      NAMESPACE      = kubernetes_namespace.shms_dependencies.metadata[0].name
      CONFIG_CONTEXT = var.config_context
      MQTT_USERNAME  = var.mqtt_username
      MQTT_PASSWORD  = var.mqtt_password
    }
  }
}


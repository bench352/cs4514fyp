resource "helm_release" "kafka" {
  chart     = "oci://registry-1.docker.io/bitnamicharts/kafka"
  name      = "kafka"
  namespace = kubernetes_namespace.shms_dependencies.metadata[0].name

  version = "26.6.2"

  set {
    name  = "controller.replicaCount"
    value = 1
  }

  set {
    name  = "broker.replicaCount"
    value = 3
  }

  set {
    name  = "sasl.client.users[0]"
    value = var.kafka_username
  }

  set {
    name  = "sasl.client.passwords"
    value = var.kafka_password
  }

  set {
    name  = "serviceAccount.create"
    value = true
  }

  set {
    name  = "rbac.create"
    value = true
  }

  set {
    name  = "externalAccess.enabled"
    value = true
  }

  set {
    name  = "externalAccess.controller.service.type"
    value = "NodePort"
  }

  set {
    name  = "externalAccess.controller.service.nodePorts[0]"
    value = 30092
  }

  set {
    name  = "externalAccess.controller.service.externalIPs[0]"
    value = "192.168.68.110"
  }

  set {
    name  = "externalAccess.broker.service.type"
    value = "NodePort"
  }

  dynamic "set" {
    for_each = range(3)
    content {
      name  = "externalAccess.broker.service.nodePorts[${set.key}]"
      value = 30093 + set.key
    }
  }

  dynamic "set" {
    for_each = range(3)
    content {
      name  = "externalAccess.broker.service.externalIPs[${set.key}]"
      value = "192.168.68.110"
    }
  }

  set {
    name  = "provisioning.enabled"
    value = true
  }

  set {
    name  = "provisioning.topics[0].name"
    value = var.kafka_topic
  }

  set {
    name  = "provisioning.topics[0].partitions"
    value = 3
  }

  set {
    name  = "provisioning.topics[0].replicationFactor"
    value = 1
  }
}

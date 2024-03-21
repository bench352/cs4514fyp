resource "helm_release" "kafka" {
  chart     = "oci://registry-1.docker.io/bitnamicharts/kafka"
  name      = "kafka"
  namespace = kubernetes_namespace.shms_dependencies.metadata[0].name

  timeout = 600  # 10 minutes

  version = "26.6.2"

  set {
    name  = "controller.replicaCount"
    value = 1
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
    value = var.external_ip
  }

  set {
    name  = "provisioning.enabled"
    value = true
  }

  set {
    name  = "provisioning.replicationFactor"
    value = 1
  }

  set {
    name  = "provisioning.topics[0].name"
    value = var.kafka_topic
  }

  set {
    name  = "provisioning.topics[0].partitions"
    value = 1
  }

  set {
    name  = "provisioning.topics[0].replicationFactor"
    value = 1
  }

  set {
    name  = "provisioning.topics[0].replicationFactor"
    value = 1
  }

  set {
    name  = "controller.extraConfig"
    value = "offsets.topic.replication.factor=1\ntransaction.state.log.replication.factor=1"
  }
}

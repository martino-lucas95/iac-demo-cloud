terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "iac_terraform" {
  metadata {
    name = "iac-terraform"
  }
}

resource "kubernetes_deployment" "nginx" {
  metadata {
    name      = "nginx-tf"
    namespace = kubernetes_namespace.iac_terraform.metadata.0.name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "nginx-tf"
      }
    }

    template {
      metadata {
        labels = {
          app = "nginx-tf"
        }
      }

      spec {
        container {
          image = "nginx:latest"
          name  = "nginx"
          
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "nginx" {
  metadata {
    name      = "nginx-tf"
    namespace = kubernetes_namespace.iac_terraform.metadata.0.name
  }
  spec {
    selector = {
      app = kubernetes_deployment.nginx.spec.0.selector.0.match_labels.app
    }
    port {
      port        = 80
      target_port = 80
    }
    type = "LoadBalancer"
  }
}
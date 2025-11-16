resource "kubernetes_namespace" "iac_demo" {
  metadata {
    name = "iac-demo"
  }
}

resource "kubernetes_deployment" "hello_app" {
  metadata {
    name      = "hello-app"
    namespace = kubernetes_namespace.iac_demo.metadata[0].name
    labels = {
      app = "hello"
    }
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "hello"
      }
    }

    template {
      metadata {
        labels = {
          app = "hello"
        }
      }

      spec {
        container {
          image = "nginx"
          name  = "hello"
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

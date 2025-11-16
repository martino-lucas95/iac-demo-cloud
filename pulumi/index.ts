import * as k8s from "@pulumi/kubernetes";

const appLabels = { app: "nginx" };
    
const ns = new k8s.core.v1.Namespace("iac-demo", {
  metadata: { name: "iac-demo" },
});
    
const config = new k8s.core.v1.ConfigMap("app-config", {
  metadata: {
    name: "app-config",
    namespace: "iac-demo",
  },
  data: {
    message: "Hello from Pulumi!",
    environment: "dev",
  },
});
    
const deployment = new k8s.apps.v1.Deployment("nginx", {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels },
            spec: { containers: [{ name: "nginx", image: "nginx" }] }
        }
    }
});
export const name = deployment.metadata.name;

import * as k8s from "@pulumi/kubernetes";

// 1. Crear el Namespace
const ns = new k8s.core.v1.Namespace("iac-pulumi", {
    metadata: { name: "iac-pulumi" }
});

// 2. Crear el Deployment
const appLabels = { app: "nginx" };
const deployment = new k8s.apps.v1.Deployment("nginx", {
    metadata: { 
        namespace: ns.metadata.name
     },
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels },
            spec: { 
                containers: [{ 
                    name: "nginx",
                    image: "nginx",
                    imagePullPolicy: "IfNotPresent",
                    ports: [{ containerPort: 80 }] 
                }] 
            }
        }
    }
});

// 3. Crear el Service
const service = new k8s.core.v1.Service("nginx", {
    metadata: { 
        name: "nginx", 
        namespace: ns.metadata.name },
    spec: {
        ports: [{ port: 80, targetPort: 80 }],
        selector: appLabels,
        type: "LoadBalancer"
    }
});

// 4. Exportar el nombre del Deployment
export const name = deployment.metadata.name;

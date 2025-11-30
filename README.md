# Informe de Demostración: Infraestructura como Código (IaC)
## Terraform vs. Pulumi en Kubernetes

**Objetivo:** Demostrar y comparar dos enfoques de IaC (Declarativo vs. Programático) mediante el despliegue de recursos idénticos en un cluster de Kubernetes.

---

### 1. Prerrequisitos del Entorno

Para la ejecución exitosa de esta demostración, se requiere:

*   **Cluster de Kubernetes** activo (Docker Desktop, Minikube, Kind, etc.).
*   **Herramientas CLI instaladas:** `terraform`, `pulumi`, `node`, `npm`, `kubectl`.
*   **Visualización:** `k9s` (Recomendado para observar cambios en tiempo real).

---

### 2. Escenario A: Terraform (Enfoque Declarativo)

Terraform utiliza **HCL (HashiCorp Configuration Language)** para definir el *estado deseado* de la infraestructura. El flujo de trabajo se basa en planificar y aplicar cambios para converger a ese estado.

#### Paso 1: Inicialización
Prepara el directorio de trabajo y descarga los proveedores necesarios (en este caso, el provider de Kubernetes).

```bash
cd terraform
terraform init
```

#### Paso 2: Planificación (Dry Run)
Genera un plan de ejecución, mostrando qué acciones realizará Terraform sin modificar la infraestructura real.

```bash
terraform plan
```
*Observación:*  Terraform identifica que los recursos "serán creados" (+).

#### Paso 3: Despliegue (Apply)
Aplica los cambios para alcanzar el estado deseado.

```bash
terraform apply
# Escribir 'yes' para confirmar 
```
*Verificación en k9s:* Filtrar por namespace `iac-terraform`. Se observará el despliegue `nginx-tf` con 1 réplica.

#### Paso 4: Modificación de Infraestructura
Modificaremos el archivo `main.tf` para escalar el servicio.
1. Editar `terraform/main.tf`.
2. Cambiar `replicas = 1` a `replicas = 3`.
3. Aplicar el cambio:

```bash
terraform apply
```
*Observación:* Terraform detecta el "drift" (diferencia) entre el estado actual y el deseado, modificando solo lo necesario (escalado) sin recrear el servicio.

#### Paso 5: Limpieza
Eliminación de todos los recursos gestionados.

```bash
terraform destroy
```

---

### 3. Escenario B: Pulumi (Enfoque Programático)

Pulumi permite definir infraestructura utilizando lenguajes de programación de propósito general (TypeScript, Python, Go, etc.), ofreciendo abstracciones, bucles y tipado fuerte.

#### Paso 1: Preparación de Dependencias
Instalación de paquetes de Node.js necesarios.

```bash
cd ../pulumi
npm install
```

#### Paso 2: Planificación (Preview)
Genera una previsualización de los cambios, similar al `plan` de Terraform.

```bash
pulumi preview
```

#### Paso 3: Despliegue (Up)
Compila el programa TypeScript y aplica los cambios. Nota que `up` también muestra un preview antes de confirmar.

```bash
pulumi up
# Seleccionar 'yes' para confirmar
```
*Verificación en k9s:* Filtrar por namespace `iac-pulumi`. Se observarán recursos análogos a los de Terraform.

#### Paso 4: Modificación (Escalado)
Aprovechamos el lenguaje para modificar la configuración.
1. Editar `pulumi/index.ts`.
2. Cambiar la constante `replicas: 1` a `replicas: 3`.
3. Actualizar el despliegue:

```bash
pulumi up
```
*Observación:* La actualización se realiza de manera incremental. En este punto, se puede destacar cómo el uso de variables y lógica de programación facilita refactorizaciones complejas.

#### Paso 5: Limpieza
Destrucción de la pila (stack) de recursos.

```bash
pulumi destroy
```

---

### 4. Conclusiones Clave

| Característica | Terraform (HCL) | Pulumi (TypeScript) |
| :--- | :--- | :--- |
| **Lenguaje** | Específico de dominio (DSL), estático. | Propósito general (GPPL), dinámico. |
| **Curva de Aprendizaje** | Fácil de leer, estricto. | Requiere conocimiento de programación. |
| **Estado** | Gestión de `tfstate`. | Gestión de estado en Backend Service o local. |
| **Flexibilidad** | Limitada a las funciones de HCL. | Total (bucles, condicionales, librerías externas). |


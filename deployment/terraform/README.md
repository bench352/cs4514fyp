# Deploy Smart Home Management System to Kubernetes Cluster with Terraform

The Smart Home Management System can be deployed to a Kubernetes cluster with Terraform, which will deploy everything for you in just a few steps. The Terraform scripts to deploy the entire system are contained in this directory.

## Prerequisites

This deployment method assumes you have a basic understanding of both Kubernetes and Terraform. Here are the necessary software tools for carrying out this deployment method:

- [Terraform](https://www.terraform.io/): This is required to go through the entire deployment process. You can install it on your computer by following the [official installation guide](https://developer.hashicorp.com/terraform/install).
- A [Kubernetes](https://kubernetes.io/) cluster: You must have an accessible Kubernetes cluster and the Kubernetes config to access it. If you haven't got one already, you can set up a Kubernetes cluster on your computer using [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) or [microk8s](https://microk8s.io/), or use a managed Kubernetes provider like [Amazon Elastic Kubernetes Service](https://aws.amazon.com/eks/) or [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/).
- [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) terminal: This deployment uses shell scripts to automate some of the provisioning tasks, so a bash terminal is required for the deployment. If you are using Windows, you can use [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about) to go through the Terraform deployment.

If everything is ready, you can start the deployment process by following the steps below.

> This deployment procedure is tested on a [microk8s](https://microk8s.io/) instance running on [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about).

## Deploy Traefik

Traefik is used to route the traffic from outside to the corresponding microservice. It has to be deployed separately before deploying other components of the system.

1. Change to the `traefik` directory.

    ```bash
    cd traefik
    ```
2. Configure the `terraform.tfvars` file. The `terraform.tfvars.example` file is provided for your reference.

3. Initialize Terraform.

    ```bash
    terraform init
    ```
4. Deploy Traefik.

    ```bash
    terraform apply
    ```
   or if you'd like to save some time:

    ```bash
    terraform apply -auto-approve
    ```

## Deploy the Smart Home Management System

Now that you have Traefik ready, you can deploy the rest of the components in the system.

1. Change to the `core` directory.

    ```bash
    cd core
    ```

2. Configure the `terraform.tfvars` file. The `terraform.tfvars.example` file is provided for your reference.

3. Initialize Terraform.

    ```bash
    terraform init
    ```

4. Deploy the Smart Home Management System.

    ```bash
    terraform apply
    ```

   or if you'd like to save some time:

     ```bash
     terraform apply -auto-approve
     ```

Database schemas and credentials will be initiated automatically. So you are all set!

> **Note:** If you want to update the database password, you cannot do it directly via Terraform since it is already stored in the database. Please manually update the password in the database. However, you still have to reapply the new password to the microservices by performing `terraform apply` again.

## Try It Out

After the deployment is complete, you can access the Smart Home Management System by entering the `external_ip` of your Kubernetes cluster in your web browser. You will be greeted by the login page of the system.

Enter the username and password that is configured in the `terraform.tfvars` file (`master_admin_username` and `master_admin_password`) to log in. You can then start using different features of the system.

If you have set `enable_demo` to `true` in the `terraform.tfvars` file, the fresh instance will come with demo data. You can learn more about the demo data [here](../../extra-info/DEMO-DATA.md).

## Clean Up

Cleaning up the deployment is just as easy as deploying it. You can completely remove the Smart Home Management System from your Kubernetes cluster by following the steps below:

1. Change to the `core` directory.

    ```bash
    cd core
    ```
2. Tear down all deployed resources related to the Smart Home Management System.

    ```bash
    terraform destroy
    ```
   or if you'd like to save some time:

   ```bash
   terraform destroy -auto-approve
   ```

3. Change to the `traefik` directory.

   ```bash
   cd ../traefik
   ```

4. Remove Traefik from your Kubernetes cluster.

    ```bash
    terraform destroy
    ```

   or if you'd like to save some time:

   ```bash
   terraform destroy -auto-approve
   ```

You have now completely removed the Smart Home Management System from your Kubernetes cluster.